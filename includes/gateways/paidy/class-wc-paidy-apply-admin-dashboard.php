<?php
/**
 * Paidy WooCommerce Admin Dashboard Class
 *
 * This file contains the WC_Paidy_Apply_Admin_Dashboard class
 * which handles the Paidy application status dashboard widget.
 *
 * @package Paidy_WC
 * @version 1.0.0
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * WC_Paidy_Apply_Admin_Dashboard class file.
 *
 * @package Paidy_WC
 */
class WC_Paidy_Apply_Admin_Dashboard {

	/**
	 * Current step of the Paidy application process.
	 *
	 * @var int
	 */
	public $current_step;

	/**
	 * Constructor.
	 *
	 * Sets up the admin dashboard for Paidy application status.
	 */
	public function __construct() {
		$woocommerce_paidy_on_boarding_settings = get_option( 'woocommerce_paidy_on_boarding_settings', array() );
		$this->current_step                     = isset( $woocommerce_paidy_on_boarding_settings['currentStep'] ) ? $woocommerce_paidy_on_boarding_settings['currentStep'] : 0;

		add_action( 'admin_notices', array( $this, 'paidy_apply_notice' ), 0 );
		add_action( 'network_admin_notices', array( $this, 'paidy_apply_notice' ), 0 );
	}

	/**
	 * Check if the Paidy Apply feature is enabled.
	 *
	 * @return bool
	 */
	public function wc_apply_paidy() {
		return apply_filters( 'wc_paidy_apply_enabled', true );
	}

	/**
	 * Paidy_apply_notice the dashboard widget content.
	 */
	public function paidy_apply_notice() {
		$screen = get_current_screen();
		if ( is_object( $screen ) && 'dashboard' !== $screen->id ) {
			return;
		}

		if ( 2 === $this->current_step || 3 === $this->current_step || 99 === $this->current_step ) {
			echo '<div class="notice notice-info"><p>';
			// 2: Apply Completed ,3: Approved, 99: Error.
			$this->paidy_apply_approved();
			echo '</p></div>';
		}
	}

	/**
	 * Display approved application content.
	 *
	 * Renders the HTML for the approved Paidy application status.
	 */
	public function paidy_apply_approved() {
		echo '<div id="paidy-admin-settings"></div>';
	}
}
