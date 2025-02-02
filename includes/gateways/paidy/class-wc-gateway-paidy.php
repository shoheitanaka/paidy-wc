<?php
/**
 * Initialise Gateway Settings Form Fields
 * Class WC_Gateway_Paidy file.
 *
 * @package WooCommerce\Gateways
 */

use ArtisanWorkshop\PluginFramework\v2_0_13 as Framework;

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

/**
 * Paidy Payment Gateway in Japanese
 *
 * Provides a Paidy Payment Gateway in Japanese. Based on code by Shohei Tanaka.
 *
 * @class       WC_Gateway_Paidy
 * @extends     WC_Payment_Gateway
 * @version     1.4.8
 * @package     WooCommerce/Classes/Payment
 * @author      Artisan Workshop
 */
class WC_Gateway_Paidy extends WC_Payment_Gateway {

	/**
	 * Framework.
	 *
	 * @var stdClass
	 */
	public $jp4wc_framework;

	/**
	 * Settings parameter
	 *
	 * @var string
	 */
	public $paidy_description;

	/**
	 * Order button text.
	 *
	 * @var string
	 */
	public $order_button_text;

	/**
	 * Environment.
	 *
	 * @var string
	 */
	public $environment;

	/**
	 * API public key.
	 *
	 * @var string
	 */
	public $api_public_key;

	/**
	 * API secret key.
	 *
	 * @var string
	 */
	public $api_secret_key;

	/**
	 * Test API public key.
	 *
	 * @var string
	 */
	public $test_api_public_key;

	/**
	 * Test API secret key.
	 *
	 * @var string
	 */
	public $test_api_secret_key;

	/**
	 * Store name.
	 *
	 * @var string
	 */
	public $store_name;

	/**
	 * Logo image URL.
	 *
	 * @var string
	 */
	public $logo_image_url;

	/**
	 * Debug mode.
	 *
	 * @var bool
	 */
	public $debug;

	/**
	 * Webhook URL.
	 *
	 * @var string
	 */
	public $webhook;

	/**
	 * Notice email.
	 *
	 * @var string
	 */
	public $notice_email;

	/**
	 * Instructions.
	 *
	 * @var string
	 */
	public $instructions;

	/**
	 * Account details.
	 *
	 * @var string
	 */
	public $account_details;

	/**
	 * Constructor for the gateway.
	 */
	public function __construct() {
		$this->id         = 'paidy';
		$this->icon       = apply_filters( 'woocommerce_paidy_icon', WC_PAIDY_PLUGIN_URL . 'assets/images/paidy_logo_100_2023.png' );
		$this->has_fields = false;
		// translators: %s: Payment method name.
		$this->order_button_text = sprintf( __( 'Proceed to %s', 'paidy-wc' ), __( 'Paidy', 'paidy-wc' ) );

		// Create plugin fields and settings.
		$this->init_form_fields();
		$this->init_settings();

		$this->method_title       = __( 'Paidy Payment', 'paidy-wc' );
		$this->method_description = __( '"Paidy next month payment" reduces the opportunity loss due to the payment method and contributes to sales increase.', 'paidy-wc' );

		$this->supports = array(
			'products',
			'refunds',
		);

		$this->jp4wc_framework = new Framework\JP4WC_Framework();

		// Get setting values.
		foreach ( $this->settings as $key => $val ) {
			$this->$key = $val;
		}

		// Define user set variables.
		$this->title       = $this->get_option( 'title' );
		$this->description = $this->get_option( 'description' );

		// Actions Hook.
		add_action( 'woocommerce_update_options_payment_gateways', array( $this, 'process_admin_options' ) );
		add_action( 'woocommerce_update_options_payment_gateways_' . $this->id, array( $this, 'process_admin_options' ) );

		add_action( 'woocommerce_receipt_' . $this->id, array( $this, 'paidy_make_order' ) );

		add_action( 'wp_enqueue_scripts', array( $this, 'paidy_token_scripts_method' ) );
		add_action( 'admin_enqueue_scripts', array( $this, 'admin_enqueue_scripts' ) );

		add_action( 'woocommerce_before_checkout_form', array( $this, 'checkout_reject_to_cancel' ) );
		add_action( 'woocommerce_thankyou_' . $this->id, array( $this, 'thankyou_completed' ) );

		add_action( 'woocommerce_order_status_completed', array( $this, 'jp4wc_order_paidy_status_completed' ) );
		add_action( 'woocommerce_order_status_processing_to_cancelled', array( $this, 'paidy_order_paidy_status_processing_to_cancelled' ) );
		add_action( 'woocommerce_order_status_completed_to_cancelled', array( $this, 'paidy_order_paidy_status_completed_to_cancelled' ) );

		add_action( 'admin_print_footer_scripts', array( $this, 'paidy_remove_refund_button_for_processing' ), 99 );
	}

