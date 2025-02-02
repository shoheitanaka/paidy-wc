<?php
/**
 * Paidy endpoint.
 *
 * @package WooCommerce\Gateways
 */

use ArtisanWorkshop\PluginFramework\v2_0_13 as Framework;

/**
 * WC_Paidy_Endpoint class.
 */
class WC_Paidy_Endpoint {

	/**
	 * Constructor.
	 */
	public function __construct() {
		// Rest API to receive payment notifications from Paidy.
		add_action( 'rest_api_init', array( $this, 'paidy_register_routes' ) );
		// WebHook to get data from paidy.artws.info.
		add_action( 'rest_api_init', array( $this, 'paidy_check_regist_webhook' ) );
	}

	/**
	 * Callback. Rest API to receive payment notifications from Paidy.
	 */
	public function paidy_register_routes() {
		// POST /wp-json/paidy/v1/order .
		register_rest_route(
			'paidy/v1',
			'/order',
			array(
				'methods'             => 'POST',
				'callback'            => array( $this, 'paidy_check_webhook' ),
				'permission_callback' => '__return_true',
			)
		);
	}

	/**
	 * Paidy Webhook response.
	 * Version: 1.4.6
	 *
	 * @param object $data post data.
	 * @return WP_REST_Response | WP_Error endpoint Paidy webhook response
	 */
	public function paidy_check_webhook( $data ) {
		$jp4wc_framework = new Framework\JP4WC_Framework();
		$paidy           = new WC_Gateway_Paidy();
		$debug           = $paidy->debug;
		$body_data       = (array) $data->get_body();
		$main_data       = json_decode( $body_data[0], true );
		$notice_message  = __( 'Paidy Webhook received. ', 'paidy-wc' );
		if ( empty( $data ) ) {
			$message = $notice_message . 'no_data';
			$jp4wc_framework->jp4wc_debug_log( $message, $debug, 'paidy-wc' );

			return new WP_Error( 'no_data', 'Invalid author', array( 'status' => 404 ) );
		} elseif ( isset( $main_data['payment_id'] ) && isset( $main_data['order_ref'] ) ) {
			if ( is_numeric( $main_data['order_ref'] ) ) {
				// Debug.
				if ( 'pay_0000000000000001' === $main_data['payment_id'] ) {
					$message = $notice_message . __( 'This notification is a test request from Paidy.', 'paidy-wc' ) . "\n" . $jp4wc_framework->jp4wc_array_to_message( $main_data );
					$jp4wc_framework->jp4wc_debug_log( $message, $debug, 'paidy-wc' );
					return new WP_REST_Response( $main_data, 200 );
				} else {
					$message = $notice_message . __( 'Exist [payment_id] and [order_ref]', 'paidy-wc' ) . "\n" . $jp4wc_framework->jp4wc_array_to_message( $main_data );
					$jp4wc_framework->jp4wc_debug_log( $message, $debug, 'paidy-wc' );
				}

				$order = wc_get_order( $main_data['order_ref'] );
				if ( false === $order ) {
					$message = $notice_message . __( 'The order with this order number does not exist in the store.', 'paidy-wc' ) . "\n" . 'Order# :' . $main_data['order_ref'];
					$jp4wc_framework->jp4wc_debug_log( $message, $debug, 'paidy-wc' );
					return new WP_REST_Response( $main_data, 200 );
				}
				$status = $order->get_status();

				$enable_authorize_success_statuses = apply_filters( 'paidy_endpoint_enable_authorize_statuses', array( 'pending', 'cancelled' ), $order );

				if ( 'authorize_success' === $main_data['status'] && in_array( $status, $enable_authorize_success_statuses, true ) ) {
					// Reduce stock levels.
					wc_reduce_stock_levels( $main_data['order_ref'] );
					if ( isset( $main_data['payment_id'] ) ) {
						$order->payment_complete( $main_data['payment_id'] );
					} else {
						$order->payment_complete();
					}
					// translators: %s: authorization status of the order.
					$order->add_order_note( sprintf( __( 'It succeeded to check the %s of the order in Paidy Webhook.', 'paidy-wc' ), __( 'authorization', 'paidy-wc' ) ) );
				} elseif ( 'authorize_success' === $main_data['status'] && 'processing' === $status ) {
					$order->add_order_note( __( 'This order status is processing, this site received authorize_success from the Paidy webhook.', 'paidy-wc' ) );
				} elseif ( 'capture_success' === $main_data['status'] && 'completed' === $status ) {
					// translators: %s: completed status of the order.
					$order->add_order_note( sprintf( __( 'It succeeded to check the %s of the order in Paidy Webhook.', 'paidy-wc' ), __( 'completed', 'paidy-wc' ) ) );
				} elseif ( 'close_success' === $main_data['status'] && 'cancelled' === $status ) {
					// translators: %s: cancelled status of the order.
					$order->add_order_note( sprintf( __( 'It succeeded to check the %s of the order in Paidy Webhook.', 'paidy-wc' ), __( 'cancelled', 'paidy-wc' ) ) );
				} elseif ( 'close_success' === $main_data['status'] && 'completed' === $status ) {
					// translators: %s: close status of the order.
					$order->add_order_note( sprintf( __( 'It succeeded to check the %s of the order in Paidy Webhook.', 'paidy-wc' ), __( 'close', 'paidy-wc' ) ) );
				} elseif ( 'refund_success' === $main_data['status'] && 'refunded' === $status ) {
					// translators: %s: refunded status of the order.
					$order->add_order_note( sprintf( __( 'It succeeded to check the %s of the order in Paidy Webhook.', 'paidy-wc' ), __( 'refunded', 'paidy-wc' ) ) );
				} else {
					// translators: %s: status of the order.
					$order->add_order_note( sprintf( __( 'The system received a notification for order %s via Paidy Webhook.', 'paidy-wc' ), $main_data['status'] ) );
				}
				return new WP_REST_Response( $main_data, 200 );
			} else {
				// Debug.
				$message = $notice_message . __( 'Payment_id exist but order_id. Payment_id : ', 'paidy-wc' ) . $main_data['payment_id'] . '; Status : ' . $main_data['status'];
				$jp4wc_framework->jp4wc_debug_log( $message, $debug, 'paidy-wc' );
				return new WP_Error( 'no_order_id', $message, array( 'status' => 404 ) );
			}
		} else {
			// Debug.
			$message = '[no_payment_id]' . $jp4wc_framework->jp4wc_array_to_message( $main_data );
			$jp4wc_framework->jp4wc_debug_log( $message, $debug, 'paidy-wc' );
			return new WP_Error( 'no_payment_id', 'Invalid author', array( 'status' => 404 ) );
		}
	}

	/**
	 * Callback. Register WebHook route to get data from paidy.artws.info.
	 */
	public function paidy_check_regist_webhook() {
		// POST /wp-json/paidy/v1/check .
		register_rest_route(
			'paidy/v1',
			'/check',
			array(
				'methods'             => 'POST',
				'callback'            => array( $this, 'paidy_check_webhook' ),
				'permission_callback' => '__return_true',
			)
		);
	}
}
