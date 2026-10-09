<?php
/**
 * PHPUnit bootstrap file.
 *
 * Boots the WordPress test library, loads WooCommerce, installs its tables and
 * then loads this plugin, so tests run against a real WordPress + WooCommerce.
 *
 * Environment (all optional):
 *   WP_TESTS_DIR   WordPress PHPUnit test library (default: <tmp>/wordpress-tests-lib)
 *   WP_CORE_DIR    WordPress core directory       (default: <tmp>/wordpress)
 *   WC_PLUGIN_DIR  WooCommerce plugin directory   (default: <WP_CORE_DIR>/wp-content/plugins/woocommerce)
 *
 * Run `composer test:install` (see bin/install-wp-tests.sh) once to populate them.
 *
 * @package paidy-wc
 */

// Composer autoloader: provides the Yoast PHPUnit Polyfills the WP test library needs.
$wc_paidy_composer_autoload = dirname( __DIR__ ) . '/vendor/autoload.php';
if ( file_exists( $wc_paidy_composer_autoload ) ) {
	require_once $wc_paidy_composer_autoload;
}

$wc_paidy_tmp_dir   = rtrim( sys_get_temp_dir(), '/\\' );
$wc_paidy_tests_dir = getenv( 'WP_TESTS_DIR' );
if ( ! $wc_paidy_tests_dir ) {
	$wc_paidy_tests_dir = $wc_paidy_tmp_dir . '/wordpress-tests-lib';
}
$wc_paidy_core_dir = getenv( 'WP_CORE_DIR' );
if ( ! $wc_paidy_core_dir ) {
	$wc_paidy_core_dir = $wc_paidy_tmp_dir . '/wordpress';
}

define( 'WC_PAIDY_TESTS_PLUGIN_DIR', dirname( __DIR__ ) );
define( 'WC_PAIDY_TESTS_WP_CORE_DIR', $wc_paidy_core_dir );

// Forward custom PHPUnit Polyfills configuration to the WP test library.
$wc_paidy_polyfills_path = getenv( 'WP_TESTS_PHPUNIT_POLYFILLS_PATH' );
if ( false !== $wc_paidy_polyfills_path ) {
	define( 'WP_TESTS_PHPUNIT_POLYFILLS_PATH', $wc_paidy_polyfills_path ); // phpcs:ignore WordPress.NamingConventions.PrefixAllGlobals.NonPrefixedConstantFound -- WordPress test library constant.
}

if ( ! file_exists( "{$wc_paidy_tests_dir}/includes/functions.php" ) ) {
	echo "Could not find {$wc_paidy_tests_dir}/includes/functions.php, have you run `composer test:install`?" . PHP_EOL; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
	exit( 1 );
}

// Give access to tests_add_filter() function.
require_once "{$wc_paidy_tests_dir}/includes/functions.php";

/**
 * Load WooCommerce, mark it active, then load the plugin under test.
 */
function wc_paidy_tests_load_plugins() {
	$woocommerce_plugin = getenv( 'WC_PLUGIN_DIR' );
	if ( $woocommerce_plugin ) {
		$woocommerce_plugin = rtrim( $woocommerce_plugin, '/\\' ) . '/woocommerce.php';
	} else {
		$woocommerce_plugin = WC_PAIDY_TESTS_WP_CORE_DIR . '/wp-content/plugins/woocommerce/woocommerce.php';
	}

	if ( ! file_exists( $woocommerce_plugin ) ) {
		echo "WooCommerce not found at {$woocommerce_plugin}. Run `composer test:install` (WC_VERSION=latest by default)." . PHP_EOL; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
		exit( 1 );
	}

	require_once $woocommerce_plugin;

	// paidy-wc.php only boots when WooCommerce is listed as an active plugin.
	$active_plugins = get_option( 'active_plugins', array() );
	if ( ! in_array( 'woocommerce/woocommerce.php', $active_plugins, true ) ) {
		$active_plugins[] = 'woocommerce/woocommerce.php';
		update_option( 'active_plugins', $active_plugins );
	}

	require WC_PAIDY_TESTS_PLUGIN_DIR . '/paidy-wc.php';
}
tests_add_filter( 'muplugins_loaded', 'wc_paidy_tests_load_plugins' );

/**
 * Install WooCommerce tables and defaults once WordPress is loaded.
 */
function wc_paidy_tests_install_woocommerce() {
	if ( ! defined( 'WC_REMOVE_ALL_DATA' ) ) {
		define( 'WC_REMOVE_ALL_DATA', true ); // phpcs:ignore WordPress.NamingConventions.PrefixAllGlobals.NonPrefixedConstantFound -- WooCommerce constant.
	}

	if ( class_exists( 'WC_Install' ) ) {
		WC_Install::install();
		update_option( 'woocommerce_db_version', WC()->version );
	}
}
tests_add_filter( 'setup_theme', 'wc_paidy_tests_install_woocommerce' );

// Start up the WP testing environment.
require "{$wc_paidy_tests_dir}/includes/bootstrap.php";
