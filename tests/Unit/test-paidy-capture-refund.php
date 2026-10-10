<?php
/**
 * Tests for the Paidy capture and refund calls, and the thank-you redirect URL.
 *
 * - Capture: jp4wc_order_paidy_status_completed() runs on
 *   woocommerce_order_status_completed, and every WC_Gateway_Paidy instance
 *   registers it again (WC_Paidy_Endpoint builds its own gateway), so a
 *   completed order used to be captured more than once. A stored
 *   paidy_capture_id now short-circuits the call (Japanized for WooCommerce 2.9.0).
 * - Refund: Japanized for WooCommerce added the same kind of guard on
 *   paidy_refund_id to process_refund(), which is not an action callback; it
 *   would make every refund after the first one fail. paidy-wc does not take that
 *   guard (docs/sync-with-jp4wc.md, intentional difference 12).
 * - Redirect: the receipt page sends the buyer to the thank-you URL from
 *   JavaScript. Japanized for WooCommerce escapes that URL with esc_url(), which
 *   turns "&" into "&#038;" that JavaScript does not decode, breaking the URL
 *   with plain permalinks; paidy-wc does not take that change (intentional
 *   difference 13).
 *
 * @package paidy-wc
 */

/**
 * WC_Paidy_Capture_Refund_Test
 */
class WC_Paidy_Capture_Refund_Test extends WP_UnitTestCase {

	/**
	 * Payment ID stored on the orders.
	 */
	const PAYMENT_ID = 'pay_WD1K-j4AALQAI_tZ';

	/**
	 * Capture ID stored on captured orders.
	 */
	const CAPTURE_ID = 'cap_WD1M-j4AALQAI_uA';

	/**
	 * Gateway instance under test.
	 *
	 * @var WC_Gateway_Paidy
	 */
	private $gateway;

	/**
	 * URLs requested through the WP HTTP API during a test.
	 *
	 * @var string[]
	 */
	private $requested_urls = array();

	/**
	 * HTTP methods of the requests made through the WP HTTP API during a test.
	 *
	 * @var string[]
	 */
	private $requested_methods = array();

	/**
	 * Body the mocked Paidy API returns.
	 *
	 * @var array
	 */
	private $mock_body = array();

	/**
	 * Set up test environment before each test.
	 */
	public function setUp(): void {
		parent::setUp();

		if ( ! class_exists( 'WC_Gateway_Paidy' ) ) {
			require_once dirname( __DIR__, 2 ) . '/includes/gateways/paidy/class-wc-gateway-paidy.php';
		}
		$this->assertTrue( class_exists( 'WC_Gateway_Paidy' ), 'WC_Gateway_Paidy should be loadable.' );

		update_option(
			'woocommerce_paidy_settings',
			array(
				'enabled'             => 'yes',
				'environment'         => 'sandbox',
				'test_api_public_key' => 'pk_test_paidy_wc_capture_test',
				'test_api_secret_key' => 'sk_test_paidy_wc_capture_test',
				'debug'               => 'no',
			)
		);
		$this->gateway = new WC_Gateway_Paidy();

		$this->requested_urls    = array();
		$this->requested_methods = array();
		$this->mock_body         = array();
		add_filter( 'pre_http_request', array( $this, 'mock_paidy_api' ), 10, 3 );
	}

	/**
	 * Clean up after each test.
	 */
	public function tearDown(): void {
		remove_filter( 'pre_http_request', array( $this, 'mock_paidy_api' ), 10 );

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
		$this->requested_urls[]    = $url;
		$this->requested_methods[] = isset( $parsed_args['method'] ) ? $parsed_args['method'] : '';

		return array(
			'headers'  => array(),
			'body'     => wp_json_encode( $this->mock_body ),
			'response' => array(
				'code'    => 200,
				'message' => 'OK',
			),
			'cookies'  => array(),
			'filename' => null,
		);
	}

