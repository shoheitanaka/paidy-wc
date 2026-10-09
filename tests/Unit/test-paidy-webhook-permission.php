<?php
/**
 * Tests for the Paidy webhook (POST /wp-json/paidy/v1/order).
 *
 * The route used to be registered with `__return_true`, so anyone could mark a
 * pending Paidy order as paid by posting its order number with
 * `status=authorize_success` (the Broken Access Control reported by Wordfence and
 * fixed in Japanized for WooCommerce 2.9.13). The route now requires either a valid
 * `x-paidy-signature` (HMAC-SHA256 of the body with the API secret key of the
 * active environment) or a request from one of Paidy's webhook source IPs, and the
 * handler only completes a Paidy order after confirming the payment with the
 * Paidy API. Covers the permission callback, the handler's order checks and the
 * deferred construction of WC_Paidy_Endpoint.
 *
 * @package paidy-wc
 */

/**
 * WC_Paidy_Webhook_Permission_Test
 */
class WC_Paidy_Webhook_Permission_Test extends WP_UnitTestCase {

	/**
	 * Live API secret key stored in the gateway settings.
	 */
	const LIVE_SECRET = 'sk_live_paidy_wc_webhook_test';

	/**
	 * Test (sandbox) API secret key stored in the gateway settings.
	 */
	const TEST_SECRET = 'sk_test_paidy_wc_webhook_test';

	/**
	 * An address that is not one of Paidy's webhook source IPs (TEST-NET-3).
	 */
	const OTHER_IP = '203.0.113.10';

	/**
	 * Payment ID used by the webhook payloads (not Paidy's test id pay_0000000000000001).
	 */
	const PAYMENT_ID = 'pay_WD1K-j4AALQAI_tZ';

	/**
	 * $_SERVER keys this test overwrites, with their original values (null = unset).
	 *
	 * @var array<string, string|null>
	 */
	private $original_server = array();

	/**
	 * URLs requested through the WP HTTP API during a test.
	 *
	 * @var string[]
	 */
	private $requested_urls = array();

	/**
	 * Payment object the mocked Paidy API returns, or null for an empty body.
	 *
	 * @var array|null
	 */
	private $mock_payment = null;

	/**
	 * Set up test environment before each test.
	 */
	public function setUp(): void {
		parent::setUp();

		if ( ! class_exists( 'WC_Paidy_Endpoint' ) ) {
			require_once dirname( __DIR__, 2 ) . '/includes/gateways/paidy/class-wc-paidy-endpoint.php';
		}
		$this->assertTrue( class_exists( 'WC_Paidy_Endpoint' ), 'WC_Paidy_Endpoint should be loadable.' );

		foreach ( array( 'REMOTE_ADDR', 'HTTP_X_FORWARDED_FOR' ) as $key ) {
			$this->original_server[ $key ] = isset( $_SERVER[ $key ] ) ? $_SERVER[ $key ] : null; // phpcs:ignore WordPress.Security.ValidatedSanitizedInput -- Saved verbatim to restore in tearDown().
		}
		$_SERVER['REMOTE_ADDR'] = self::OTHER_IP;
		unset( $_SERVER['HTTP_X_FORWARDED_FOR'] );

		$this->requested_urls = array();
		$this->mock_payment   = null;
		add_filter( 'pre_http_request', array( $this, 'mock_paidy_api' ), 10, 3 );
	}

	/**
	 * Clean up after each test.
	 */
	public function tearDown(): void {
		remove_filter( 'pre_http_request', array( $this, 'mock_paidy_api' ), 10 );

		foreach ( $this->original_server as $key => $value ) {
			if ( null === $value ) {
				unset( $_SERVER[ $key ] );
			} else {
				$_SERVER[ $key ] = $value;
			}
		}

		parent::tearDown();
	}

