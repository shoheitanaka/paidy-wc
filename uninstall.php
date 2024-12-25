<?php
/**
 * Uninstall script for the Paidy WooCommerce plugin.
 *
 * This script deletes the plugin options from the database when the plugin is uninstalled.
 *
 * @package Paidy_WooCommerce
 */

if ( ! defined( 'WP_UNINSTALL_PLUGIN' ) ) {
	exit();
}

/**
 * Deletes the plugin options from the database.
 */
function wc_paidy_delete_plugin() {
	global $wpdb;

	// delete option settings.
	$options = array_merge(
		wp_load_alloptions(),
		wp_cache_get( 'alloptions', 'options' )
	);
	foreach ( $options as $option_name => $option_value ) {
		if ( strpos( $option_name, 'woocommerce_paidy_' ) === 0 || strpos( $option_name, 'wc-paidy-' ) === 0 ) {
			delete_option( $option_name );
		}
	}
}

wc_paidy_delete_plugin();
