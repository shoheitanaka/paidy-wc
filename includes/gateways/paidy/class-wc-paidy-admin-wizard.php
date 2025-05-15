<?php
/**
 * WC_Paidy_Admin_Wizard class file.
 *
 * Handles the admin wizard for Paidy onboarding.
 *
 * @package Paidy_WC
 */

use Automattic\WooCommerce\Utilities\ArrayUtil;

/**
 * Class WC_Paidy_Admin_Wizard
 *
 * Handles the admin wizard for Paidy onboarding.
 */
class WC_Paidy_Admin_Wizard {

	/**
	 * Payment gateway ID.
	 *
	 * @var string
	 */
	public $id = 'paidy';

	/**
	 * Paidy gateway settings.
	 *
	 * @var array
	 */
	public $paidy_settings;

	/**
	 * Paidy onboarding settings.
	 *
	 * @var array
	 */
	public $paidy_on_boarding_settings;

	/**
	 * Constructor for the WC_Paidy_Admin_Wizard class.
	 */
	public function __construct() {
		$this->paidy_settings             = get_option( 'woocommerce_' . $this->id . '_settings' );
		$this->paidy_on_boarding_settings = get_option( 'woocommerce_paidy_on_boarding_settings' );
		if ( isset( $this->paidy_settings['api_public_key'] ) && isset( $this->paidy_settings['test_api_public_key'] ) ) {
			add_action( 'admin_menu', array( $this, 'paidy_on_boarding_add_menu' ) );
			add_action( 'admin_enqueue_scripts', array( $this, 'wc_admin_paidy_on_boarding_scripts' ) );
			add_action( 'init', array( $this, 'paidy_on_boarding_settings' ) );
			add_action( 'updated_option', array( $this, 'change_paidy_on_boarding_settings' ), 10, 3 );
			add_action( 'added_option', array( $this, 'add_paidy_on_boarding_settings' ), 10, 3 );
			add_filter( 'woocommerce_gateway_method_description', array( $this, 'paidy_method_description' ), 20, 2 );
			add_action( 'woocommerce_settings_tabs_checkout', array( $this, 'paidy_after_settings_checkout' ) );
		}
	}

	/**
	 * Get screen id.
	 *
	 * @since 1.0.0
	 */
	public function get_screen_id() {
		return '/paidy-on-boarding';
	}

	/**
	 * Adds the Paidy On Boarding page to the WooCommerce admin menu.
	 */
	public function paidy_on_boarding_add_menu() {
		if ( ! function_exists( 'wc_admin_register_page' ) ) {
			return;
		}
		wc_admin_register_page(
			array(
				'id'         => 'paidy-on-boarding',
				'title'      => __( 'Paidy On Boarding', 'paidy-wc' ),
				'parent'     => '', // Blank for non-display.
				'path'       => '/paidy-on-boarding',
				'capability' => 'manage_woocommerce',
			),
		);
	}

	/**
	 * Enqueues the scripts and styles for the Paidy onboarding wizard.
	 */
	public function wc_admin_paidy_on_boarding_scripts() {
		$screen = get_current_screen();
		if ( ! isset( $_GET['path'] ) || ( isset( $_GET['path'] ) && $this->get_screen_id() !== $_GET['path'] ) ) { // phpcs:ignore WordPress.Security.NonceVerification
			return;
		}

		$asset_file = WC_PAIDY_ABSPATH . 'includes/gateways/paidy/assets/js/wizard/paidy.asset.php';
		if ( ! file_exists( $asset_file ) ) {
			return;
		}

		$asset  = include $asset_file;
		$handle = 'paidy-on-boarding-script';

		wp_enqueue_script(
			$handle,
			WC_PAIDY_PLUGIN_URL . 'includes/gateways/paidy/assets/js/wizard/paidy.js',
			$asset['dependencies'],
			$asset['version'],
			array(
				'in_footer' => true,
			)
		);

		wp_enqueue_style(
			'paidy-on-boarding-style',
			WC_PAIDY_PLUGIN_URL . 'includes/gateways/paidy/assets/js/wizard/paidy.css',
			array_filter(
				$asset['dependencies'],
				function ( $style ) {
					return wp_style_is( $style, 'registered' );
				}
			),
			$asset['version'],
		);

		// Set translations.
		wp_set_script_translations(
			$handle,
			'paidy-wc',
			WC_PAIDY_ABSPATH . 'i18n'
		);

		// Setting data.
		$rest_url = get_rest_url();
		wp_localize_script(
			$handle,
			'paidyForWcSettings',
			array(
				'restUrl' => $rest_url,
			)
		);
	}