	/**
	 * Initialise Gateway Settings Form Fields
	 */
	public function init_form_fields() {
		$this->form_fields = array(
			'enabled'             => array(
				'title'   => __( 'Enable/Disable', 'paidy-wc' ),
				'type'    => 'checkbox',
				'label'   => __( 'Enable Paidy', 'paidy-wc' ),
				'default' => 'no',
			),
			'title'               => array(
				'title'       => __( 'Title', 'paidy-wc' ),
				'type'        => 'text',
				'description' => __( 'This controls the title which the user sees during checkout.', 'paidy-wc' ),
				'default'     => __( 'Paidy Payment', 'paidy-wc' ),
				'desc_tip'    => true,
			),
			'description'         => array(
				'title'       => __( 'Description', 'paidy-wc' ),
				'type'        => 'textarea',
				'description' => __( 'Payment method description that the customer will see on your checkout.', 'paidy-wc' ),
				'default'     => __( 'No matter how many times you shop a month, you pay once in the following month. <br /> The following payment methods are available.', 'paidy-wc' ),
				'desc_tip'    => true,
			),
			'paidy_description'   => array(
				'title'             => __( 'Paidy description', 'paidy-wc' ),
				'type'              => 'textarea',
				'custom_attributes' => array( 'rows' => 6 ),
				'description'       => __( 'Payment method description for paidy explanation that the customer will see on your checkout.', 'paidy-wc' ),
				'default'           => $this->paidy_explanation(),
				'desc_tip'          => true,
			),
			'order_button_text'   => array(
				'title'       => __( 'Order Button Text', 'paidy-wc' ),
				'type'        => 'text',
				'description' => __( 'This controls the description which the user sees during checkout.', 'paidy-wc' ),
				// translators: %s: Payment method name.
				'default'     => sprintf( __( 'Proceed to %s', 'paidy-wc' ), __( 'Paidy', 'paidy-wc' ) ),
			),
			'environment'         => array(
				'title'       => __( 'Environment', 'paidy-wc' ),
				'type'        => 'select',
				'description' => __( 'This setting specifies whether you will process live transactions, or whether you will process simulated transactions using the Paidy Sandbox.', 'paidy-wc' ),
				'default'     => 'live',
				'desc_tip'    => true,
				'options'     => array(
					'live'    => __( 'Live', 'paidy-wc' ),
					'sandbox' => __( 'Sandbox', 'paidy-wc' ),
				),
			),
			'api_public_key'      => array(
				'title'       => __( 'API Public Key', 'paidy-wc' ),
				'type'        => 'text',
				// translators: %s: API Public Key.
				'description' => sprintf( __( 'Please enter %s from Paidy Admin site.', 'paidy-wc' ), __( 'API Public Key', 'paidy-wc' ) ),
				'default'     => '',
				'desc_tip'    => true,
			),
			'api_secret_key'      => array(
				'title'       => __( 'API Secret Key', 'paidy-wc' ),
				'type'        => 'password',
				// translators: %s: API Secret Key.
				'description' => sprintf(
					/* translators: %s: API Secret Key. */
					__( 'Please enter %s from Paidy Admin site.', 'paidy-wc' ),
					__( 'API Secret Key', 'paidy-wc' )
				),
				'default'     => '',
				'desc_tip'    => true,
			),
			'test_api_public_key' => array(
				'title'       => __( 'Test API Public Key', 'paidy-wc' ),
				'type'        => 'text',
				// translators: %s: Test API Public Key.
				'description' => sprintf( __( 'Please enter %s from Paidy Admin site.', 'paidy-wc' ), __( 'Test API Public Key', 'paidy-wc' ) ),
				'default'     => '',
				'desc_tip'    => true,
			),
			'test_api_secret_key' => array(
				'title'       => __( 'Test API Secret Key', 'paidy-wc' ),
				'type'        => 'password',
				// translators: %s: Test API Secret Key.
				'description' => sprintf( __( 'Please enter %s from Paidy Admin site.', 'paidy-wc' ), __( 'Test API Secret Key', 'paidy-wc' ) ),
				'default'     => '',
				'desc_tip'    => true,
			),
			'store_name'          => array(
				'title'       => __( 'Store Name', 'paidy-wc' ),
				'type'        => 'text',
				'description' => __( 'This controls the store name which the user sees during paidy checkout.', 'paidy-wc' ),
				'default'     => get_bloginfo( 'name' ),
			),
			'logo_image_url'      => array(
				'title'       => __( 'Logo Image (168×168 recommend)', 'paidy-wc' ),
				'type'        => 'image',
				'description' => __( 'URL of a custom logo that can be displayed in the checkout application header. If no value is specified, the Paidy logo will be displayed.', 'paidy-wc' ),
				'default'     => '',
				'placeholder' => __( 'Optional', 'paidy-wc' ),
			),
			'debug'               => array(
				'title'       => __( 'Debug Mode', 'paidy-wc' ),
				'type'        => 'checkbox',
				'label'       => __( 'Enable Debug Mode', 'paidy-wc' ),
				'default'     => 'no',
				'description' => __( 'Save debug data using WooCommerce logging.', 'paidy-wc' ),
			),
			'notice_email'        => array(
				'title'       => __( 'Notice e-mail', 'paidy-wc' ),
				'type'        => 'text',
				'description' => __( 'Set an e-mail address to send an e-mail when an error occurs during connection with paidy.', 'paidy-wc' ),
				'default'     => get_option( 'admin_email' ),
			),
			'webhook'             => array(
				'title'       => __( 'About Webhook', 'paidy-wc' ),
				'type'        => 'title',
				'description' => __( 'The webhooks set in the Paidy management screen are as follows. <br />', 'paidy-wc' ) . '<strong>' . get_rest_url() . '/wp-json/paidy/v1/order/</strong>',
			),
		);
	}

	/**
	 * UI - Payment page Description fields for Paidy Payment.
	 */
	public function payment_fields() {
		// Description of payment method from settings.
		?>
		<br />
		<a href="https://paidy.com/consumer" target="_blank" class="jp4wc-paidy-icon">
			<img src="<?php echo esc_url( WC_PAIDY_PLUGIN_URL . 'assets/images/paidy_checkout_2023_320x100.png' ); ?>" alt="Paidy 翌月まとめてお支払い" style="max-height: none; float: none;">
		</a>
		<br />
		<p class="jp4wc-paidy-description"><?php echo esc_html( $this->description ); ?></p>
		<br />
		<?php
		if ( empty( $this->paidy_description ) ) {
			$paidy_explanation = $this->paidy_explanation();
		} else {
			$paidy_explanation = $this->paidy_description;
		}
		$allowed_html = array(
			'a'      => array(
				'href'   => array(),
				'target' => array(),
			),
			'br'     => array(),
			'strong' => array(),
			'b'      => array(),
			'div'    => array(),
			'ul'     => array(),
			'li'     => array(),
		);
		echo wp_kses( $paidy_explanation, $allowed_html );
	}

