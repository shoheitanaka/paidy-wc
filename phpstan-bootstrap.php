<?php
/**
 * PHPStan bootstrap: defines the plugin constants that paidy-wc.php and
 * class-wc-paidy.php set at runtime, so files that reference them analyse
 * correctly. This file is NOT loaded at runtime - only by PHPStan.
 *
 * @package paidy-wc
 */

defined( 'WC_PAIDY_VERSION' ) || define( 'WC_PAIDY_VERSION', '1.5.2' );
defined( 'JP4WC_PAIDY_FRAMEWORK_VERSION' ) || define( 'JP4WC_PAIDY_FRAMEWORK_VERSION', '2.0.14' );
defined( 'WC_PAIDY_PLUGIN_URL' ) || define( 'WC_PAIDY_PLUGIN_URL', 'https://example.com/wp-content/plugins/paidy-wc/' );
defined( 'WC_PAIDY_ASSETS_URL' ) || define( 'WC_PAIDY_ASSETS_URL', WC_PAIDY_PLUGIN_URL . 'assets/' );
defined( 'WC_PAIDY_BLOCKS_URL' ) || define( 'WC_PAIDY_BLOCKS_URL', WC_PAIDY_PLUGIN_URL . 'includes/gateways/paidy/assets/js/' );
defined( 'WC_PAIDY_ABSPATH' ) || define( 'WC_PAIDY_ABSPATH', __DIR__ . '/' );
defined( 'WC_PAIDY_ASSETS_ABSPATH' ) || define( 'WC_PAIDY_ASSETS_ABSPATH', WC_PAIDY_ABSPATH . 'includes/gateways/paidy/assets/js/' );
defined( 'WC_PAIDY_PLUGIN_FILE' ) || define( 'WC_PAIDY_PLUGIN_FILE', __DIR__ . '/class-wc-paidy.php' );