	/**
	 * Registers the setting and defines its type and default value.
	 */
	public function paidy_on_boarding_settings() {
		$default = array(
			'currentStep'                  => 0,
			'storeName'                    => '',
			'siteName'                     => get_bloginfo( 'name' ),
			'storeUrl'                     => get_bloginfo( 'url' ),
			'registEmail'                  => get_bloginfo( 'admin_email' ),
			'annualGrossValue'             => 'less-than-10-million-yen',
			'averagePurchaseAmount'        => 'less-than-50000-yen',
			'securitySurvey01CheckControl' => true,
			'securitySurvey02CheckControl' => true,
			'securitySurvey03CheckControl' => true,
			'securitySurvey04CheckControl' => true,
			'securitySurvey05CheckControl' => true,
			'securitySurvey06CheckControl' => true,
			'securitySurvey07CheckControl' => true,
			'securitySurvey08CheckControl' => true,
			'securitySurvey09CheckControl' => true,
		);
		$schema  = array(
			'type'       => 'object',
			'properties' => array(
				'currentStep'                  => array(
					'type' => 'integer',
				),
				'storeName'                    => array(
					'type' => 'string',
				),
				'siteName'                     => array(
					'type' => 'string',
				),
				'storeUrl'                     => array(
					'type' => 'string',
				),
				'registEmail'                  => array(
					'type' => 'string',
				),
				'contactPhone'                 => array(
					'type' => 'string',
				),
				'representativeLastName'       => array(
					'type' => 'string',
				),
				'representativeFirstName'      => array(
					'type' => 'string',
				),
				'representativeLastNameKana'   => array(
					'type' => 'string',
				),
				'representativeFirstNameKana'  => array(
					'type' => 'string',
				),
				'representativeDateOfBirth'    => array(
					'type' => 'date',
				),
				'annualGrossValue'             => array(
					'type' => 'string',
				),
				'averagePurchaseAmount'        => array(
					'type' => 'string',
				),
				'securitySurvey01CheckControl' => array(
					'type' => 'boolean',
				),
				'securitySurvey02CheckControl' => array(
					'type' => 'boolean',
				),
				'securitySurvey03CheckControl' => array(
					'type' => 'boolean',
				),
				'securitySurvey04CheckControl' => array(
					'type' => 'boolean',
				),
				'securitySurvey05CheckControl' => array(
					'type' => 'boolean',
				),
				'securitySurvey06CheckControl' => array(
					'type' => 'boolean',
				),
				'securitySurvey07CheckControl' => array(
					'type' => 'boolean',
				),
				'securitySurvey08CheckControl' => array(
					'type' => 'boolean',
				),
				'securitySurvey09CheckControl' => array(
					'type' => 'boolean',
				),
			),
		);

		register_setting(
			'options',
			'woocommerce_paidy_on_boarding_settings',
			array(
				'type'              => 'object',
				'default'           => $default,
				'show_in_rest'      => array(
					'schema'           => $schema,
					'prepare_callback' => function ( $value ) {
						if ( empty( $value ) || ! is_array( $value ) ) {
							return $this->paidy_on_boarding_settings();
						}
						return $value;
					},
				),
				'sanitize_callback' => array( $this, 'paidy_sanitize_on_boarding_settings' ),
			)
		);
	}