	/**
	 * Create a Paidy order for 1,000 JPY with one physical product.
	 *
	 * @param string $status Order status.
	 * @return WC_Order
	 */
	private function create_order( $status = 'processing' ) {
		$product = new WC_Product_Simple();
		$product->set_name( 'Paidy capture test product' );
		$product->set_regular_price( '1000' );
		$product->save();

		$order = wc_create_order();
		$order->add_product( $product, 1 );
		$order->set_payment_method( 'paidy' );
		$order->calculate_totals();
		$order->set_status( $status );
		$order->set_transaction_id( self::PAYMENT_ID );
		$order->save();

		return $order;
	}

	/**
	 * An order that is already captured is not captured again.
	 */
	public function test_captured_order_is_not_captured_again() {
		$order = $this->create_order();
		$order->update_meta_data( 'paidy_capture_id', self::CAPTURE_ID );
		$order->save();

		$this->assertTrue( $this->gateway->jp4wc_order_paidy_status_completed( $order->get_id() ) );

		$this->assertSame( array(), $this->requested_urls );
	}

	/**
	 * An order that is not captured yet is captured once and the capture ID is stored.
	 */
	public function test_uncaptured_order_is_captured_and_the_capture_id_is_stored() {
		$order           = $this->create_order();
		$this->mock_body = array(
			'id'       => self::PAYMENT_ID,
			'status'   => 'closed',
			'amount'   => (float) $order->get_total(),
			'captures' => array( array( 'id' => self::CAPTURE_ID ) ),
		);

		$this->assertTrue( $this->gateway->jp4wc_order_paidy_status_completed( $order->get_id() ) );

		$this->assertSame( array( 'https://api.paidy.com/payments/' . self::PAYMENT_ID . '/captures' ), $this->requested_urls );
		$this->assertSame( array( 'POST' ), $this->requested_methods );
		$this->assertSame( self::CAPTURE_ID, wc_get_order( $order->get_id() )->get_meta( 'paidy_capture_id' ) );

		// A second completion (another gateway instance's hook) does not call Paidy again.
		$this->gateway->jp4wc_order_paidy_status_completed( $order->get_id() );
		$this->assertCount( 1, $this->requested_urls );
	}

	/**
	 * An order that was already partially refunded can still be refunded again.
	 */
	public function test_second_refund_is_sent_to_paidy() {
		$order = $this->create_order();
		$order->update_meta_data( 'paidy_capture_id', self::CAPTURE_ID );
		$order->update_meta_data( 'paidy_refund_id', array( 'ref_WD1N-j4AALQAI_vB' ) );
		$order->save();
		$this->mock_body = array(
			'id'      => self::PAYMENT_ID,
			'status'  => 'closed',
			'refunds' => array( array( 'id' => 'ref_WD1P-j4AALQAI_wC' ) ),
		);

		$result = $this->gateway->process_refund( $order->get_id(), 100, 'Second partial refund' );

		$this->assertTrue( $result );
		$this->assertSame( array( 'https://api.paidy.com/payments/' . self::PAYMENT_ID . '/refunds' ), $this->requested_urls );
		$this->assertSame( array( 'POST' ), $this->requested_methods );
	}

	/**
	 * The receipt page redirects to the thank-you URL without HTML-encoding it.
	 *
	 * With plain permalinks the thank-you URL has several query arguments; "&#038;"
	 * inside a script is not decoded, so the browser would land on the wrong page.
	 */
	public function test_receipt_page_redirect_url_is_not_html_encoded() {
		$this->set_permalink_structure( '' );
		$order      = $this->create_order( 'pending' );
		$return_url = $this->gateway->get_return_url( $order );
		$this->assertStringContainsString( '&', $return_url, 'The thank-you URL should have more than one query argument with plain permalinks.' );

		ob_start();
		$this->gateway->paidy_make_order( $order->get_id() );
		$output = ob_get_clean();

		$this->assertStringContainsString( 'window.location.href = "' . $return_url . '&transaction_id=" + callbackData.id;', $output );
		$this->assertStringNotContainsString( '&#038;', $output );
	}
}