	/**
	 * Provides the explanation for Paidy payment method.
	 *
	 * @return string HTML content explaining Paidy payment method.
	 */
	protected function paidy_explanation() {
		$image_url    = WC_PAIDY_PLUGIN_URL . 'assets/images/paidy_checkout_2023_320x100.png';
		$explain_html = '
        <div class="jp4wc-paidy-explanation">
		<img src="' . esc_url( $image_url ) . '" alt="Paidy 翌月まとめてお支払い" style="max-height: none; float: none;">
        <ul>
            <li style="list-style: disc !important;">クレジットカード、事前登録不要。</li>
            <li style="list-style: disc !important;">メールアドレスと携帯番号だけで、今すぐお買い物。</li>
            <li style="list-style: disc !important;">1か月に何度お買い物しても、お支払いは翌月まとめて1回でOK。</li>
            <li style="list-style: disc !important;">お支払いは翌月10日までに、コンビニ払い・銀行振込・口座振替で。</li>
        </ul>
        さらにペイディアプリから本人確認をすると、分割手数料無料*の３回あと払い**や、使い過ぎを防止する予算設定など、便利な機能をご利用いただけます。<br />
*銀行振込・口座振替のみ無料<br />
**1回のご利用金額が3,000円以上の場合のみ利用可能<br />
        Paidyについて詳しくは<a href="https://paidy.com/payments/" target="_blank">こちら</a>。
        </div>
        ';
		return apply_filters( 'jp4wc_paidy_explanation', $explain_html );
	}
	/**
	 * Process the payment and return the result
	 *
	 * @param int $order_id Order ID.
	 */
	public function process_payment( $order_id ) {
		$order = wc_get_order( $order_id );
		// Return thankyou redirect.
		return array(
			'result'   => 'success',
			'redirect' => $order->get_checkout_payment_url( true ),
		);
	}

