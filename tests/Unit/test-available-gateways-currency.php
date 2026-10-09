<?php
/**
 * Tests for wc4jp_paidy_available_gateways() (paidy-wc.php).
 *
 * Paidy only settles in JPY and is useless without an API key, so the filter
 * removes the gateway from checkout in both cases while leaving every other
 * gateway untouched.
 *
 * @package paidy-wc
 */

/**
 * WC_Paidy_Available_Gateways_Test
 */
class WC_Paidy_Available_Gateways_Test extends WP_UnitTestCase {

	/**
	 * Gateway list handed to the filter. Values are irrelevant to the filter.
	 *
	 * @var array<string, string>
	 */
	private $methods = array(
		'paidy' => 'paidy-gateway',
		'cod'   => 'cod-gateway',
	);

	/**
	 * Set up test environment before each test.
	 */
	public function setUp(): void {
		parent::setUp();
		update_option( 'woocommerce_currency', 'JPY' );
		delete_option( 'woocommerce_paidy_settings' );
	}

	/**
	 * Tear down test environment after each test.
	 */
	public function tearDown(): void {
		delete_option( 'woocommerce_paidy_settings' );
		delete_option( 'woocommerce_currency' );
		parent::tearDown();
	}

	/**
	 * Regression guard: the filter must stay registered.
	 */
	public function test_filter_is_registered() {
		$this->assertNotFalse( has_filter( 'woocommerce_available_payment_gateways', 'wc4jp_paidy_available_gateways' ) );
	}

	/**
	 * Nothing to do when Paidy is not among the offered gateways.
	 */
	public function test_returns_methods_unchanged_when_paidy_is_not_offered() {
		update_option( 'woocommerce_currency', 'USD' );
		$methods = array( 'cod' => 'cod-gateway' );

		$this->assertSame( $methods, wc4jp_paidy_available_gateways( $methods ) );
	}

	/**
	 * Non-JPY stores never see Paidy, even with keys configured.
	 */
	public function test_removes_paidy_when_currency_is_not_jpy() {
		update_option( 'woocommerce_currency', 'USD' );
		update_option( 'woocommerce_paidy_settings', array( 'api_public_key' => 'pk_live_dummy' ) );

		$result = wc4jp_paidy_available_gateways( $this->methods );

		$this->assertArrayNotHasKey( 'paidy', $result );
		$this->assertArrayHasKey( 'cod', $result );
	}

	/**
	 * JPY store without any API key: Paidy is hidden.
	 */
	public function test_removes_paidy_when_no_api_key_is_configured() {
		update_option( 'woocommerce_paidy_settings', array( 'title' => 'Paidy' ) );

		$result = wc4jp_paidy_available_gateways( $this->methods );

		$this->assertArrayNotHasKey( 'paidy', $result );
		$this->assertArrayHasKey( 'cod', $result );
	}

	/**
	 * JPY store with only a test public key: Paidy stays available.
	 */
	public function test_keeps_paidy_with_test_public_key() {
		update_option( 'woocommerce_paidy_settings', array( 'test_api_public_key' => 'pk_test_dummy' ) );

		$this->assertSame( $this->methods, wc4jp_paidy_available_gateways( $this->methods ) );
	}

	/**
	 * JPY store with only a live public key: Paidy stays available.
	 */
	public function test_keeps_paidy_with_live_public_key() {
		update_option( 'woocommerce_paidy_settings', array( 'api_public_key' => 'pk_live_dummy' ) );

		$this->assertSame( $this->methods, wc4jp_paidy_available_gateways( $this->methods ) );
	}
}
