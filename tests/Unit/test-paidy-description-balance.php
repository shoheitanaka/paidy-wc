<?php
/**
 * Tests for balancing the Paidy description HTML.
 *
 * The paidy_description setting is admin-editable HTML pre-filled with a
 * multi-line explanation (div + ul + li). wp_kses() does not fix unbalanced
 * tags, so a stray closing tag saved in this field escaped the payment box
 * when the classic checkout payment fragment was re-rendered via
 * update_order_review, leaving an orphaned place-order row behind on every
 * checkout update (duplicated order buttons). Covers the force_balance_tags()
 * fix on the output path.
 *
 * Japanized for WooCommerce also balances and filters the value on save
 * (validate_paidy_description_field()) with the narrow output allowlist,
 * which strips the <img>, class and style attributes of the default
 * explanation. The block checkout shows the saved value as is, so paidy-wc
 * does not take that save-path validation (docs/sync-with-jp4wc.md,
 * intentional difference 14) and covers that saving keeps the markup.
 *
 * @package paidy-wc
 */

/**
 * WC_Paidy_Description_Balance_Test
 */
class WC_Paidy_Description_Balance_Test extends WP_UnitTestCase {

	/**
	 * Gateway instance under test.
	 *
	 * @var WC_Gateway_Paidy
	 */
	private $gateway;

	/**
	 * Set up test environment before each test.
	 */
	public function setUp(): void {
		parent::setUp();

		if ( ! class_exists( 'WC_Gateway_Paidy' ) ) {
			require_once dirname( __DIR__, 2 ) . '/includes/gateways/paidy/class-wc-gateway-paidy.php';
		}
		$this->assertTrue( class_exists( 'WC_Gateway_Paidy' ), 'WC_Gateway_Paidy should be loadable.' );
		$this->gateway = new WC_Gateway_Paidy();
	}

	/**
	 * Saving the description keeps the markup that the block checkout shows.
	 */
	public function test_saving_keeps_the_markup_the_block_checkout_shows() {
		$field   = $this->gateway->get_form_fields()['paidy_description'];
		$default = $field['default'];
		$this->assertStringContainsString( '<img', $default );

		$saved = $this->gateway->get_field_value(
			'paidy_description',
			$field,
			array( $this->gateway->get_field_key( 'paidy_description' ) => wp_slash( $default ) )
		);

		$this->assertStringContainsString( '<img', $saved );
		$this->assertStringContainsString( 'class="jp4wc-paidy-explanation"', $saved );
	}

	/**
	 * Saving still strips disallowed tags (WooCommerce's textarea validation).
	 */
	public function test_saving_strips_disallowed_tags() {
		$saved = $this->gateway->get_field_value(
			'paidy_description',
			$this->gateway->get_form_fields()['paidy_description'],
			array( $this->gateway->get_field_key( 'paidy_description' ) => '<div><script>alert(1)</script><strong>OK</strong></div>' )
		);

		$this->assertStringNotContainsString( '<script', $saved );
		$this->assertStringContainsString( '<strong>OK</strong>', $saved );
	}

	/**
	 * The payment_fields() method must emit balanced HTML even when the saved setting
	 * already contains a stray closing tag (pre-fix data).
	 */
	public function test_payment_fields_output_is_balanced_with_broken_setting() {
		$this->gateway->paidy_description = '<div>Paidyで翌月払い</div></div>';

		ob_start();
		$this->gateway->payment_fields();
		$output = ob_get_clean();

		$this->assertStringContainsString( '<div>Paidyで翌月払い</div>', $output );
		$this->assertSame(
			substr_count( $output, '<div' ),
			substr_count( $output, '</div' ),
			'payment_fields output must not leak unbalanced closing tags into the checkout fragment'
		);
	}

	/**
	 * The payment_fields() method must fall back to the built-in explanation when the
	 * setting is empty, and that output must be balanced too.
	 */
	public function test_payment_fields_default_output_is_balanced() {
		$this->gateway->paidy_description = '';

		ob_start();
		$this->gateway->payment_fields();
		$output = ob_get_clean();

		$this->assertStringContainsString( '<ul>', $output );
		$this->assertSame(
			substr_count( $output, '<div' ),
			substr_count( $output, '</div' )
		);
	}
}