	/**
	 * Make Paidy JavaScript for payment process
	 *
	 * @param string $order_id Order ID.
	 */
	public function paidy_make_order( $order_id ) {
		// Set Order.
		$order = wc_get_order( $order_id );
		// Set public key by environment.
		if ( 'live' === $this->environment ) {
			$api_public_key = $this->api_public_key;
		} else {
			$api_public_key = $this->test_api_public_key;
		}
		// Set logo image url.
		if ( isset( $this->logo_image_url ) ) {
			$logo_image_url = wp_get_attachment_url( $this->logo_image_url );
		} else {
			$logo_image_url = 'http://www.paidy.com/images/logo.png';
		}
		$date            = new DateTime();
		$paidy_order_ref = $order_id;
		// Set user id.
		if ( is_user_logged_in() ) {
			$user_id = get_current_user_id();
		} else {
			$user_id = 'guest-paidy' . $paidy_order_ref;
		}

		$jp4wc_countries = new WC_Countries();
		$states          = $jp4wc_countries->get_states();

		// Get products and coupons information from order.
		$order_items  = apply_filters( 'jp4wc_paidy_order_items', $order->get_items( 'line_item' ) );
		$items_count  = 0;
		$cart_total   = 0;
		$fees         = $order->get_fees();
		$items        = '';
		$paidy_amount = 0;
		foreach ( $order_items as $key => $item ) {
			if ( $item->get_product_id() ) {
				$item_name     = str_replace( '"', '\"', $item->get_name() );
				$unit_price    = round( $item->get_subtotal() / $item->get_quantity(), 0 );
				$items        .= '{
                    "id":"' . $item->get_product_id() . '",
                    "quantity":' . $item->get_quantity() . ',
                    "title":"' . $item_name . '",
                    "unit_price":' . $unit_price;
				$paidy_amount += $item->get_quantity() * $unit_price;
			}
			if ( end( $order_items ) === $item && ( ! isset( $fees ) ) ) {
				$items .= '}
';
			} else {
				$items .= '},
                    ';
			}
		}
		$order_coupons = apply_filters( 'jp4wc_paidy_order_coupons', $order->get_items( 'coupon' ) );
		foreach ( $order_coupons as $key => $coupon ) {
			if ( $coupon->get_discount() ) {
				$items        .= '{
                    "id":"' . $coupon->get_code() . '",
                    "quantity":1,
                    "title":"' . $coupon->get_name() . '",
                    "unit_price":-' . $coupon->get_discount();
				$paidy_amount -= $coupon->get_discount();
			}
			if ( end( $order_items ) === $coupon && ( ! isset( $fees ) ) ) {
				$items .= '}
';
			} else {
				$items .= '},
                    ';
			}
			$items_count += $coupon->get_quantity();
			$cart_total  += $coupon->get_subtotal();
		}

		if ( isset( $fees ) ) {
			$i = 1;
			foreach ( $fees as $fee ) {
				$items        .= '{
                    "id":"fee' . $i . '",
                    "quantity":1,
                    "title":"' . esc_html( $fee->get_name() ) . '",
                    "unit_price":' . esc_html( $fee->get_amount() );
				$paidy_amount += intval( $fee->get_amount() );
				if ( end( $fees ) === $fee ) {
					$items .= '}
';
				} else {
					$items .= '},
                    ';
				}
				++$i;
			}
		}

		// Check the order only for virtual products.
		$not_virtual = false;

		foreach ( WC()->cart->get_cart() as $cart_item_key => $cart_item ) {
			// Check if there are non-virtual products.
			if ( ! $cart_item['data']->is_virtual() ) {
				$not_virtual = true;
			}
		}
		// Set shipping address.
		if ( $not_virtual ) {
			if ( $order->get_shipping_postcode() ) {
				$shipping_address['line1'] = $order->get_shipping_address_2();
				$shipping_address['line2'] = $order->get_shipping_address_1();
				$shipping_address['city']  = $order->get_shipping_city();
				$shipping_address['state'] = $states['JP'][ $order->get_shipping_state() ];
				$shipping_address['zip']   = $order->get_shipping_postcode();
			} else {
				$shipping_address['line1'] = $order->get_billing_address_2();
				$shipping_address['line2'] = $order->get_billing_address_1();
				$shipping_address['city']  = $order->get_billing_city();
				$shipping_address['state'] = $states['JP'][ $order->get_billing_state() ];
				$shipping_address['zip']   = $order->get_billing_postcode();
			}
		}

		// Get the latest order.
		$args               = array(
			'customer_id' => $user_id,
			'status'      => 'completed',
			'orderby'     => 'date',
			'order'       => 'DESC',
		);
		$orders             = wc_get_orders( $args );
		$total_order_amount = 0;
		$order_count        = 0;
		foreach ( $orders as $each_order ) {
			if ( $each_order->get_payment_method() !== $this->id ) {
				$selected_orders[]   = $each_order;
				$total_order_amount += $each_order->get_total();
				++$order_count;
			}
		}
		if ( isset( $selected_orders[1] ) ) {
			foreach ( $selected_orders as $each_order ) {
				if ( end( $selected_orders ) === $each_order ) {
					$latest_order = $each_order;
				}
			}
		} elseif ( isset( $selected_orders ) ) {
			$latest_order = $selected_orders[0];
		} else {
			$latest_order = null;
		}
		if ( isset( $latest_order ) ) {
			$last_order_amount = $latest_order->get_total();
			$day1              = strtotime( $latest_order->get_date_created() );
			$day2              = strtotime( date_i18n( 'Y-m-d H:i:s' ) );
			$diff_day          = floor( ( $day2 - $day1 ) / ( 60 * 60 * 24 ) );
			if ( $diff_day <= 0 ) {
				$diff_day = 0;
			}
		} else {
			$last_order_amount = 0;
			$diff_day          = 0;
		}
		$order_amount = $order->get_total();
		$tax          = $order_amount - $paidy_amount - $order->get_shipping_total();

		if ( 'yes' === $this->enabled && isset( $api_public_key ) && '' !== $api_public_key && 'pending' === $order->get_status() ) :
			?>
			<script type="text/javascript">
				// Paidy Payment apply
				jQuery(window).on('load', function(){
					paidyPay();
				})
				var config = {
					"api_key": "<?php echo esc_js( $api_public_key ); ?>",
					"logo_url": "<?php echo esc_url( $logo_image_url ); ?>",
					"closed": function(callbackData) {
						/*
						Data returned in the callback:
						callbackData.id,
						callbackData.amount,
						callbackData.currency,
						callbackData.created_at,
						callbackData.status
						*/
						if(callbackData.status === "rejected"){
							window.location.href = "<?php echo esc_url( wc_get_checkout_url() . '?status=' ) . '" + callbackData.status + "&order_id=' . esc_js( $order_id ); ?>";
						}else if(callbackData.status === "authorized"){
							window.location.href = "<?php echo $this->get_return_url( $order ) . '&transaction_id=';//phpcs:ignore ?>" + callbackData.id;
						}else{
							window.location.href = "<?php echo esc_url( wc_get_checkout_url() ) . '?status='; ?>" + callbackData.status + "&order_id=<?php echo esc_js( $order_id ); ?>";
						}
					}
				};

				var paidyHandler = Paidy.configure(config);
				function paidyPay() {
					var payload = {
						"amount": <?php echo esc_js( $order_amount ); ?>,
						"currency": "JPY",
						"store_name": "<?php echo esc_js( $this->store_name ); ?>",
						"buyer": {
							"email": "<?php echo esc_js( $order->get_billing_email() ); ?>",
							"name1": "<?php echo esc_js( $order->get_billing_last_name() . ' ' . $order->get_billing_first_name() ); ?>",
			<?php
			$billing_yomigana_last_name = $order->get_meta( '_billing_yomigana_last_name' );
			if ( isset( $billing_yomigana_last_name ) ) :
				?>
							"name2": "<?php echo esc_js( $order->get_meta( '_billing_yomigana_last_name' ) . ' ' . $order->get_meta( '_billing_yomigana_first_name' ) ); ?>",
<?php endif; ?>
							"phone": "<?php echo esc_js( $order->get_billing_phone() ); ?>"
						},
						"buyer_data": {
							"user_id": "<?php echo esc_js( $user_id ); ?>",
							"order_count": <?php echo esc_js( $order_count ); ?>,
							"ltv": <?php echo esc_js( $total_order_amount ); ?>,
							"last_order_amount": <?php echo esc_js( $last_order_amount ); ?>,
							"last_order_at": <?php echo esc_js( $diff_day ); ?>
						},
						"order": {
							"items": [
						<?php echo $items;// phpcs:ignore ?>

							],
							"order_ref": "<?php echo esc_js( $paidy_order_ref ); ?>",
					<?php
					if ( $not_virtual ) {
						echo '"shipping": ' . esc_js( $order->get_shipping_total() ) . ',';}
					?>
							"tax": <?php echo esc_js( $tax ); ?>
						},
						<?php if ( $not_virtual ) { ?>
						"shipping_address": {
							"line1": "<?php echo esc_js( $shipping_address['line1'] ); ?>",
							"line2": "<?php echo esc_js( $shipping_address['line2'] ); ?>",
							"city": "<?php echo esc_js( $shipping_address['city'] ); ?>",
							"state": "<?php echo esc_js( $shipping_address['state'] ); ?>",
							"zip": "<?php echo esc_js( $shipping_address['zip'] ); ?>"
						},
						<?php } ?>
						"description": "<?php echo esc_js( $this->store_name ); ?>",
						"metadata" : {"Platform" : "WooCommerce"}
					};
					paidyHandler.launch(payload);
				}
			</script>
				<?php elseif ( 'yes' === $this->enabled && isset( $api_public_key ) && '' === $api_public_key ) : ?>
			<h2><?php esc_html_e( 'This order has already been settled.', 'paidy-wc' ); ?></h2>
		<?php else : ?>
			<h2><?php echo esc_html_e( 'API Public key is not set. Please set an API public key in the admin page.', 'paidy-wc' ); ?></h2>
			<?php
			endif;
	}

