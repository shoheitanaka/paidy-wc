<?php
/**
 * Paidy for WooCommerce main class file.
 *
 * @package paidy-wc
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

if ( ! class_exists( 'WC_Paidy' ) ) :

	/**
	 * Main class for Paidy for WooCommerce.
	 *
	 * @package paidy-wc
	 */
	class WC_Paidy {
		/**
		 * Paidy for WooCommerce Framework version.
		 *
		 * @var string
		 */
		public $framework_version = '2.0.14';

		/**
		 * The reference to the *Singleton* instance of this class.
		 *
		 * @var Singleton
		 */
		private static $instance;

		/**
		 * Returns the *Singleton* instance of this class.
		 *
		 * @return Singleton The *Singleton* instance.
		 */
		public static function get_instance() {
			if ( null === self::$instance ) {
				self::$instance = new self();
			}
			return self::$instance;
		}

		/**
		 * Private clone method to prevent cloning of the instance of the
		 * *Singleton* instance.
		 *
		 * @return void
		 */
		private function __clone() {}

		/**
		 * Protected constructor to prevent creating a new instance of the
		 * *Singleton* via the `new` operator from outside of this class.
		 *
		 * Paidy for WooCommerce Constructor.
		 *
		 * @access public
		 */
		private function __construct() {
			// WC4JP Framework version.
			define( 'JP4WC_PAIDY_FRAMEWORK_VERSION', $this->framework_version );
			// Paidy for WooCommerce plugin url.
			define( 'WC_PAIDY_PLUGIN_URL', plugin_dir_url( __FILE__ ) );
			define( 'WC_PAIDY_ASSETS_URL', WC_PAIDY_PLUGIN_URL . 'assets/' );
			define( 'WC_PAIDY_BLOCKS_URL', WC_PAIDY_PLUGIN_URL . 'includes/gateways/paidy/assets/js/' );
			define( 'WC_PAIDY_ABSPATH', __DIR__ . '/' );
			define( 'WC_PAIDY_ASSETS_ABSPATH', WC_PAIDY_ABSPATH . 'includes/gateways/paidy/assets/js/' );
			// Paidy for WooCommerce plugin file.
			define( 'WC_PAIDY_PLUGIN_FILE', __FILE__ );
			$this->init();
			// Include required files.
			$this->includes();
			// Set up localisation.
			add_action( 'init', array( $this, 'load_plugin_textdomain' ) );
		}

		/**
		 * Include required core files used in admin and on the frontend.
		 */
		private function includes() {
			// load framework.
			$version_text = 'v' . str_replace( '.', '_', JP4WC_PAIDY_FRAMEWORK_VERSION );
			if ( ! class_exists( '\\ArtisanWorkshop\\PluginFramework\\' . $version_text . '\\JP4WC_Framework' ) ) {
				require_once __DIR__ . '/includes/jp4wc-framework/class-jp4wc-framework.php';
			}
			require_once __DIR__ . '/includes/gateways/paidy/class-wc-gateway-paidy.php';
			// Capture, cancel and refund at Paidy once per order status change.
			WC_Gateway_Paidy::register_order_status_hooks();
			// Show the "declined" notice when the buyer returns from Paidy Checkout, and complete
			// the order on the thank-you page, each once.
			WC_Gateway_Paidy::register_checkout_return_hooks();

			// Endpoints.
			// The endpoint registers its REST routes, so it must exist before rest_api_init, and
			// takes the gateway from WooCommerce's list when a request needs it. Its framework
			// instance loads translated strings at once when created during init, so keep it
			// after load_plugin_textdomain (init priority 10); init priority 11 is kept as it was.
			if ( ! class_exists( 'WC_Paidy_Endpoint' ) ) {
				require_once __DIR__ . '/includes/gateways/paidy/class-wc-paidy-endpoint.php';
				if ( did_action( 'init' ) || doing_action( 'init' ) ) {
					new WC_Paidy_Endpoint();
				} else {
					add_action(
						'init',
						function () {
							new WC_Paidy_Endpoint();
						},
						11
					);
				}
			}

			// Admin dashboard.
			if ( ! class_exists( 'WC_Paidy_Apply_Admin_Dashboard' ) ) {
				require_once __DIR__ . '/includes/gateways/paidy/class-wc-paidy-apply-admin-dashboard.php';
				new WC_Paidy_Apply_Admin_Dashboard();
			}

			// Block checkout support, registered in wc_paidy_blocks_support() when WooCommerce
			// registers payment methods at init. Loaded here because a plugin update can remove
			// the plugin directory by then (Japanized for WooCommerce issue #268).
			if ( class_exists( 'Automattic\WooCommerce\Blocks\Payments\Integrations\AbstractPaymentMethodType' ) ) {
				require_once __DIR__ . '/includes/gateways/paidy/class-wc-payments-paidy-blocks-support.php';
			}
		}

		/**
		 * Init Paidy for WooCommerce when WordPress Initialises.
		 */
		public static function init() {
			add_action( 'woocommerce_blocks_loaded', array( __CLASS__, 'wc_paidy_blocks_support' ) );
		}

		/**
		 * Load Localisation files.
		 *
		 * Note: the first-loaded translation file overrides any following ones if the same translation is present
		 */
		public function load_plugin_textdomain() {
			// Load plugin text domain.
			load_plugin_textdomain( 'paidy-wc', false, basename( __DIR__ ) . '/i18n' );
		}

		/**
		 * Registers WooCommerce Blocks integration.
		 */
		public static function wc_paidy_blocks_support() {
			if ( class_exists( 'Automattic\WooCommerce\Blocks\Payments\Integrations\AbstractPaymentMethodType' ) ) {
				add_action(
					'woocommerce_blocks_payment_method_type_registration',
					function ( Automattic\WooCommerce\Blocks\Payments\PaymentMethodRegistry $payment_method_registry ) {
						// Defensive: includes() loads the file; skip the registration if it did not
						// (a request whose files are of mixed versions during an update or rollback).
						if ( class_exists( 'WC_Payments_Paidy_Blocks_Support', false ) ) {
							$payment_method_registry->register( new WC_Payments_Paidy_Blocks_Support() );
						}
					}
				);
			}
		}
	}
endif;