	/**
	 * Short-circuit every HTTP request, recording the URL and answering as Paidy would.
	 *
	 * @param false|array|WP_Error $preempt     Whether to preempt the request.
	 * @param array                $parsed_args Request arguments.
	 * @param string               $url         Request URL.
	 * @return array Mocked HTTP response.
	 */
	public function mock_paidy_api( $preempt, $parsed_args, $url ) {
		$this->requested_urls[] = $url;

		return array(
			'headers'  => array(),
			'body'     => null === $this->mock_payment ? '' : wp_json_encode( $this->mock_payment ),
			'response' => array(
				'code'    => 200,
				'message' => 'OK',
			),
			'cookies'  => array(),
			'filename' => null,
		);
	}

	/**
	 * Save the gateway settings and build an endpoint that reads them.
	 *
	 * @param array $settings Settings overriding the defaults (sandbox, both keys set).
	 * @return WC_Paidy_Endpoint
	 */
	private function make_endpoint( array $settings = array() ) {
		update_option(
			'woocommerce_paidy_settings',
			array_merge(
				array(
					'enabled'             => 'yes',
					'environment'         => 'sandbox',
					'api_secret_key'      => self::LIVE_SECRET,
					'test_api_secret_key' => self::TEST_SECRET,
					'debug'               => 'no',
				),
				$settings
			)
		);

		return new WC_Paidy_Endpoint();
	}

	/**
	 * Build a webhook request as Paidy sends it.
	 *
	 * @param array       $payload   Webhook body.
	 * @param string|null $signature Value of the x-paidy-signature header, or null for none.
	 * @return WP_REST_Request
	 */
	private function make_request( array $payload, $signature = null ) {
		$request = new WP_REST_Request( 'POST', '/paidy/v1/order' );
		$request->set_header( 'Content-Type', 'application/json' );
		$request->set_body( wp_json_encode( $payload ) );
		if ( null !== $signature ) {
			$request->set_header( 'x-paidy-signature', $signature );
		}
		return $request;
	}

	/**
	 * Webhook payload for an order.
	 *
	 * @param WC_Order $order  Order the notification is about.
	 * @param string   $status Paidy webhook status.
	 * @return array
	 */
	private function payload_for( WC_Order $order, $status = 'authorize_success' ) {
		return array(
			'payment_id' => self::PAYMENT_ID,
			'order_ref'  => (string) $order->get_id(),
			'status'     => $status,
		);
	}

	/**
	 * Create a pending order for 1,000 JPY with one physical product.
	 *
	 * A physical line item keeps payment_complete() at "processing", so the
	 * completed-status capture hook never calls the Paidy API in these tests.
	 *
	 * @param string $payment_method Payment method id.
	 * @return WC_Order
	 */
	private function create_order( $payment_method = 'paidy' ) {
		$product = new WC_Product_Simple();
		$product->set_name( 'Paidy webhook test product' );
		$product->set_regular_price( '1000' );
		$product->save();

		$order = wc_create_order();
		$order->add_product( $product, 1 );
		$order->set_payment_method( $payment_method );
		$order->calculate_totals();
		$order->set_status( 'pending' );
		$order->save();

		return $order;
	}

	/**
	 * Paidy API answer for a payment that belongs to the order.
	 *
	 * @param WC_Order $order Order the payment belongs to.
	 * @return array
	 */
	private function payment_for( WC_Order $order ) {
		return array(
			'id'     => self::PAYMENT_ID,
			'status' => 'authorized',
			'amount' => (float) $order->get_total(),
			'order'  => array(
				'order_ref' => (string) $order->get_id(),
			),
		);
	}

	/**
	 * Assert that a value is a WP_Error with the given code and HTTP status.
	 *
	 * @param mixed  $result Value to check.
	 * @param string $code   Expected error code.
	 * @param int    $status Expected HTTP status.
	 */
	private function assert_wp_error_with_status( $result, $code, $status ) {
		$this->assertWPError( $result );
		$this->assertSame( $code, $result->get_error_code() );
		$this->assertSame( $status, $result->get_error_data()['status'] );
	}

	/**
	 * In the sandbox environment the signature is checked with the test secret key.
	 */
	public function test_signature_made_with_test_key_is_accepted_in_sandbox() {
		$endpoint = $this->make_endpoint();
		$body     = wp_json_encode( array( 'payment_id' => self::PAYMENT_ID ) );
		$request  = $this->make_request( array( 'payment_id' => self::PAYMENT_ID ), hash_hmac( 'sha256', $body, self::TEST_SECRET ) );

		$this->assertTrue( $endpoint->paidy_webhook_permission_check( $request ) );
	}

