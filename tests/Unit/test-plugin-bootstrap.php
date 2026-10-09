<?php
/**
 * Smoke tests: the plugin boots on top of WooCommerce and wires itself up.
 *
 * These guard the entry points (paidy-wc.php / class-wc-paidy.php) against
 * loading regressions: constants, the singleton, gateway registration, the REST
 * routes used by Paidy and the onboarding intermediary, and the HPOS declaration.
 *
 * @package paidy-wc
 */

/**
 * WC_Paidy_Plugin_Bootstrap_Test
 */
class WC_Paidy_Plugin_Bootstrap_Test extends WP_UnitTestCase {

	/**
	 * WC_PAIDY_VERSION must track the "Version" plugin header (release-bump touches both).
	 */
	public function test_version_constant_matches_plugin_header() {
		$this->assertTrue( defined( 'WC_PAIDY_VERSION' ), 'WC_PAIDY_VERSION should be defined by paidy-wc.php.' );

		$header = get_file_data( WC_PAIDY_TESTS_PLUGIN_DIR . '/paidy-wc.php', array( 'Version' => 'Version' ) );
		$this->assertSame( $header['Version'], WC_PAIDY_VERSION );
	}

	/**
	 * Path/URL constants are defined by the main class constructor.
	 */
	public function test_path_constants_are_defined() {
		foreach ( array( 'WC_PAIDY_PLUGIN_URL', 'WC_PAIDY_ASSETS_URL', 'WC_PAIDY_BLOCKS_URL', 'WC_PAIDY_ABSPATH', 'WC_PAIDY_ASSETS_ABSPATH', 'WC_PAIDY_PLUGIN_FILE' ) as $constant ) {
			$this->assertTrue( defined( $constant ), "{$constant} should be defined." );
		}

		$this->assertSame( WC_PAIDY_TESTS_PLUGIN_DIR . '/', WC_PAIDY_ABSPATH );
		$this->assertFileExists( WC_PAIDY_ASSETS_ABSPATH . 'frontend/paidy.asset.php', 'Built block assets must ship with the plugin.' );
	}

	/**
	 * The main class is a singleton.
	 */
	public function test_main_class_is_a_singleton() {
		$this->assertTrue( class_exists( 'WC_Paidy' ) );
		$this->assertSame( WC_Paidy::get_instance(), WC_Paidy::get_instance() );
	}

	/**
	 * The gateway is registered with WooCommerce under the id "paidy".
	 */
	public function test_gateway_is_registered_with_woocommerce() {
		$this->assertNotFalse( has_filter( 'woocommerce_payment_gateways', 'add_wc4jp_paidy_gateway' ) );

		$gateways = WC()->payment_gateways()->payment_gateways();
		$this->assertArrayHasKey( 'paidy', $gateways );
		$this->assertInstanceOf( 'WC_Gateway_Paidy', $gateways['paidy'] );
		$this->assertContains( 'refunds', $gateways['paidy']->supports );
	}

	/**
	 * The webhook, webhook-check and onboarding receiver routes are all registered.
	 */
	public function test_rest_routes_are_registered() {
		$routes = rest_get_server()->get_routes();

		foreach ( array( '/paidy/v1/order', '/paidy/v1/check', '/paidy-receiver/v1/receive' ) as $route ) {
			$this->assertArrayHasKey( $route, $routes, "REST route {$route} should be registered." );
			$this->assertContains( 'POST', array_keys( $routes[ $route ][0]['methods'] ), "{$route} should accept POST." );
		}
	}

	/**
	 * HPOS (custom order tables) compatibility is declared from paidy-wc.php.
	 *
	 * WooCommerce only lists plugins that live in WP_PLUGIN_DIR in
	 * FeaturesUtil::get_compatible_plugins_for_feature(), and the test suite
	 * loads this plugin from the repository checkout, so assert on the hook
	 * instead: a closure defined in paidy-wc.php must be attached to
	 * before_woocommerce_init.
	 */
	public function test_hpos_compatibility_is_declared() {
		global $wp_filter;

		$this->assertArrayHasKey( 'before_woocommerce_init', $wp_filter );

		$from_plugin_file = array();
		foreach ( $wp_filter['before_woocommerce_init']->callbacks as $callbacks ) {
			foreach ( $callbacks as $callback ) {
				if ( $callback['function'] instanceof Closure ) {
					$from_plugin_file[] = ( new ReflectionFunction( $callback['function'] ) )->getFileName();
				}
			}
		}

		$this->assertContains( WC_PAIDY_TESTS_PLUGIN_DIR . '/paidy-wc.php', $from_plugin_file, 'paidy-wc.php should hook before_woocommerce_init to declare custom_order_tables compatibility.' );
		$this->assertTrue( class_exists( 'Automattic\WooCommerce\Utilities\FeaturesUtil' ), 'The declaration relies on FeaturesUtil.' );
	}
}
