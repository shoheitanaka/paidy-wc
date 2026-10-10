<?php
/**
 * Tests for completing a Paidy order on the thank-you page.
 *
 * Paidy Checkout redirects the buyer to the order-received page with the payment
 * ID in `?transaction_id=`. That value is buyer-controllable, and
 * WC_Gateway_Paidy::thankyou_completed() used to pass it straight to
 * payment_complete(), so anyone could mark their own pending Paidy order as paid
 * by opening the thank-you URL with any transaction ID. The order is now only
 * completed after the payment is confirmed with the Paidy API
 * (paidy_verify_payment_for_order(), Japanized for WooCommerce 2.9.14).
 *
 * @package paidy-wc
 */

/**
 * WC_Paidy_Thankyou_Verification_Test
 */
class WC_Paidy_Thankyou_Verification_Test extends WP_UnitTestCase {

	/**
	 * Payment ID returned to the thank-you page (not Paidy's test id pay_0000000000000001).
	 */
	const PAYMENT_ID = 'pay_WD1K-j4AALQAI_tZ';

	/**
	 * Gateway instance under test.
	 *
	 * @var WC_Gateway_Paidy
	 */
	private $gateway;

	/**
	 * The original $_GET, restored in tearDown().
	 *
	 * @var array
	 */
	private $original_get = array();

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
	 * HTTP status code the mocked Paidy API answers with.
	 *
	 * @var int
	 */
	private $mock_status = 200;

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
				'test_api_secret_key' => 'sk_test_paidy_wc_thankyou_test',
				'debug'               => 'no',
			)
		);
		$this->gateway = new WC_Gateway_Paidy();

		$this->original_get   = $_GET; // phpcs:ignore WordPress.Security.NonceVerification.Recommended -- Saved verbatim to restore in tearDown().
		$this->requested_urls = array();
		$this->mock_payment   = null;
		$this->mock_status    = 200;
		add_filter( 'pre_http_request', array( $this, 'mock_paidy_api' ), 10, 3 );
	}

	/**
	 * Clean up after each test.
	 */
	public function tearDown(): void {
		remove_filter( 'pre_http_request', array( $this, 'mock_paidy_api' ), 10 );
		$_GET = $this->original_get;

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
				'code'    => $this->mock_status,
				'message' => get_status_header_desc( $this->mock_status ),
			),
			'cookies'  => array(),
			'filename' => null,
		);
	}

	/**
	 * Create a Paidy order for 1,000 JPY with one physical product.
	 *
	 * A physical line item keeps payment_complete() at "processing", so the
	 * completed-status capture hook never calls the Paidy API in these tests.
	 *
	 * @param string $status Order status.
	 * @return WC_Order
	 */
	private function create_order( $status = 'pending' ) {
		$product = new WC_Product_Simple();
		$product->set_name( 'Paidy thank-you test product' );
		$product->set_regular_price( '1000' );
		$product->save();

		$order = wc_create_order();
		$order->add_product( $product, 1 );
		$order->set_payment_method( 'paidy' );
		$order->calculate_totals();
		$order->set_status( $status );
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
	 * Open the thank-you page for an order with the given query string.
	 *
	 * @param WC_Order    $order          Order shown on the thank-you page.
	 * @param string|null $transaction_id Value of ?transaction_id=, or null for none.
	 * @return WC_Order The order reloaded from the database.
	 */
	private function open_thankyou_page( WC_Order $order, $transaction_id ) {
		$_GET = array();
		if ( null !== $transaction_id ) {
			$_GET['transaction_id'] = $transaction_id;
		}

		$this->gateway->thankyou_completed( $order->get_id() );

		return wc_get_order( $order->get_id() );
	}

	/**
	 * A payment that Paidy confirms for this order completes it with the payment ID.
	 */
	public function test_verified_payment_completes_the_order() {
		$order              = $this->create_order();
		$this->mock_payment = $this->payment_for( $order );

		$order = $this->open_thankyou_page( $order, self::PAYMENT_ID );

		$this->assertSame( array( 'https://api.paidy.com/payments/' . self::PAYMENT_ID ), $this->requested_urls );
		$this->assertSame( 'processing', $order->get_status() );
		$this->assertSame( self::PAYMENT_ID, $order->get_transaction_id() );
	}

	/**
	 * A cancelled order (e.g. auto-cancelled while the buyer was in Paidy Checkout) is completed too once verified.
	 */
	public function test_verified_payment_completes_a_cancelled_order() {
		$order              = $this->create_order( 'cancelled' );
		$this->mock_payment = $this->payment_for( $order );

		$order = $this->open_thankyou_page( $order, self::PAYMENT_ID );

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
	 * A transaction ID that Paidy does not confirm for this order leaves the order pending.
	 *
	 * @dataProvider unverifiable_payment_provider
	 *
	 * @param array $override Fields of the Paidy API answer that differ from the order.
	 */
	public function test_unverified_payment_does_not_complete_the_order( array $override ) {
		$order              = $this->create_order();
		$this->mock_payment = array_merge( $this->payment_for( $order ), $override );

		$order = $this->open_thankyou_page( $order, self::PAYMENT_ID );

		$this->assertSame( 'pending', $order->get_status() );
		$this->assertSame( '', $order->get_transaction_id() );
	}

	/**
	 * A payment ID that Paidy does not know leaves the order pending.
	 */
	public function test_unknown_payment_does_not_complete_the_order() {
		$order             = $this->create_order();
		$this->mock_status = 404;

		$order = $this->open_thankyou_page( $order, self::PAYMENT_ID );

		$this->assertSame( array( 'https://api.paidy.com/payments/' . self::PAYMENT_ID ), $this->requested_urls );
		$this->assertSame( 'pending', $order->get_status() );
		$this->assertSame( '', $order->get_transaction_id() );
	}

	/**
	 * Transaction IDs that are not Paidy payment IDs, including none at all.
	 *
	 * @return array[]
	 */
	public function malformed_transaction_id_provider() {
		return array(
			'missing'          => array( null ),
			'empty'            => array( '' ),
			'not a payment id' => array( 'cap_WD1K-j4AALQAI_tZ' ),
			'path traversal'   => array( self::PAYMENT_ID . '/../captures' ),
			'query string'     => array( self::PAYMENT_ID . '?x=1' ),
		);
	}

	/**
	 * A missing or malformed transaction ID is rejected without calling the Paidy API.
	 *
	 * @dataProvider malformed_transaction_id_provider
	 *
	 * @param string|null $transaction_id Value of ?transaction_id=, or null for none.
	 */
	public function test_malformed_transaction_id_does_not_complete_the_order( $transaction_id ) {
		$order              = $this->create_order();
		$this->mock_payment = $this->payment_for( $order );

		$order = $this->open_thankyou_page( $order, $transaction_id );

		$this->assertSame( array(), $this->requested_urls );
		$this->assertSame( 'pending', $order->get_status() );
		$this->assertSame( '', $order->get_transaction_id() );
	}

	/**
	 * Reloading the thank-you page of an order the webhook already completed does nothing.
	 */
	public function test_order_with_transaction_id_is_skipped() {
		$order = $this->create_order();
		$order->set_transaction_id( self::PAYMENT_ID );
		$order->save();
		$this->mock_payment = $this->payment_for( $order );

		$order = $this->open_thankyou_page( $order, self::PAYMENT_ID );

		$this->assertSame( array(), $this->requested_urls );
		$this->assertSame( 'pending', $order->get_status() );
	}

	/**
	 * A processing order is not completed again.
	 */
	public function test_processing_order_is_skipped() {
		$order              = $this->create_order( 'processing' );
		$this->mock_payment = $this->payment_for( $order );

		$order = $this->open_thankyou_page( $order, self::PAYMENT_ID );

		$this->assertSame( array(), $this->requested_urls );
		$this->assertSame( 'processing', $order->get_status() );
		$this->assertSame( '', $order->get_transaction_id() );
	}

	/**
	 * A missing order does not fatal.
	 */
	public function test_missing_order_is_ignored() {
		$_GET = array( 'transaction_id' => self::PAYMENT_ID );

		$this->gateway->thankyou_completed( 999999 );

		$this->assertSame( array(), $this->requested_urls );
	}
}
