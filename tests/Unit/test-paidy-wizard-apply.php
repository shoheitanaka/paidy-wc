<?php
/**
 * Tests for the application POST the onboarding wizard sends to paidy.artws.info.
 *
 * The receiver accepts the key-delivery callback when it carries the one-time
 * state token issued here, so the POST must send a token that verifies, and a
 * POST that fails must discard it again. paidy-wc also reports its own version
 * as plugin_version (Japanized for WooCommerce sends JP4WC_VERSION, which is
 * never defined in this plugin). The HTTP call is answered through
 * pre_http_request.
 *
 * @package paidy-wc
 */

/**
 * WC_Paidy_Wizard_Apply_Test
 */
class WC_Paidy_Wizard_Apply_Test extends WP_UnitTestCase {

	/**
	 * Wizard instance built without running the constructor (no hooks).
	 *
	 * @var WC_Paidy_Admin_Wizard
	 */
	private $wizard;

	/**
	 * Arguments of every request sent to the intermediary.
	 *
	 * @var array
	 */
	private $requests = array();

	/**
	 * Response returned for the intermediary request.
	 *
	 * @var array|WP_Error
	 */
	private $response;

	/**
	 * Set up test environment before each test.
	 */
	public function setUp(): void {
		parent::setUp();

		if ( ! class_exists( 'WC_Paidy_Admin_Wizard' ) ) {
			require_once dirname( __DIR__, 2 ) . '/includes/gateways/paidy/class-wc-paidy-admin-wizard.php';
		}
		$this->assertTrue( class_exists( 'WC_Paidy_Admin_Wizard' ) );
		$this->assertTrue( class_exists( 'WC_Paidy_Apply_Receiver' ) );

		$this->wizard = ( new ReflectionClass( 'WC_Paidy_Admin_Wizard' ) )->newInstanceWithoutConstructor();
		add_filter( 'pre_http_request', array( $this, 'mock_intermediary' ), 10, 3 );
	}

	/**
	 * Tear down test environment after each test.
	 */
	public function tearDown(): void {
		remove_filter( 'pre_http_request', array( $this, 'mock_intermediary' ), 10 );
		delete_option( 'paidy_application_id' );

		global $wpdb;
		// phpcs:ignore WordPress.DB.DirectDatabaseQuery.DirectQuery, WordPress.DB.DirectDatabaseQuery.NoCaching
		$wpdb->query( $wpdb->prepare( "DELETE FROM {$wpdb->options} WHERE option_name LIKE %s", $wpdb->esc_like( WC_Paidy_Apply_Receiver::STATE_OPTION_PREFIX ) . '%' ) );
		wp_cache_flush();

		parent::tearDown();
	}

	/**
	 * Answer the request to the intermediary and record its arguments.
	 *
	 * @param false|array|WP_Error $pre  Short-circuit value.
	 * @param array                $args Request arguments.
	 * @param string               $url  Request URL.
	 * @return false|array|WP_Error
	 */
	public function mock_intermediary( $pre, $args, $url ) {
		if ( 0 !== strpos( $url, 'https://paidy.artws.info/api/applications/' ) ) {
			return $pre;
		}
		$this->requests[] = $args;
		return $this->response;
	}

	/**
	 * Build an HTTP response array.
	 *
	 * @param int    $code HTTP status code.
	 * @param string $body Response body.
	 * @return array
	 */
	private function http_response( $code, $body = '' ) {
		return array(
			'headers'  => array(),
			'body'     => $body,
			'response' => array(
				'code'    => $code,
				'message' => '',
			),
			'cookies'  => array(),
			'filename' => null,
		);
	}

	/**
	 * Wizard form values as saved in woocommerce_paidy_on_boarding_settings.
	 *
	 * @return array
	 */
	private function application() {
		return array(
			'annualGrossValue'                => 'less-than-10-million-yen',
			'averagePurchaseAmount'           => 'less-than-50000-yen',
			'siteName'                        => 'Example',
			'storeUrl'                        => 'https://example.com',
			'storeName'                       => 'Example Store',
			'registEmail'                     => 'owner@example.com',
			'contactPhone'                    => '0300000000',
			'representativeLastName'          => 'Yamada',
			'representativeFirstName'         => 'Taro',
			'representativeLastNameKana'      => 'ヤマダ',
			'representativeFirstNameKana'     => 'タロウ',
			'representativeDateOfBirth'       => '1980-01-01',
			'securitySurvey01RadioControl'    => 'yes',
			'securitySurvey01TextControl'     => '',
			'securitySurvey11CheckControl'    => true,
			'securitySurvey12CheckControl'    => true,
			'securitySurvey13CheckControl'    => true,
			'securitySurvey14CheckControl'    => true,
			'securitySurvey10TextAreaControl' => '',
			'securitySurvey08RadioControl'    => 'yes',
			'securitySurvey09RadioControl'    => 'yes',
		);
	}

	/**
	 * A successful POST carries a stored state token, the site hash and WC_PAIDY_VERSION.
	 */
	public function test_application_sends_a_stored_state_token_and_the_plugin_version() {
		$this->response = $this->http_response( 201, wp_json_encode( array( 'application_id' => 'WC000000571' ) ) );

		$this->assertTrue( $this->wizard->send_apply_data_to_wcartws( $this->application(), 'aB3dE6gH9kL2mN5p' ) );

		$this->assertCount( 1, $this->requests );
		$body = $this->requests[0]['body'];
		$this->assertMatchesRegularExpression( '/^[A-Za-z0-9]{32}$/', $body['state'] );
		$this->assertTrue( WC_Paidy_Apply_Receiver::verify_state_token( $body['state'] ) );
		$this->assertSame( 'aB3dE6gH9kL2mN5p', $body['site_hash'] );
		$this->assertSame( WC_PAIDY_VERSION, $body['plugin_version'] );
		$this->assertSame( 'WC000000571', get_option( 'paidy_application_id' ) );
	}

	/**
	 * A POST that never reached the intermediary discards its state token.
	 */
	public function test_transport_error_discards_the_state_token() {
		$this->response = new WP_Error( 'http_request_failed', 'cURL error 28: Operation timed out' );

		$this->assertFalse( $this->wizard->send_apply_data_to_wcartws( $this->application(), 'aB3dE6gH9kL2mN5p' ) );

		$this->assertCount( 1, $this->requests );
		$this->assertFalse( WC_Paidy_Apply_Receiver::verify_state_token( $this->requests[0]['body']['state'] ) );
	}

	/**
	 * A POST the intermediary rejected discards its state token and stores no application ID.
	 */
	public function test_http_error_discards_the_state_token() {
		$this->response = $this->http_response( 500, wp_json_encode( array( 'application_id' => 'WC000000571' ) ) );

		$this->assertFalse( $this->wizard->send_apply_data_to_wcartws( $this->application(), 'aB3dE6gH9kL2mN5p' ) );

		$this->assertCount( 1, $this->requests );
		$this->assertFalse( WC_Paidy_Apply_Receiver::verify_state_token( $this->requests[0]['body']['state'] ) );
		$this->assertFalse( get_option( 'paidy_application_id' ) );
	}
}