	/**
	 * The gateway has no "testmode" option: the key is chosen from "environment",
	 * so a sandbox site must not verify signatures with the live key.
	 */
	public function test_signature_made_with_live_key_is_rejected_in_sandbox() {
		$endpoint = $this->make_endpoint();
		$body     = wp_json_encode( array( 'payment_id' => self::PAYMENT_ID ) );
		$request  = $this->make_request( array( 'payment_id' => self::PAYMENT_ID ), hash_hmac( 'sha256', $body, self::LIVE_SECRET ) );

		$this->assert_wp_error_with_status( $endpoint->paidy_webhook_permission_check( $request ), 'paidy_invalid_signature', 403 );
	}

	/**
	 * In the live environment the signature is checked with the live secret key.
	 */
	public function test_signature_made_with_live_key_is_accepted_in_live() {
		$endpoint = $this->make_endpoint( array( 'environment' => 'live' ) );
		$body     = wp_json_encode( array( 'payment_id' => self::PAYMENT_ID ) );

		$this->assertTrue( $endpoint->paidy_webhook_permission_check( $this->make_request( array( 'payment_id' => self::PAYMENT_ID ), hash_hmac( 'sha256', $body, self::LIVE_SECRET ) ) ) );
		$this->assert_wp_error_with_status(
			$endpoint->paidy_webhook_permission_check( $this->make_request( array( 'payment_id' => self::PAYMENT_ID ), hash_hmac( 'sha256', $body, self::TEST_SECRET ) ) ),
			'paidy_invalid_signature',
			403
		);
	}

	/**
	 * A signature that does not match the body is rejected, even from a Paidy IP.
	 */
	public function test_invalid_signature_is_rejected() {
		$_SERVER['REMOTE_ADDR'] = WC_Paidy_Endpoint::PAIDY_WEBHOOK_IPS[0];
		$endpoint               = $this->make_endpoint();
		$request                = $this->make_request( array( 'payment_id' => self::PAYMENT_ID ), hash_hmac( 'sha256', 'another body', self::TEST_SECRET ) );

		$this->assert_wp_error_with_status( $endpoint->paidy_webhook_permission_check( $request ), 'paidy_invalid_signature', 403 );
	}

	/**
	 * A signed request cannot be verified when the secret key of the environment is empty.
	 */
	public function test_signature_without_configured_secret_key_is_a_configuration_error() {
		$endpoint = $this->make_endpoint( array( 'test_api_secret_key' => '' ) );
		$request  = $this->make_request( array( 'payment_id' => self::PAYMENT_ID ), 'any-signature' );

		$this->assert_wp_error_with_status( $endpoint->paidy_webhook_permission_check( $request ), 'paidy_config_error', 500 );
	}

	/**
	 * Unsigned notifications from Paidy's webhook source IPs are accepted.
	 */
	public function test_unsigned_request_from_paidy_ip_is_accepted() {
		$endpoint = $this->make_endpoint();

		foreach ( WC_Paidy_Endpoint::PAIDY_WEBHOOK_IPS as $ip ) {
			$_SERVER['REMOTE_ADDR'] = $ip;
			$this->assertTrue( $endpoint->paidy_webhook_permission_check( $this->make_request( array() ) ), "{$ip} should be allowed." );
		}
	}

	/**
	 * Unsigned requests from any other address are rejected.
	 */
	public function test_unsigned_request_from_other_ip_is_rejected() {
		$endpoint = $this->make_endpoint();

		$this->assert_wp_error_with_status( $endpoint->paidy_webhook_permission_check( $this->make_request( array() ) ), 'paidy_unauthorized', 403 );
	}

