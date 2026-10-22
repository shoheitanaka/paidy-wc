<?php
/**
 * Tests that the block checkout support is loaded at plugins_loaded.
 *
 * The file was required inside the woocommerce_blocks_payment_method_type_registration
 * callback, which WooCommerce runs when it registers payment methods at init. A plugin
 * update that replaced the plugin directory between plugins_loaded and init made that
 * require fail with a fatal error ("Failed opening required …"). WC_Paidy::includes()
 * now loads the file at plugins_loaded, the callback only creates the class, and it
 * skips the registration when the class is not declared, as happens when an earlier
 * class-wc-paidy.php is still running during the update (Japanized for WooCommerce
 * issue #268). The block support also tolerates a gateway list without Paidy
 * (Japanized for WooCommerce 2.9.5).
 *
 * @package paidy-wc
 */

/**
 * WC_Paidy_Load_At_Plugins_Loaded_Test
 */
class WC_Paidy_Load_At_Plugins_Loaded_Test extends WP_UnitTestCase {

	/**
	 * Plugin-relative path of the block support class file.
	 */
	const BLOCKS_FILE = 'includes/gateways/paidy/class-wc-payments-paidy-blocks-support.php';

	/**
	 * Set up test environment before each test.
	 */
	public function setUp(): void {
		parent::setUp();
		$this->assertTrue( class_exists( 'WC_Paidy' ), 'WC_Paidy should be loaded by the plugin bootstrap.' );
	}

	/**
	 * The block support file is loaded, and its class declared, by the end of plugins_loaded.
	 */
	public function test_block_support_file_is_loaded_at_plugins_loaded() {
		$this->assertArrayHasKey( 'wc_paidy_tests_plugins_loaded_state', $GLOBALS, 'tests/bootstrap.php records the state at plugins_loaded.' );
		$state = $GLOBALS['wc_paidy_tests_plugins_loaded_state'];

		$this->assertContains( realpath( dirname( __DIR__, 2 ) . '/' . self::BLOCKS_FILE ), $state['files'] );
		// A file that returns early before its class is in the list above but declares nothing.
		$this->assertContains( 'WC_Payments_Paidy_Blocks_Support', $state['classes'] );
	}

	/**
	 * The callbacks that run after plugins_loaded read no files.
	 *
	 * Checked on the source: require_once of a file that is already loaded still
	 * resolves the path on disk, so it fails while the directory is missing.
	 */
	public function test_hook_callbacks_read_no_files() {
		$callbacks = array(
			'WC_Paidy::wc_paidy_blocks_support' => new ReflectionMethod( 'WC_Paidy', 'wc_paidy_blocks_support' ),
			'wc_paidy_plugin'                   => new ReflectionFunction( 'wc_paidy_plugin' ),
		);

		foreach ( $callbacks as $name => $callback ) {
			$this->assertSame( array(), $this->file_reads( $callback ), $name . ' reads a file (lines listed).' );
		}
	}

	/**
	 * The payment method registration checks that the block support class is declared.
	 */
	public function test_payment_registration_checks_the_class_is_declared() {
		// phpcs:ignore WordPress.WP.AlternativeFunctions.file_get_contents_file_get_contents -- Local plugin file.
		$source = file_get_contents( dirname( __DIR__, 2 ) . '/class-wc-paidy.php' );
		preg_match_all( '/\$payment_method_registry->register\(\s*new\s+(\w+)\(\)\s*\);/', $source, $matches, PREG_OFFSET_CAPTURE );

		$this->assertCount( 1, $matches[0], 'class-wc-paidy.php registers one block payment method.' );
		$this->assertSame( 'WC_Payments_Paidy_Blocks_Support', $matches[1][0][0] );
		$guard = '/if\s*\(\s*class_exists\(\s*\'WC_Payments_Paidy_Blocks_Support\',\s*false\s*\)\s*\)\s*\{\s*$/';
		$this->assertMatchesRegularExpression( $guard, substr( $source, 0, $matches[0][0][1] ) );
	}

	/**
	 * The Paidy method is registered with WooCommerce Blocks once the request has initialised.
	 */
	public function test_paidy_is_registered_with_woocommerce_blocks() {
		$registry_class = 'Automattic\WooCommerce\Blocks\Payments\PaymentMethodRegistry';
		$this->assertTrue( class_exists( $registry_class ), 'WooCommerce Blocks should be available in the test suite.' );
		$registry = Automattic\WooCommerce\Blocks\Package::container()->get( $registry_class );

		$this->assertTrue( $registry->is_registered( 'paidy' ) );
		$this->assertInstanceOf( 'WC_Payments_Paidy_Blocks_Support', $registry->get_registered( 'paidy' ) );
	}

	/**
	 * Without Paidy in WooCommerce's gateway list the block support is inactive instead of fatal.
	 */
	public function test_block_support_is_inactive_without_the_gateway() {
		$support  = new WC_Payments_Paidy_Blocks_Support();
		$property = new ReflectionProperty( 'WC_Payments_Paidy_Blocks_Support', 'gateway' );
		$property->setValue( $support, null );

		$this->assertFalse( $support->is_active() );
	}

	/**
	 * Lines of require and include statements inside a function.
	 *
	 * @param ReflectionFunctionAbstract $callback Function or method.
	 * @return int[] Line numbers.
	 */
	private function file_reads( ReflectionFunctionAbstract $callback ) {
		// phpcs:ignore WordPress.WP.AlternativeFunctions.file_get_contents_file_get_contents -- Local plugin file.
		$tokens = token_get_all( file_get_contents( $callback->getFileName() ) );
		$reads  = array();
		foreach ( $tokens as $token ) {
			if ( ! is_array( $token ) || ! in_array( $token[0], array( T_REQUIRE, T_REQUIRE_ONCE, T_INCLUDE, T_INCLUDE_ONCE ), true ) ) {
				continue;
			}
			if ( $token[2] >= $callback->getStartLine() && $token[2] <= $callback->getEndLine() ) {
				$reads[] = $token[2];
			}
		}

		return $reads;
	}
}