	/**
	 * Sanitize Paidy on boarding settings.
	 *
	 * @param mixed $input The input to sanitize.
	 * @return string Sanitized input.
	 */
	public function paidy_sanitize_on_boarding_settings( $input ) {
		if ( is_object( $input ) ) {
			$input = (array) $input;
		} elseif ( ! is_array( $input ) ) {
			return array();
		}
		$sanitized                = array();
		$sanitized['currentStep'] = isset( $input['currentStep'] ) ? absint( $input['currentStep'] ) : 0;

		$text_fields = array(
			'storeName',
			'siteName',
			'storeUrl',
			'registEmail',
			'contactPhone',
			'representativeLastName',
			'representativeFirstName',
			'representativeLastNameKana',
			'representativeFirstNameKana',
			'representativeDateOfBirth',
		);

		foreach ( $text_fields as $field ) {
			$sanitized[ $field ] = isset( $input[ $field ] ) ? sanitize_text_field( $input[ $field ] ) : '';
		}

		$select_fields = array( 'annualGrossValue', 'averagePurchaseAmount' );
		foreach ( $select_fields as $field ) {
			$sanitized[ $field ] = isset( $input[ $field ] ) ? sanitize_text_field( $input[ $field ] ) : '';
		}

		$checkbox_fields = array(
			'securitySurvey01CheckControl',
			'securitySurvey02CheckControl',
			'securitySurvey03CheckControl',
			'securitySurvey04CheckControl',
			'securitySurvey05CheckControl',
			'securitySurvey06CheckControl',
			'securitySurvey07CheckControl',
			'securitySurvey08CheckControl',
			'securitySurvey09CheckControl',
		);

		foreach ( $checkbox_fields as $field ) {
			$sanitized[ $field ] = isset( $input[ $field ] ) && rest_sanitize_boolean( $input[ $field ] );
		}

		return $sanitized;
	}

	/**
	 * Handles changes to the Paidy on-boarding settings.
	 *
	 * @param string $option The option name.
	 * @param mixed  $old_value Previous value of the option.
	 * @param mixed  $value New value of the option.
	 */
	public function change_paidy_on_boarding_settings( $option, $old_value, $value ) {
		if ( 'woocommerce_paidy_on_boarding_settings' !== $option ) {
			return;
		}
		if ( isset( $value['currentStep'] ) && 2 === $value['currentStep'] && 1 === $old_value['currentStep'] ) {
			$site_hash = $this->generate_random_string( 16 );
			update_option( 'paidy_site_hash', $site_hash );
			$hash = password_hash( $site_hash, PASSWORD_DEFAULT );
			update_option( 'paidy_hash', $hash );
			$result = $this->send_apply_data_to_wcartws( $value, $site_hash );
		}
	}

	/**
	 * Sends application data to WCART web service.
	 *
	 * @param array  $value The application data to be sent.
	 * @param string $site_hash The site hash.
	 * @return bool Returns true if data was sent successfully, false otherwise.
	 */
	public function send_apply_data_to_wcartws( $value, $site_hash ) {

		$wcartws_api_url = 'https://paidy.artws.info/api/applications/';

		if ( 'less-than-10-million-yen' === $value['annualGrossValue'] ) {
			$gmv_flag = 0;
		} else {
			$gmv_flag = 1;
		}

		if ( 'less-than-50000-yen' === $value['averagePurchaseAmount'] ) {
			$average_flag = 0;
		} else {
			$average_flag = 1;
		}

		$data_array = array(
			'site_name'    => $value['siteName'],
			'site_url'     => $value['storeUrl'],
			'trade_name'   => $value['storeName'],
			'site_hash'    => $site_hash,
			'email'        => $value['registEmail'],
			'phone'        => $value['contactPhone'],
			'ceo'          => $value['representativeLastName'] . ' ' . $value['representativeFirstName'],
			'ceo_kana'     => $value['representativeLastNameKana'] . ' ' . $value['representativeFirstNameKana'],
			'ceo_birthday' => $value['representativeDateOfBirth'],
			'gmv_flag'     => $gmv_flag,
			'average_flag' => $average_flag,
			'survey01'     => $value['securitySurvey01CheckControl'],
			'survey02'     => $value['securitySurvey02CheckControl'],
			'survey03'     => $value['securitySurvey03CheckControl'],
			'survey04'     => $value['securitySurvey04CheckControl'],
			'survey05'     => $value['securitySurvey05CheckControl'],
			'survey06'     => $value['securitySurvey06CheckControl'],
			'survey07'     => $value['securitySurvey07CheckControl'],
			'survey08'     => $value['securitySurvey08CheckControl'],
			'survey09'     => $value['securitySurvey09CheckControl'],
		);
		$args       = array(
			'method'      => 'POST',
			'timeout'     => 15,
			'redirection' => 5,
			'httpversion' => '1.1',
			'blocking'    => true,
			'body'        => $data_array,
		);
		$response   = wp_remote_post( $wcartws_api_url, $args );

		$result = true;
		if ( is_wp_error( $response ) ) {
			$error_message = $response->get_error_message();
			wc_get_logger()->error(
				'Paidy On Boarding API Error: ' . $error_message,
				array( 'source' => 'paidy-wc' )
			);
			$result = false;
		}
		$response_code = wp_remote_retrieve_response_code( $response );
		if ( 403 === $response_code || $response_code < 200 || $response_code >= 300 ) {
			wc_get_logger()->error(
				'Paidy On Boarding API Response Code: ' . $response_code,
				array(
					'source'   => 'paidy-wc',
					'response' => $response,
				)
			);
			$result = false;
		}
		update_option( 'woocommerce_paidy_on_boarding_settings', $value );

		return $result;
	}

