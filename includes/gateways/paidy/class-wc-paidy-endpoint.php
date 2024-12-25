<?php
/**
 * Paidy endpoint.
 *
 * @package WooCommerce\Gateways
 */

use ArtisanWorkshop\WooCommerce\PluginFramework\v2_0_13 as Framework;

/**
 * WC_Paidy_Endpoint class.
 */
class WC_Paidy_Endpoint {

	/**
	 * Constructor.
	 */
	public function __construct() {
		add_action( 'rest_api_init', array( $this, 'paidy_register_routes' ) );
	}

	/**
	 * Callback.
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
	 * Version: 1.1.3
	 *
	 * @param object $data post data.
	 * @return WP_REST_Response | WP_Error endpoint Paidy webhook response
	 */
	public function paidy_check_webhook( $data ) {
		$jp4wc_framework = new Framework\JP4WC_Plugin();
		$paidy           = new WC_Gateway_Paidy();
		$debug           = $paidy->debug;
		$body_data       = (array) $data->get_body();
		$main_data       = json_decode( $body_data[0], true );
		if ( empty( $data ) ) {
			$message = 'no_data';
			$jp4wc_framework->jp4wc_debug_log( $message, $debug, 'paidy-wc' );

			return new WP_Error( 'no_data', 'Invalid author', array( 'status' => 404 ) );
		} elseif ( isset( $main_data['payment_id'] ) && isset( $main_data['order_ref'] ) ) {
			if ( is_numeric( $main_data['order_ref'] ) ) {
				// Debug.
				if ( 'pay_0000000000000001' === $main_data['payment_id'] ) {
					$message = 'This notification is a test request from Paidy.' . "\n" . $jp4wc_framework->jp4wc_array_to_message( $main_data );
					$jp4wc_framework->jp4wc_debug_log( $message, $debug, 'paidy-wc' );
					return new WP_REST_Response( $main_data, 200 );
				} else {
					$message = 'Exist [payment_id] and [order_ref]' . "\n" . $jp4wc_framework->jp4wc_array_to_message( $main_data );
					$jp4wc_framework->jp4wc_debug_log( $message, $debug, 'paidy-wc' );
				}

				$order = wc_get_order( $main_data['order_ref'] );
				if ( false === $order ) {
					$message = 'The order with this order number does not exist in the store.' . "\n" . 'Order# :' . $main_data['order_ref'];
					$jp4wc_framework->jp4wc_debug_log( $message, $debug, 'paidy-wc' );
					return new WP_REST_Response( $main_data, 200 );
				}
				$status = $order->get_status();

				if ( ( 'authorize_success' === $main_data['status'] && 'pending' === $status ) || 'cancelled' === $status ) {
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
					$order->add_order_note( sprintf( __( 'It failed to check the %s of the order in Paidy Webhook.', 'paidy-wc' ), $main_data['status'] ) );
				}
				return new WP_REST_Response( $main_data, 200 );
			} else {
				// Debug.
				$message = 'Payment_id exist but order_id. Payment_id : ' . $main_data['payment_id'] . '; Status : ' . $main_data['status'];
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
}