	/**
	 * X-Forwarded-For is attacker-controlled and ignored unless proxy headers are trusted.
	 */
	public function test_forwarded_for_header_is_ignored_by_default() {
		$_SERVER['HTTP_X_FORWARDED_FOR'] = WC_Paidy_Endpoint::PAIDY_WEBHOOK_IPS[0];
		$endpoint                        = $this->make_endpoint();

		$this->assert_wp_error_with_status( $endpoint->paidy_webhook_permission_check( $this->make_request( array() ) ), 'paidy_unauthorized', 403 );
	}

	/**
	 * Behind a trusted reverse proxy the first X-Forwarded-For address is used.
	 */
	public function test_forwarded_for_header_is_used_when_proxy_headers_are_trusted() {
		add_filter( 'paidy_trust_proxy_headers', '__return_true' );
		$_SERVER['HTTP_X_FORWARDED_FOR'] = WC_Paidy_Endpoint::PAIDY_WEBHOOK_IPS[0] . ', 10.0.0.1';
		$endpoint                        = $this->make_endpoint();

		$this->assertTrue( $endpoint->paidy_webhook_permission_check( $this->make_request( array() ) ) );
	}

	/**
	 * Operators can extend the allowlist with the paidy_webhook_allowed_ips filter.
	 */
	public function test_allowlist_filter_can_add_an_address() {
		add_filter(
			'paidy_webhook_allowed_ips',
			function ( $ips ) {
				$ips[] = self::OTHER_IP;
				return $ips;
			}
		);
		$endpoint = $this->make_endpoint();

		$this->assertTrue( $endpoint->paidy_webhook_permission_check( $this->make_request( array() ) ) );
	}

	/**
	 * Emptying the allowlist explicitly opts out of IP verification.
	 */
	public function test_emptied_allowlist_lets_unsigned_requests_through() {
		add_filter( 'paidy_webhook_allowed_ips', '__return_empty_array' );
		$endpoint = $this->make_endpoint();

		$this->assertTrue( $endpoint->paidy_webhook_permission_check( $this->make_request( array() ) ) );
	}

	/**
	 * The order route is no longer public; the check route stays open (it changes no state).
	 */
	public function test_order_route_uses_the_permission_check() {
		$routes = rest_get_server()->get_routes();

		$this->assertArrayHasKey( '/paidy/v1/order', $routes );
		$permission_callback = $routes['/paidy/v1/order'][0]['permission_callback'];
		$this->assertIsArray( $permission_callback );
		$this->assertInstanceOf( 'WC_Paidy_Endpoint', $permission_callback[0] );
		$this->assertSame( 'paidy_webhook_permission_check', $permission_callback[1] );
	}

	/**
	 * An unauthenticated request through the REST server cannot complete an order.
	 */
	public function test_unauthenticated_request_cannot_complete_an_order() {
		$order = $this->create_order();

		$response = rest_do_request( $this->make_request( $this->payload_for( $order ) ) );

		$this->assertSame( 403, $response->get_status() );
		$this->assertSame( 'pending', wc_get_order( $order->get_id() )->get_status() );
		$this->assertSame( array(), $this->requested_urls, 'The Paidy API must not be queried for a rejected request.' );
	}

	/**
	 * A notification for an order paid with another gateway is rejected.
	 */
	public function test_order_paid_with_another_gateway_is_rejected() {
		$endpoint = $this->make_endpoint();
		$order    = $this->create_order( 'bacs' );

		$result = $endpoint->paidy_check_webhook( $this->make_request( $this->payload_for( $order ) ) );

		$this->assert_wp_error_with_status( $result, 'invalid_payment_method', 403 );
		$this->assertSame( 'pending', wc_get_order( $order->get_id() )->get_status() );
		$this->assertSame( array(), $this->requested_urls );
	}

	/**
	 * An authorize_success notification completes the order once Paidy confirms the payment.
	 */
	public function test_verified_authorize_success_completes_the_order() {
		$endpoint           = $this->make_endpoint();
		$order              = $this->create_order();
		$this->mock_payment = $this->payment_for( $order );

		$result = $endpoint->paidy_check_webhook( $this->make_request( $this->payload_for( $order ) ) );

		$this->assertInstanceOf( 'WP_REST_Response', $result );
		$this->assertSame( 200, $result->get_status() );
		$this->assertSame( array( 'https://api.paidy.com/payments/' . self::PAYMENT_ID ), $this->requested_urls );

		$order = wc_get_order( $order->get_id() );
		$this->assertSame( 'processing', $order->get_status() );
		$this->assertSame( self::PAYMENT_ID, $order->get_transaction_id() );
	}