	/**
	 * Set API key
	 *
	 * @return string $api_secret_key
	 */
	private function set_api_secret_key() {
		if ( 'live' === $this->environment ) {
			$api_secret_key = $this->api_secret_key;
		} else {
			$api_secret_key = $this->test_api_secret_key;
		}
		return $api_secret_key;
	}

	/**
	 * Load Paidy Token javascript
	 */
	public function paidy_token_scripts_method() {
		if ( is_checkout_pay_page() ) {
			// Image upload.
			wp_enqueue_media();

			wp_enqueue_script(
				'paidy-redirect',
				WC_PAIDY_PLUGIN_URL . 'assets/js/jp4wc-paidy.js',
				array(),
				WC_PAIDY_VERSION,
				true
			);
			$paygent_token_js_link = 'https://apps.paidy.com/';
			if ( is_checkout() ) {
				wp_enqueue_script(
					'paidy-token',
					$paygent_token_js_link,
					array(),
					WC_PAIDY_VERSION,
					false
				);
				// Paidy Payment for Checkout page.
				wp_register_style(
					'jp4wc-paidy',
					WC_PAIDY_PLUGIN_URL . 'assets/css/jp4wc-paidy.css',
					false,
					WC_PAIDY_VERSION
				);
				wp_enqueue_style( 'jp4wc-paidy' );
			}
		}
	}

