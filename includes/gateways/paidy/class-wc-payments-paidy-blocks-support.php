<?php
/**
 * WC_Payments_Paidy_Blocks_Support class file.
 *
 * @package Paidy_WC
 */

use Automattic\WooCommerce\Blocks\Payments\Integrations\AbstractPaymentMethodType;

defined( 'ABSPATH' ) || exit;

/**
 * WC_Payments_Paidy_Blocks_Support class.
 *
 * @extends AbstractPaymentMethodType
 */
final class WC_Payments_Paidy_Blocks_Support extends AbstractPaymentMethodType {
	/**
	 * The gateway instance.
	 *
	 * @var WC_Gateway_Paidy
	 */
	private $gateway;

	/**
	 * Payment method name/id/slug.
	 *
	 * @var string
	 */
	protected $name = 'paidy';

	/**
	 * Initializes the payment method type.
	 */
	public function initialize() {
		$this->settings = get_option( 'woocommerce_paidy_settings', array() );
		$gateways       = WC()->payment_gateways->payment_gateways();
		$this->gateway  = $gateways[ $this->name ];
	}

	/**
	 * Returns if this payment method should be active. If false, the scripts will not be enqueued.
	 *
	 * @return boolean
	 */
	public function is_active() {
		return $this->gateway->is_available();
	}

	/**
	 * Returns an array of scripts/handles to be registered for this payment method.
	 *
	 * @return array
	 */
	public function get_payment_method_script_handles() {
		$script_path       = '/includes/gateways/paidy/assets/js/frontend/paidy.js';
		$script_asset_path = WC_PAIDY_ABSPATH . 'includes/gateways/paidy/assets/js/frontend/paidy.asset.php';
		$script_asset      = file_exists( $script_asset_path )
			? require $script_asset_path
			: array(
				'dependencies' => array(),
				'version'      => '1.2.0',
			);
		$script_url        = WC_PAIDY_PLUGIN_URL . $script_path;

		wp_register_script(
			'wc-paidy-payments-blocks',
			$script_url,
			$script_asset['dependencies'],
			$script_asset['version'],
			true
		);

		if ( function_exists( 'wp_set_script_translations' ) ) {
			wp_set_script_translations( 'wc-paidy-payments-blocks', 'paidy-wc', WC_PAIDY_ABSPATH . 'i18n/' );
		}

		return array( 'wc-paidy-payments-blocks' );
	}

	/**
	 * Returns an array of key=>value pairs of data made available to the payment methods script.
	 *
	 * @return array
	 */
	public function get_payment_method_data() {
		return array(
			'title'             => $this->get_setting( 'title' ),
			'description'       => $this->get_setting( 'description' ),
			'paidy_description' => $this->get_setting( 'paidy_description' ),
			'supports'          => array_filter( $this->gateway->supports, array( $this->gateway, 'supports' ) ),
		);
	}
}