	/**
	 * Paidy API answers that do not match the order must not complete it.
	 *
	 * @return array[]
	 */
	public function unverifiable_payment_provider() {
		return array(
			'another order'        => array( array( 'order' => array( 'order_ref' => '999999' ) ) ),
			'different amount'     => array( array( 'amount' => 1.0 ) ),
			'different payment id' => array( array( 'id' => 'pay_SomeOtherPayment' ) ),
			'rejected payment'     => array( array( 'status' => 'rejected' ) ),
		);
	}

	/**
	 * An authorize_success notification leaves the order pending when the payment cannot be verified.
	 *
	 * @dataProvider unverifiable_payment_provider
	 *
	 * @param array $override Fields of the Paidy API answer that differ from the order.
	 */
	public function test_unverified_authorize_success_does_not_complete_the_order( array $override ) {
		$endpoint           = $this->make_endpoint();
		$order              = $this->create_order();
		$this->mock_payment = array_merge( $this->payment_for( $order ), $override );

		$result = $endpoint->paidy_check_webhook( $this->make_request( $this->payload_for( $order ) ) );

		$this->assert_wp_error_with_status( $result, 'paidy_verification_failed', 403 );
		$order = wc_get_order( $order->get_id() );
		$this->assertSame( 'pending', $order->get_status() );
		$this->assertSame( '', $order->get_transaction_id() );
	}

	/**
	 * A repeated authorize_success does not query Paidy or complete the order again.
	 */
	public function test_repeated_authorize_success_is_idempotent() {
		$endpoint           = $this->make_endpoint();
		$order              = $this->create_order();
		$this->mock_payment = $this->payment_for( $order );
		$request            = $this->make_request( $this->payload_for( $order ) );

		$endpoint->paidy_check_webhook( $request );
		$result = $endpoint->paidy_check_webhook( $request );

		$this->assertSame( 200, $result->get_status() );
		$this->assertCount( 1, $this->requested_urls, 'Only the first notification should query the Paidy API.' );
		$this->assertSame( 'processing', wc_get_order( $order->get_id() )->get_status() );
	}

	/**
	 * An order that already has a Paidy transaction is not completed again,
	 * even in a status that normally accepts authorize_success.
	 */
	public function test_authorize_success_for_order_with_transaction_is_skipped() {
		$endpoint = $this->make_endpoint();
		$order    = $this->create_order();
		$order->set_transaction_id( self::PAYMENT_ID );
		$order->set_status( 'cancelled' );
		$order->save();

		$result = $endpoint->paidy_check_webhook( $this->make_request( $this->payload_for( $order ) ) );

		$this->assertSame( 200, $result->get_status() );
		$this->assertSame( array(), $this->requested_urls );
		$this->assertSame( 'cancelled', wc_get_order( $order->get_id() )->get_status() );
	}

	/**
	 * WC_Paidy_Endpoint (which builds WC_Gateway_Paidy and so calls __()) is created
	 * at init priority 11, after load_plugin_textdomain(), not at plugins_loaded.
	 */
	public function test_endpoint_is_created_on_init_priority_11() {
		global $wp_filter;

		$this->assertArrayHasKey( 'init', $wp_filter );
		$this->assertArrayHasKey( 11, $wp_filter['init']->callbacks );

		$from_main_class = array();
		foreach ( $wp_filter['init']->callbacks[11] as $callback ) {
			if ( $callback['function'] instanceof Closure ) {
				$from_main_class[] = ( new ReflectionFunction( $callback['function'] ) )->getFileName();
			}
		}

		$this->assertContains( WC_PAIDY_TESTS_PLUGIN_DIR . '/class-wc-paidy.php', $from_main_class, 'class-wc-paidy.php should create WC_Paidy_Endpoint on init priority 11.' );
	}
}
