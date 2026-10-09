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
 * Deletes the Paidy plugin options from the database.
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
	delete_option( 'wc_paidy_show_pr_notice' );
	delete_option( 'paidy_application_id' );
	delete_option( 'paidy_wc_version' );

	// Delete onboarding state token options, signature-claim options, and
	// event-claim options (one non-autoloaded row per token/claim, keyed by a
	// random or hashed suffix) — the suffixes cannot be enumerated via a core
	// API, so a direct LIKE query is required per prefix. Must match
	// WC_Paidy_Apply_Receiver::STATE_OPTION_PREFIX / SIGNATURE_USED_PREFIX /
	// EVENT_CLAIM_PREFIX (the class is not loaded during uninstall, so the
	// constants cannot be referenced directly). Without this, rows accumulate
	// indefinitely and an immediate reinstall could reject an otherwise-fresh
	// callback because its old claim is still on record.
	$prefixes_to_purge = array(
		'paidy_onboarding_state_', // STATE_OPTION_PREFIX.
		'paidy_receiver_sig_',     // SIGNATURE_USED_PREFIX.
		'paidy_receiver_event_',   // EVENT_CLAIM_PREFIX.
	);
	foreach ( $prefixes_to_purge as $prefix ) {
		// phpcs:disable WordPress.DB.DirectDatabaseQuery.DirectQuery, WordPress.DB.DirectDatabaseQuery.NoCaching
		$wpdb->query(
			$wpdb->prepare(
				"DELETE FROM {$wpdb->options} WHERE option_name LIKE %s",
				$wpdb->esc_like( $prefix ) . '%'
			)
		);
		// phpcs:enable WordPress.DB.DirectDatabaseQuery.DirectQuery, WordPress.DB.DirectDatabaseQuery.NoCaching
	}
}

wc_paidy_delete_plugin();