	/**
	 * Generates a random string with specified length.
	 *
	 * @param int $length The length of the string to generate (minimum 6).
	 * @return string Random string containing numbers, letters and symbols.
	 * @throws Exception If length is less than 6.
	 */
	public function generate_random_string( $length = 12 ) {
		if ( $length < 6 ) {
			throw new Exception( 'Length must be at least 6.' );
		}

		$digits  = '0123456789';
		$letters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
		$symbols = '!@#$%&*()-_=+';

		$all_chars = $digits . $letters . $symbols;

		$random_string = '';

		// At least two characters each of numbers, letters, and symbols.
		for ( $i = 0; $i < 2; $i++ ) {
			$random_string .= $digits[ random_int( 0, strlen( $digits ) - 1 ) ];
			$random_string .= $letters[ random_int( 0, strlen( $letters ) - 1 ) ];
			$random_string .= $symbols[ random_int( 0, strlen( $symbols ) - 1 ) ];
		}

		// Get the remaining characters (e.g. 6 characters for length=12) from all character sets.
		for ( $i = 6; $i < $length; $i++ ) {
			$random_string .= $all_chars[ random_int( 0, strlen( $all_chars ) - 1 ) ];
		}

		// Shuffle to randomize the order of letters.
		$random_string = str_shuffle( $random_string );

		return $random_string;
	}

	/**
	 * Handles additions to the Paidy on-boarding settings.
	 *
	 * @param string $option The option name.
	 * @param mixed  $value New value of the option.
	 */
	public function add_paidy_on_boarding_settings( $option, $value ) {
		if ( 'woocommerce_paidy_on_boarding_settings' !== $option ) {
			return;
		}

		if ( isset( $value['currentStep'] ) && 1 === $value['currentStep'] ) {
			$value['currentStep'] = 2;
			update_option( $option, $value );
		}
	}

	/**
	 * Update on boarding data.
	 *
	 * @param object $data The data to update.
	 */
	public function update_on_boarding_settings( $data ) {
		$paidy_on_boarding_data = get_option( 'woocommerce_paidy_on_boarding_settings' );
		$paidy_on_boarding_data = array_merge( $paidy_on_boarding_data, $data );
		update_option( 'woocommerce_paidy_on_boarding_settings', $paidy_on_boarding_data );
	}

	/**
	 * Filter to customize the payment method description.
	 *
	 * @param string             $description    The payment method description.
	 * @param WC_Payment_Gateway $payment_object The payment gateway object.
	 * @return string Modified payment method description.
	 */
	public function paidy_method_description( $description, $payment_object ) {
		if ( $payment_object->id === $this->id ) {
			if ( isset( $this->paidy_settings['api_public_key'] )
			&& isset( $this->paidy_settings['test_api_public_key'] )
			&& ! empty( $this->paidy_settings['api_public_key'] )
			&& ! empty( $this->paidy_settings['test_api_public_key'] )
			) {
				return $description;
			}
			$description .= '<div id="paidy-admin-settings"></div>';
			$description .= '<div id="paidy-payment-settings">';
		}
		return $description;
	}

	/**
	 * Outputs the closing div tag for the payment settings section.
	 */
	public function paidy_after_settings_checkout() {
		if ( isset( $_GET['section'] ) && $_GET['section'] === $this->id ) {// phpcs:ignore WordPress.Security.NonceVerification.
			if ( isset( $this->paidy_settings['api_public_key'] ) && isset( $this->paidy_settings['test_api_public_key'] ) ) {
				return;
			} else {
				echo '</div>';
			}
		}
	}
}