	/**
	 * Load Paidy javascript for Admin
	 *
	 * @param string $hook_suffix Hook suffix.
	 */
	public function admin_enqueue_scripts( $hook_suffix ) {
		if ( 'woocommerce_page_wc-settings' !== $hook_suffix ) {
			return;
		}
		// Image upload.
		wp_enqueue_media();
		if ( is_admin() && false === wp_script_is( 'wc-gateway-ppec-settings' ) && isset( $_GET['section'] ) && 'paidy' === $_GET['section'] ) {// phpcs:ignore
			wp_enqueue_script(
				'wc-gateway-paidy-settings',
				WC_PAIDY_PLUGIN_URL . 'assets/js/wc-gateway-paidy-settings.js',
				array( 'jquery' ),
				WC_PAIDY_VERSION,
				true
			);

		}

		if ( is_admin() && isset( $_GET['section'] ) && isset( $_GET['tab'] ) && 'paidy' === $_GET['section'] && 'checkout' === $_GET['tab'] ) {// phpcs:ignore
			$handle            = 'wc-paidy-admin-script';
			$script_path       = '/includes/gateways/paidy/assets/js/admin/paidy.js';
			$script_asset_path = WC_PAIDY_ABSPATH . 'includes/gateways/paidy/assets/js/admin/paidy.asset.php';
			$script_asset      = file_exists( $script_asset_path )
				? require $script_asset_path
				: array(
					'dependencies' => array(),
					'version'      => '1.2.0',
				);
			$script_url        = WC_PAIDY_PLUGIN_URL . $script_path;

			$screen = get_current_screen();
			wp_register_script(
				$handle,
				$script_url,
				$script_asset['dependencies'],
				$script_asset['version'],
				true
			);

			wp_set_script_translations(
				$handle,
				'paidy-wc',
				WC_PAIDY_ABSPATH . 'i18n/'
			);

			wp_enqueue_script( $handle );

			wp_enqueue_style(
				'paidy-admin-style',
				WC_PAIDY_PLUGIN_URL . 'includes/gateways/paidy/assets/js/admin/paidy.css',
				array_filter(
					$script_asset['dependencies'],
					function ( $style ) {
						return wp_style_is( $style, 'registered' );
					}
				),
				$script_asset['version'],
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
	}

	/**
	 * Update Cancel from Auth to Paidy System
	 *
	 * @param object $checkout WooCommerce Checkout object.
	 */
	public function checkout_reject_to_cancel( $checkout ) {
		if ( isset( $_GET['status'] ) ) { // phpcs:ignore
			if ( 'closed' === $_GET['status'] ) { // phpcs:ignore
				$message = __( 'Once the customer interrupted the payment.. Order ID:', 'paidy-wc' ) . $_GET['order_id'];// phpcs:ignore
				$this->jp4wc_framework->jp4wc_debug_log( $message, $this->debug, 'paidy-wc' );
				} elseif ( 'rejected' === $_GET['status'] || isset( $_GET['order_id'] ) ) {// phpcs:ignore
				$reject_message = __( 'This Paidy payment has been declined. Please select another payment method.', 'paidy-wc' );
				wc_add_notice( $reject_message, 'error' );
			}
		}
	}

	/**
	 * Update Complete at thank you page for Paidy Payment
	 *
	 * @param string $order_id Order ID.
	 */
	public function thankyou_completed( $order_id ) {
		$order          = wc_get_order( $order_id );
		$current_status = $order->get_status();
		if ( 'pending' === $current_status || 'cancelled' === $current_status ) {
			// Reduce stock levels.
			wc_reduce_stock_levels( $order_id );
			$order->payment_complete( $_GET['transaction_id'] );// phpcs:ignore
			$message  = __( 'Paidy Payment succeeds to authorize and move to thank you page. Get data is following.', 'paidy-wc' ) . "\n";
			$message .= $this->jp4wc_framework->jp4wc_array_to_message( $_GET ); // phpcs:ignore
			$this->jp4wc_framework->jp4wc_debug_log( $message, $this->debug, 'paidy-wc' );
		}
	}

	/**
	 * Validate api_public_key input and add error
	 *
	 * @param string $key not use.
	 * @param string $value API Public Key.
	 * @return mixed
	 */
	public function validate_api_public_key_field( $key, $value ) {
		return $this->setting_required_field( __( 'API Public Key', 'paidy-wc' ), __( 'Production environment', 'paidy-wc' ), $value );
	}

	/**
	 * Validate api_secret_key input and add error
	 *
	 * @param string $key not use.
	 * @param string $value API Secret Key.
	 * @return mixed
	 */
	public function validate_api_secret_key_field( $key, $value ) {
		return $this->setting_required_field( __( 'API Secret Key', 'paidy-wc' ), __( 'Production environment', 'paidy-wc' ), $value );
	}

	/**
	 * Validate api_public_key input and add error
	 *
	 * @param string $title Field title.
	 * @param string $environment Environment.
	 * @param string $value API Public Key.
	 * @return mixed
	 */
	public function setting_required_field( $title, $environment, $value ) {
		if ( isset( $value ) && 1 > strlen( $value ) ) {
			$paidy_link = 'https://campaign.paidy.com/woocommerce';
			/* translators: 1) Field title 2) Environment 3) Paidy PR link */
			WC_Admin_Settings::add_error( sprintf( __( 'If you do not set %1$s, it will not work in the %2$s. Application is necessary for acquisition.', 'paidy-wc' ), $title, $environment, $paidy_link ) );
		}

		return $value;
	}

	/**
	 * Update Cancel from Auth to Paidy System
	 *
	 * @param string $order_id Order ID.
	 */
	public function paidy_order_paidy_status_processing_to_cancelled( $order_id ) {
		$secret_key           = $this->set_api_secret_key();
		$order                = wc_get_order( $order_id );
		$order_payment_method = $order->get_payment_method();
		$transaction_id       = $order->get_transaction_id();
		if ( $order_payment_method === $this->id && ! empty( $transaction_id ) ) {
				$send_url = 'https://api.paidy.com/payments/' . $transaction_id . '/close';
				$args     = array(
					'method'  => 'POST',
					'body'    => '{}',
					'headers' => array(
						'Content-Type'  => 'application/json',
						'Paidy-Version' => '2018-04-10',
						'Authorization' => 'Bearer ' . $secret_key,
					),
				);

				$message = 'Send URL is following. : ' . $send_url;
				$this->jp4wc_framework->jp4wc_debug_log( $message, $this->debug, 'paidy-wc' );

				$close       = wp_remote_post( $send_url, $args );
				$close_array = json_decode( $close['body'], true );
				if ( is_wp_error( $close ) ) {
					$order->add_order_note( $close->get_error_message() );
				} elseif ( 'closed' === $close_array['status'] ) {
					$message = $this->jp4wc_framework->jp4wc_array_to_message( $close_array ) . __( 'This order is success cancellation data at Paidy.', 'paidy-wc' );
					$this->jp4wc_framework->jp4wc_debug_log( $message, $this->debug, 'paidy-wc' );
				} else {
					$message = $this->jp4wc_framework->jp4wc_array_to_message( $close_array ) . __( 'This order is already close data at Paidy.', 'paidy-wc' );
					$this->jp4wc_framework->jp4wc_debug_log( $message, $this->debug, 'paidy-wc' );

					$order->add_order_note( __( 'Cancelled processing has not been completed due to a Paidy error. Please check Paidy admin.', 'paidy-wc' ) );
					return false;
				}
		}
		return true;
	}

	/**
	 * Handle order status change from completed to cancelled.
	 *
	 * @param int $order_id Order ID.
	 */
	public function paidy_order_paidy_status_completed_to_cancelled( $order_id ) {
		$order  = wc_get_order( $order_id );
		$amount = $order->get_total();
		$this->process_refund( $order_id, $amount );
	}
	/**
	 * Remove the refund button for orders with status 'processing'.
	 */
	public function paidy_remove_refund_button_for_processing() {
		global $post;
		if ( ! $post || 'shop_order' !== get_post_type( $post->ID ) ) {
			return;
		}

		$order = wc_get_order( $post->ID );
		if ( ! $order ) {
			return;
		}
		if ( 'processing' === $order->get_status() ) :
			?>
			<script>
			jQuery(document).ready(function($){
				$('.refund-items').remove();
			});
			</script>
			<?php
		endif;
	}

	/**
	 * Update Sale from Auth to Paidy System
	 *
	 * @param string $order_id Order ID.
	 *
	 * @return boolean true or false
	 */
	public function jp4wc_order_paidy_status_completed( $order_id ) {
		$secret_key           = $this->set_api_secret_key();
		$order                = wc_get_order( $order_id );
		$order_payment_method = $order->get_payment_method();
		if ( $order_payment_method === $this->id ) {
			$transaction_id = $order->get_transaction_id();
			$send_url       = 'https://api.paidy.com/payments/' . $transaction_id . '/captures';
			$args           = array(
				'method'  => 'POST',
				'body'    => '{"metadata": {"Platform": "WooCommerce"}}',
				'headers' => array(
					'Content-Type'  => 'application/json',
					'Paidy-Version' => '2018-04-10',
					'Authorization' => 'Bearer ' . $secret_key,
				),
			);
			if ( 'no' !== $this->debug ) {
				$debug_message = 'Send URL is following. : ' . $send_url;
				$this->jp4wc_framework->jp4wc_debug_log( $debug_message, true, 'paidy-wc' );
			}
			$capture       = wp_remote_post( $send_url, $args );
			$capture_array = json_decode( $capture['body'], true );

			if ( 'closed' === $capture_array['status'] ) {
				$message = $this->jp4wc_framework->jp4wc_array_to_message( $capture_array ) . __( 'This is capture data.', 'paidy-wc' );
				$this->jp4wc_framework->jp4wc_debug_log( $message, $this->debug, 'paidy-wc' );

				if ( isset( $capture_array['captures'][0]['id'] ) ) {
					$order->update_meta_data( 'paidy_capture_id', $capture_array['captures'][0]['id'] );
					$order->save_meta_data();
				}
				if ( (float) $capture_array['amount'] === $order->get_total() && $transaction_id === $capture_array['id'] ) {
					$order->add_order_note( __( 'In the payment completion process, the amount and ID match were confirmed.', 'paidy-wc' ) );
					return true;
				} else {
					$order->add_order_note( __( 'In the payment completion process, the amount and ID did not match. Check on the Paidy admin.', 'paidy-wc' ) );
				}
			} elseif ( is_wp_error( $capture ) ) {
				$message = $capture->get_error_message();
				$order->add_order_note( $message );
			} else {
				$message = $this->jp4wc_framework->jp4wc_array_to_message( $capture_array ) . 'This is capture data.';
				$this->jp4wc_framework->jp4wc_debug_log( $message, $this->debug, 'paidy-wc' );

				if ( isset( $capture_array['status'] ) ) {
					$this->paidy_check_response( $capture_array['status'], $order );
					if ( isset( $paidy_info ) && isset( $paidy_info['captures'] ) ) {
						return true;
					}
				} else {
					$order->add_order_note( __( 'There was no status in the notification from Paidy.', 'paidy-wc' ) );
				}
			}
			$situation     = __( 'Status Change from Processing to completed.', 'paidy-wc' );
			$email_message = $this->notice_message( $order_id, $transaction_id, $situation, $message );
			$this->send_notice_email( $email_message );
			return false;
		}
		return true;
	}

	/**
	 * Check the response status from Paidy and add an order note if there is an error.
	 *
	 * @param int      $status The response status code.
	 * @param WC_Order $order The WooCommerce order object.
	 */
	public function paidy_check_response( $status, $order ) {
		if ( 403 === $status ) {// Forbidden.
			$message = __( 'You have made a forbidden request.', 'paidy-wc' ) . __( 'Please go to your Paidy dashboard and check.', 'paidy-wc' );
			$order->add_order_note( $message );
		} elseif ( 401 === $status ) {// Unauthorized.
			$message = __( 'You have made an unauthorized request.', 'paidy-wc' ) . __( 'Please go to your Paidy dashboard and check.', 'paidy-wc' );
			$order->add_order_note( $message );
		} elseif ( 409 === $status ) {// Conflict.
			$message = __( 'You have made a conflict request.', 'paidy-wc' ) . __( 'Please go to your Paidy dashboard and check.', 'paidy-wc' );
			$order->add_order_note( $message );
		} elseif ( 404 === $status ) {// Not Found.
			$message = __( 'The requested resource could not be found.', 'paidy-wc' ) . __( 'Please go to your Paidy dashboard and check.', 'paidy-wc' );
			$order->add_order_note( $message );
		} elseif ( 400 === $status ) {// Bad Request.
			$message = __( 'The request failed.', 'paidy-wc' ) . __( 'Please go to your Paidy dashboard and check.', 'paidy-wc' );
			$order->add_order_note( $message );
		} else {
			$order->add_order_note( __( 'I received a notification from Paidy stating that the status was unexpected.', 'paidy-wc' ) );
		}
	}

	/**
	 * Process a refund if supported
	 *
	 * @param  int    $order_id Order ID.
	 * @param  float  $amount Refund amount.
	 * @param  string $reason Refund reason.
	 * @return  boolean True or false based on success, or a WP_Error object
	 */
	public function process_refund( $order_id, $amount = null, $reason = '' ) {
		$secret_key           = $this->set_api_secret_key();
		$order                = wc_get_order( $order_id );
		$order_payment_method = $order->get_payment_method();
		$capture_id           = $order->get_meta( 'paidy_capture_id', true );
		if ( $order_payment_method === $this->id ) {
			$transaction_id = $order->get_transaction_id();
			$post_data      = '{"capture_id":"' . $capture_id . '","amount":"' . $amount . '","metadata" : {"Platform" : "WooCommerce"}}';
			$send_url       = 'https://api.paidy.com/payments/' . $transaction_id . '/refunds';
			$args           = array(
				'method'  => 'POST',
				'body'    => $post_data,
				'headers' => array(
					'Content-Type'  => 'application/json',
					'Paidy-Version' => '2018-04-10',
					'Authorization' => 'Bearer ' . $secret_key,
				),
			);
			// Debug message.
			$message  = 'Send URL is following. : ' . $send_url . "\n";
			$message .= 'Post data is following. : ' . $post_data;
			$this->jp4wc_framework->jp4wc_debug_log( $message, $this->debug, 'paidy-wc' );
			if ( '' !== $capture_id ) {
				$refund = wp_remote_post( $send_url, $args );
			} else {
				$order->add_order_note( __( 'Refund is not possible because Paidy has not completed processing.', 'paidy-wc' ) );
				return false;
			}
			$refund_array = json_decode( $refund['body'], true );
			if ( is_wp_error( $refund ) ) {
				$order->add_order_note( $refund->get_error_message() );
				return false;
			} elseif ( 'closed' === $refund_array['status'] ) {
				$refunds_array = $order->get_meta( 'paidy_refund_id', false );
				if ( empty( $refunds_array ) ) {
					$refunds_array = array( $refund_array['refunds'][0]['id'] );
				} else {
					$refunds_array = array_merge( $refunds_array, array( $refund_array['refunds'][0]['id'] ) );
				}
				$order->update_meta_data( 'paidy_refund_id', $refunds_array );
				$order->save_meta_data();
				$order->add_order_note( __( 'Completion refunding has been completed at Paidy.', 'paidy-wc' ) );
				return true;
			} else {
				$message = $this->jp4wc_framework->jp4wc_array_to_message( $refund_array ) . 'This is refund data.';
				$this->jp4wc_framework->jp4wc_debug_log( $message, $this->debug, 'paidy-wc' );

				if ( isset( $refund_array['status'] ) ) {
					$this->paidy_check_response( $refund_array['status'], $order );
					if ( 403 === $refund_array['status'] ) {
						$paidy_info = $this->paidy_get_payment_data( $transaction_id );
						if ( isset( $paidy_info ) && isset( $paidy_info['refund'] ) ) {
							return true;
						}
					} else {
						$order->add_order_note( __( 'There was no status in the notification from Paidy.', 'paidy-wc' ) );
					}
					return false;
				}
			}
			return true;
		}
	}

	/**
	 * Check Paidy payment details by payment_id
	 *
	 * @param string $payment_id Paidy payment ID.
	 * @return WP_Error|array
	 */
	public function paidy_get_payment_data( $payment_id ) {
		$send_url = 'https://api.paidy.com/payments/' . $payment_id;
		$args     = array(
			'method'  => 'POST',
			'body'    => '',
			'headers' => array(
				'Content-Type'  => 'application/json',
				'Paidy-Version' => '2018-04-10',
				'Authorization' => 'Bearer ' . $this->set_api_secret_key(),
			),
		);
		$response = wp_remote_post( $send_url, $args );
		return json_decode( $response['body'], true );
	}

	/**
	 * Send notice e-mail to shop owner
	 *
	 * @param  string $message Error message.
	 */
	public function send_notice_email( $message ) {
		$to = $this->notice_email;
		if ( is_email( $to ) ) {
			$subject = __( '[WooCommerce] Notice of error occurrence in Paidy payment linkage', 'paidy-wc' );
			$headers = array( 'Content-Type: text/html; charset=UTF-8' );
			wp_mail( $to, $subject, $message, $headers );
		}
	}

	/**
	 * Send notice e-mail to shop owner
	 *
	 * @param  string $order_id Order ID.
	 * @param  string $transaction_id Paidy payment ID.
	 * @param  string $situation Error situation.
	 * @param  string $error_message Error message.
	 * @return string
	 */
	public function notice_message( $order_id, $transaction_id, $situation, $error_message = null ) {
		$message  = '';
		$message .= __( 'An error has occurred in the Paidy payment linkage when changing the status of WooCommerce.', 'paidy-wc' ) . "\n";
		$message .= __( 'Please check the status of Paidy payment and respond accordingly.', 'paidy-wc' ) . "\n\n";
		$message .= __( 'Order number:', 'paidy-wc' ) . $order_id . "\n";
		$message .= __( 'Order details URL:', 'paidy-wc' ) . site_url() . '/wp-admin/post.php?post=' . $order_id . '&action=edit' . "\n";
		$message .= __( 'Paidy payment ID:', 'paidy-wc' ) . $transaction_id . "\n";
		$message .= __( 'Error occurrence time:', 'paidy-wc' ) . gmdate( 'Y/m/d H:i:s' ) . "\n";
		$message .= __( 'Error situation:', 'paidy-wc' ) . $situation . "\n";
		if ( isset( $error_message ) ) {
			$message .= __( 'Error situation:', 'paidy-wc' ) . $error_message . "\n";
		}
		$message .= "\n" . __( '* This e-mail is for sending only, so you cannot reply directly to this e-mail.', 'paidy-wc' );
		return $message;
	}

	/**
	 * Generate Image HTML.
	 *
	 * @param  mixed $key Key.
	 * @param  mixed $data Data.
	 * @since  1.5.0
	 * @return string
	 */
	public function generate_image_html( $key, $data ) {
		$field_key = $this->get_field_key( $key );
		$defaults  = array(
			'title'             => '',
			'disabled'          => false,
			'class'             => '',
			'css'               => '',
			'placeholder'       => '',
			'type'              => 'text',
			'desc_tip'          => false,
			'description'       => '',
			'custom_attributes' => array(),
		);

		$data  = wp_parse_args( $data, $defaults );
		$value = $this->get_option( $key );

		// Hide show add remove buttons.
		$maybe_hide_add_style    = '';
		$maybe_hide_remove_style = '';

		// For backwards compatibility (customers that already have set a url).
		$value_is_url = filter_var( $value, FILTER_VALIDATE_URL ) !== false;

		if ( empty( $value ) || $value_is_url ) {
			$maybe_hide_remove_style = 'display: none;';
		} else {
			$maybe_hide_add_style = 'display: none;';
		}

		ob_start();
		?>
		<tr>
			<th scope="row" class="titledesc">
				<label for="<?php echo esc_attr( $field_key ); ?>"><?php echo wp_kses_post( $data['title'] ); ?> <?php echo esc_html( $this->get_tooltip_html( $data ) ); ?></label>
			</th>

			<td class="image-component-wrapper">
				<div class="image-preview-wrapper">
					<?php
					if ( ! $value_is_url ) {
						echo wp_get_attachment_image( $value, 'thumbnail' );
					} else {
						// translators: %s: URL of the image.
						printf( esc_html__( 'Already using URL as image: %s', 'paidy-wc' ), esc_url( $value ) );
					}
					?>
				</div>

				<button
						class="button image_upload"
						data-field-id="<?php echo esc_attr( $field_key ); ?>"
						data-media-frame-title="<?php echo esc_attr( __( 'Select a image to upload', 'paidy-wc' ) ); ?>"
						data-media-frame-button="<?php echo esc_attr( __( 'Use this image', 'paidy-wc' ) ); ?>"
						data-add-image-text="<?php echo esc_attr( __( 'Add image', 'paidy-wc' ) ); ?>"
						style="<?php echo esc_attr( $maybe_hide_add_style ); ?>"
				>
					<?php echo esc_html__( 'Add image', 'paidy-wc' ); ?>
				</button>

				<button
						class="button image_remove"
						data-field-id="<?php echo esc_attr( $field_key ); ?>"
						style="<?php echo esc_attr( $maybe_hide_remove_style ); ?>"
				>
					<?php echo esc_html__( 'Remove image', 'paidy-wc' ); ?>
				</button>

				<input type="hidden"
						name="<?php echo esc_attr( $field_key ); ?>"
						id="<?php echo esc_attr( $field_key ); ?>"
						value="<?php echo esc_attr( $value ); ?>"
				/>
			</td>
		</tr>
		<?php

		return ob_get_clean();
	}
}
