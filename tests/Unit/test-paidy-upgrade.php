<?php
/**
 * Tests for the version check that fires paidy_wc_updated.
 *
 * Japanized for WooCommerce redacts the secret API keys left in
 * paidy_received_data from its own install routine (jp4wc_updated). paidy-wc
 * has no such routine, so paidy_wc_check_version() records the plugin version
 * in the paidy_wc_version option and fires paidy_wc_updated once whenever it
 * changes; WC_Paidy_Apply_Receiver::redact_stored_secrets_on_upgrade()
 * listens to that action.
 *
 * @package paidy-wc
 */

/**
 * WC_Paidy_Upgrade_Test
 */
class WC_Paidy_Upgrade_Test extends WP_UnitTestCase {

	/**
	 * Number of times paidy_wc_updated fired during the test.
	 *
	 * @var int
	 */
	private $fired = 0;

	/**
	 * Argument of the last paidy_wc_updated call.
	 *
	 * @var string|false|null
	 */
	private $previous_version = null;

	/**
	 * Set up test environment before each test.
	 */
	public function setUp(): void {
		parent::setUp();

		$this->assertTrue( function_exists( 'paidy_wc_check_version' ) );
		add_action( 'paidy_wc_updated', array( $this, 'record_update' ) );
	}

	/**
	 * Tear down test environment after each test.
	 */
	public function tearDown(): void {
		remove_action( 'paidy_wc_updated', array( $this, 'record_update' ) );
		delete_option( 'paidy_wc_version' );
		delete_option( 'paidy_received_data' );
		parent::tearDown();
	}

	/**
	 * Listener that records each paidy_wc_updated call.
	 *
	 * @param string|false $previous_version Version recorded before the check.
	 * @return void
	 */
	public function record_update( $previous_version ) {
		++$this->fired;
		$this->previous_version = $previous_version;
	}

	/**
	 * The check runs on 'init' before the receiver is instantiated.
	 */
	public function test_check_version_runs_before_the_receiver() {
		$this->assertSame( 5, has_action( 'init', 'paidy_wc_check_version' ) );
		$this->assertSame( 10, has_action( 'init', 'init_paidy_receiver' ) );
	}

	/**
	 * Versions before 1.6.0 recorded no version, so an upgrade from them fires the action.
	 */
	public function test_fires_when_no_version_is_recorded() {
		delete_option( 'paidy_wc_version' );

		paidy_wc_check_version();

		$this->assertSame( 1, $this->fired );
		$this->assertFalse( $this->previous_version );
		$this->assertSame( WC_PAIDY_VERSION, get_option( 'paidy_wc_version' ) );
	}

	/**
	 * A changed version fires the action once and records the new version.
	 */
	public function test_fires_once_when_the_version_changes() {
		update_option( 'paidy_wc_version', '1.0.0' );

		paidy_wc_check_version();
		paidy_wc_check_version();

		$this->assertSame( 1, $this->fired );
		$this->assertSame( '1.0.0', $this->previous_version );
		$this->assertSame( WC_PAIDY_VERSION, get_option( 'paidy_wc_version' ) );
	}

	/**
	 * The current version does not fire the action.
	 */
	public function test_does_not_fire_for_the_current_version() {
		update_option( 'paidy_wc_version', WC_PAIDY_VERSION );

		paidy_wc_check_version();

		$this->assertSame( 0, $this->fired );
	}

	/**
	 * A downgrade records the version without firing the action.
	 */
	public function test_does_not_fire_on_a_downgrade() {
		update_option( 'paidy_wc_version', '99.0.0' );

		paidy_wc_check_version();

		$this->assertSame( 0, $this->fired );
		$this->assertSame( WC_PAIDY_VERSION, get_option( 'paidy_wc_version' ) );
	}

	/**
	 * The upgrade redacts the secret keys a pre-1.6.0 callback stored in plaintext.
	 */
	public function test_upgrade_redacts_plaintext_secrets() {
		update_option(
			'paidy_received_data',
			array(
				'application_id'  => 'WC000000571',
				'public_live_key' => 'pk_live_xxx',
				'secret_live_key' => 'sk_live_xxx',
				'public_test_key' => 'pk_test_xxx',
				'secret_test_key' => 'sk_test_xxx',
			),
			false
		);
		delete_option( 'paidy_wc_version' );

		paidy_wc_check_version();

		$received_data = get_option( 'paidy_received_data' );
		$this->assertSame( '[redacted]', $received_data['secret_live_key'] );
		$this->assertSame( '[redacted]', $received_data['secret_test_key'] );
		$this->assertSame( 'pk_live_xxx', $received_data['public_live_key'] );
		$this->assertSame( 'pk_test_xxx', $received_data['public_test_key'] );
	}
}
