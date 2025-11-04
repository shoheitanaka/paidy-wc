<?php
/**
 * Plugin Name: Paidy for WooCommerce
 * Plugin URI: https://wordpress.org/plugins/paidy-wc/
 * Description: Paidy for WooCommerce
 * Version: 1.5.2
 * Author: Artisan Workshop
 * Author URI: https://wc.artws.info/
 * Requires at least: 5.0
 * Requires PHP: 8.1
 * Tested up to: 6.8.3
 * WC requires at least: 6.0.0
 * WC tested up to: 10.3.4
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

// Register activation hook.
register_activation_hook( __FILE__, 'paidy_activation_redirect' );
// deactivation.
register_deactivation_hook( __FILE__, 'on_deactivation' );

/**
 * Add option for activation redirect.
 *
 * @return void
 */
function paidy_activation_redirect() {
	add_option( 'paidy_do_activation_redirect', true );
}

/**
 * Flush rewrite rules on deactivate.
 *
 * @return void
 */
function on_deactivation() {
	add_option( 'paidy_do_activation_redirect', true );
	flush_rewrite_rules();
}

if ( ! class_exists( 'WC_Paidy' ) ) :
	// WooCommerce For Softbank Payment Gateways version.
	define( 'WC_PAIDY_VERSION', '1.5.2' );

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

	// Admin wizard.
	require_once __DIR__ . '/includes/gateways/paidy/class-wc-paidy-admin-wizard.php';
	new WC_Paidy_Admin_Wizard();

	if ( is_admin() ) {
		// Load admin settings controller.
		require_once __DIR__ . '/includes/gateways/paidy/class-wc-paidy-settings-controller.php';
		new WC_Paidy_Settings_Controller();

		// Load admin notices controller.
		require_once __DIR__ . '/includes/gateways/paidy/class-wc-paidy-admin-notices.php';
		new WC_Paidy_Admin_Notices();
	}

	// Redirect when the plugin is activated.
	add_action( 'admin_init', 'paidy_redirect_to_wizard' );

	/**
	 * Redirects to the Paidy wizard after plugin activation.
	 */
	function paidy_redirect_to_wizard() {
		$paidy_payment_method = new WC_Gateway_Paidy();
		if ( get_option( 'paidy_do_activation_redirect', false ) ) {
			if ( 'yes' !== $paidy_payment_method->enabled ) {
				$paidy_payment_method->update_option( 'enabled', 'yes' );
				// Check if the user is an admin and has the capability to manage options.
				delete_option( 'paidy_do_activation_redirect' );
				wp_safe_redirect( admin_url( 'admin.php?page=wc-admin&path=%2Fpaidy-on-boarding' ) );
				exit;
			}
		}
	}

	// API Receiver.
	require_once __DIR__ . '/includes/gateways/paidy/class-wc-paidy-apply-receiver.php';

	/**
	 * Initialize the Paidy receiver.
	 *
	 * @return void
	 */
	function init_paidy_receiver() {
		new WC_Paidy_Apply_Receiver();
	}

	// Load the receiver.
	add_action( 'init', 'init_paidy_receiver' );

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
			// Check if the Paidy payment method is available.
			if ( ! isset( $methods['paidy'] ) ) {
				return $methods;
			}

			// Check if the currency is JPY.
			// If the currency is not JPY, remove the Paidy payment method.
			if ( get_woocommerce_currency() !== 'JPY' ) {
				unset( $methods['paidy'] );
				return $methods;
			}

			$settings = get_option( 'woocommerce_paidy_settings', array() );

			// Check if the API keys are set.
			$has_test_key = ! empty( $settings['test_api_public_key'] );
			$has_live_key = ! empty( $settings['api_public_key'] );

			if ( ! $has_test_key && ! $has_live_key ) {
				unset( $methods['paidy'] );
			}
			return $methods;
		}
		add_filter( 'woocommerce_available_payment_gateways', 'wc4jp_paidy_available_gateways' );
	}

	/**
	 * Declare plugin compatibility with WooCommerce HPOS.
	 *
	 * @since 2.6.0
	 */
	add_action(
		'before_woocommerce_init',
		function () {
			if ( class_exists( '\Automattic\WooCommerce\Utilities\FeaturesUtil' ) ) {
				\Automattic\WooCommerce\Utilities\FeaturesUtil::declare_compatibility( 'custom_order_tables', __FILE__, true );
			}
		}
	);

endif;
