<?php
/**
 * Plugin Name: Paidy for WooCommerce
 * Plugin URI: https://wordpress.org/plugins/paidy-wc/
 * Description: Paidy for WooCommerce
 * Version: 1.4.6
 * Author: Artisan Workshop
 * Author URI: https://wc.artws.info/
 * Requires at least: 5.0
 * Requires PHP: 7.4
 * Tested up to: 6.7.1
 * WC requires at least: 6.0.0
 * WC tested up to: 9.5.1
 *
 * Text Domain: paidy-wc
 * Domain Path: /i18n/
 *
 * @package paidy-wc
 * @category Payments Method
 * @author Artisan Workshop
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}


if ( ! class_exists( 'WC_Paidy' ) ) :
	require_once 'class-wc-paidy.php';
	/**
	 * Load plugin functions.
	 */
	add_action( 'plugins_loaded', 'wc_paidy_plugin', 0 );

	/**
	 * Display a fallback notice when WooCommerce is not active.
	 */
	function wc_paidy_fallback_notice() {
		?>
	<div class="error">
		<ul>
			<li><?php esc_html_e( 'Paidy for WooCommerce is enabled but not effective. It requires WooCommerce in order to work.', 'paidy-wc' ); ?></li>
		</ul>
	</div>
		<?php
	}

	/**
	 * Initialize the Paidy plugin.
	 */
	function wc_paidy_plugin() {
		if ( in_array( 'woocommerce/woocommerce.php', apply_filters( 'active_plugins', get_option( 'active_plugins' ) ), true ) ) {
			WC_Paidy::get_instance();
		} else {
			add_action( 'admin_notices', 'wc_paidy_fallback_notice' );
		}
	}


	/**
	 * Add the gateway to woocommerce
	 *
	 * @param array $methods Methods.
	 * @return array $methods Methods.
	 */
	function add_wc4jp_paidy_gateway( $methods ) {
		$methods[] = 'WC_Gateway_Paidy';
		return $methods;
	}
	add_filter( 'woocommerce_payment_gateways', 'add_wc4jp_paidy_gateway' );

	/**
	 * The available gateway to woocommerce only Japanese currency
	 */
	if ( function_exists( 'wc4jp_paidy_available_gateways' ) === false ) {
		/**
		 * Filter available payment gateways to include only Japanese currency.
		 *
		 * @param array $methods Available payment methods.
		 * @return array Filtered payment methods.
		 */
		function wc4jp_paidy_available_gateways( $methods ) {
			$currency = get_woocommerce_currency();
			if ( 'JPY' !== $currency ) {
				unset( $methods['paidy'] );
			}
			return $methods;
		}

		add_filter( 'woocommerce_available_payment_gateways', 'wc4jp_paidy_available_gateways' );
	}
endif;
