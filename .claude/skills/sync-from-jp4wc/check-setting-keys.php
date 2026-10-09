<?php
/**
 * Check that every Paidy gateway setting key referenced in PHP code exists.
 *
 * The keys of WC_Gateway_Paidy::init_form_fields() in this repository are the
 * only settings the gateway has. Code taken from Japanized for WooCommerce can
 * reference a key that does not exist here: JP4WC chose the webhook signing key
 * with get_option( 'testmode' ), a setting the gateway never had, so sandbox
 * webhooks were verified with the live secret key. WC_Settings_API::get_option()
 * returns '' for an unknown key, so nothing fails at runtime and PHPStan cannot
 * see string keys. This script finds such references statically.
 *
 * Usage (from the repository root):
 *   php .claude/skills/sync-from-jp4wc/check-setting-keys.php [--list] [--gateway=<file>] [<file-or-dir> ...]
 *
 * Without paths it scans the plugin's own PHP files and tests. Pass JP4WC files
 * or directories to check them before copying. The settings are read from this
 * repository's gateway unless --gateway is given. --list prints every reference
 * found, not only the unknown ones, and the files without any.
 *
 * References recognised (the key must be a string literal; <option> is
 * 'woocommerce_paidy_settings' or 'woocommerce_' . $this->id . '_settings'):
 *   ->get_option( 'key' ), ->update_option( 'key', ... )   WC_Settings_API on the gateway
 *   ->get_setting( 'key' )                                 AbstractPaymentMethodType (blocks)
 *   $settings['key'], $this->paidy_settings['key']         a variable or property whose name ends
 *                                                          in "settings" or "options"
 *   $this->paidy_settings = array( 'key' => ... )          an array literal assigned to a variable or
 *                                                          property whose name ends in "settings"
 *   get_option( <option> )['key']
 *   update_option( <option>, array( 'key' => ... ) )       keys in the value argument (also add_option)
 * Names containing "on_boarding" (the separate on-boarding option) are skipped.
 *
 * Not checked: property reads such as $gateway->testmode (PHPStan reports them as
 * property.notFound, but only in plugin code whose type it knows - tests/ is not
 * analysed), keys read through other variable names or wp_parse_args() defaults,
 * and JS.
 *
 * Exit status: 0 = every key exists, 1 = unknown keys found, 2 = usage or parse error.
 *
 * @package paidy-wc
 */

if ( 'cli' !== PHP_SAPI ) {
	exit( 2 );
}

const PAIDY_SETTINGS_OPTION = 'woocommerce_paidy_settings';

/**
 * Print an error and exit with status 2.
 *
 * @param string $message Message.
 * @return never
 */
function paidy_fail( $message ) {
	fwrite( STDERR, 'check-setting-keys: ' . $message . PHP_EOL );
	exit( 2 );
}

/**
 * Tokenize a PHP file without whitespace and comments.
 *
 * @param string $file Path.
 * @return array<int, array{0: int|string, 1: string, 2: int}> Tokens as [id, text, line].
 */
function paidy_tokens( $file ) {
	$code = is_file( $file ) && is_readable( $file ) ? file_get_contents( $file ) : false;
	if ( false === $code ) {
		paidy_fail( "cannot read $file" );
	}
	$tokens = array();
	$line   = 1;
	foreach ( token_get_all( $code ) as $token ) {
		if ( is_array( $token ) ) {
			$line = $token[2];
			if ( in_array( $token[0], array( T_WHITESPACE, T_COMMENT, T_DOC_COMMENT ), true ) ) {
				continue;
			}
			$tokens[] = $token;
		} else {
			$tokens[] = array( $token, $token, $line );
		}
	}
	return $tokens;
}

/**
 * Return the value of a quoted literal made of letters, digits, "_" and "-".
 *
 * @param array $token Token.
 * @return string|null The identifier, or null when the token is not such a literal.
 */
function paidy_literal( $token ) {
	if ( T_CONSTANT_ENCAPSED_STRING !== $token[0] ) {
		return null;
	}
	$value = substr( $token[1], 1, -1 );
	return preg_match( '/^[A-Za-z0-9_-]+$/D', $value ) ? $value : null;
}

/**
 * Whether a token opens or closes a bracket pair.
 *
 * @param array $token Token.
 * @return int 1 for an opening bracket, -1 for a closing one, 0 otherwise.
 */
function paidy_bracket( $token ) {
	if ( in_array( $token[0], array( '(', '[', '{', T_ATTRIBUTE, T_CURLY_OPEN, T_DOLLAR_OPEN_CURLY_BRACES ), true ) ) {
		return 1;
	}
	return in_array( $token[0], array( ')', ']', '}' ), true ) ? -1 : 0;
}

/**
 * Collect the literal keys ('key' =>) inside a bracketed expression.
 *
 * @param array $tokens    Tokens.
 * @param int   $open      Index of the opening bracket.
 * @param int   $max_depth Deepest nesting level to collect (1 = direct children only).
 * @return array<int, array{0: string, 1: int}> Keys as [key, line].
 */
function paidy_array_keys( array $tokens, $open, $max_depth ) {
	$keys  = array();
	$depth = 0;
	$count = count( $tokens );
	for ( $i = $open; $i < $count; $i++ ) {
		$depth += paidy_bracket( $tokens[ $i ] );
		if ( 0 === $depth ) {
			break;
		}
		$key = paidy_literal( $tokens[ $i ] );
		if ( null !== $key && $depth <= $max_depth && isset( $tokens[ $i + 1 ] ) && T_DOUBLE_ARROW === $tokens[ $i + 1 ][0] ) {
			$keys[] = array( $key, $tokens[ $i ][2] );
		}
	}
	return $keys;
}

/**
 * Read the setting keys from init_form_fields() of the gateway.
 *
 * @param string $file Gateway class file.
 * @return string[] Keys.
 */
function paidy_setting_keys( $file ) {
	$tokens = paidy_tokens( $file );
	$count  = count( $tokens );
	for ( $i = 0; $i < $count - 1; $i++ ) {
		if ( T_FUNCTION === $tokens[ $i ][0] && 'init_form_fields' === $tokens[ $i + 1 ][1] ) {
			break;
		}
	}
	// Find "form_fields = array(" or "form_fields = [" inside the method.
	for ( $i += 2; $i < $count - 3; $i++ ) {
		if ( 'form_fields' === $tokens[ $i ][1] && '=' === $tokens[ $i + 1 ][0] ) {
			$open = T_ARRAY === $tokens[ $i + 2 ][0] ? $i + 3 : $i + 2;
			$keys = array_column( paidy_array_keys( $tokens, $open, 1 ), 0 );
			if ( in_array( 'enabled', $keys, true ) ) {
				return array_values( array_unique( $keys ) );
			}
			break;
		}
	}
	paidy_fail( "cannot read the form fields of init_form_fields() in $file" );
}

/**
 * Whether the tokens from an index spell the gateway settings option name.
 *
 * Accepts 'woocommerce_paidy_settings' and 'woocommerce_' . $this->id . '_settings'
 * (the form the wizard uses).
 *
 * @param array $tokens Tokens.
 * @param int   $k      Index of the first token of the name.
 * @return bool
 */
function paidy_is_settings_option( array $tokens, $k ) {
	if ( isset( $tokens[ $k ] ) && PAIDY_SETTINGS_OPTION === paidy_literal( $tokens[ $k ] ) ) {
		return true;
	}
	foreach ( array( 'woocommerce_', '.', '$this', '->', 'id', '.', '_settings' ) as $offset => $expected ) {
		if ( ! isset( $tokens[ $k + $offset ] ) ) {
			return false;
		}
		$token = $tokens[ $k + $offset ];
		if ( ( T_CONSTANT_ENCAPSED_STRING === $token[0] ? paidy_literal( $token ) : $token[1] ) !== $expected ) {
			return false;
		}
	}
	return true;
}

/**
 * Find gateway setting references in a file.
 *
 * @param string $file Path.
 * @return array<int, array{0: string, 1: int, 2: string}> References as [key, line, form].
 */
function paidy_setting_references( $file ) {
	$tokens = paidy_tokens( $file );
	$count  = count( $tokens );
	$refs   = array();
	$arrows = array( T_OBJECT_OPERATOR, T_NULLSAFE_OBJECT_OPERATOR );
	for ( $i = 0; $i < $count - 2; $i++ ) {
		$name = $tokens[ $i ][1];
		$prev = $i > 0 ? $tokens[ $i - 1 ][0] : null;

		// ->get_option( 'key' ), ->update_option( 'key', ... ), ->get_setting( 'key' ).
		if ( T_STRING === $tokens[ $i ][0] && in_array( $prev, $arrows, true )
			&& in_array( $name, array( 'get_option', 'update_option', 'get_setting' ), true )
			&& '(' === $tokens[ $i + 1 ][0] ) {
			$key = paidy_literal( $tokens[ $i + 2 ] );
			if ( null !== $key ) {
				$refs[] = array( $key, $tokens[ $i ][2], "->$name()" );
			}
			continue;
		}

		// $settings['key'] / $this->paidy_settings['key'], and
		// $this->paidy_settings = array( 'key' => ... ) as tests set it up.
		$is_variable = T_VARIABLE === $tokens[ $i ][0];
		$is_property = T_STRING === $tokens[ $i ][0] && in_array( $prev, $arrows, true );
		if ( ( $is_variable || $is_property ) && false === stripos( $name, 'on_boarding' ) ) {
			if ( '[' === $tokens[ $i + 1 ][0] && preg_match( '/(settings|options)$/iD', $name ) ) {
				$key = paidy_literal( $tokens[ $i + 2 ] );
				if ( null !== $key && isset( $tokens[ $i + 3 ] ) && ']' === $tokens[ $i + 3 ][0] ) {
					$refs[] = array( $key, $tokens[ $i ][2], ltrim( $name, '$' ) . '[]' );
				}
				continue;
			}
			if ( '=' === $tokens[ $i + 1 ][0] && preg_match( '/settings$/iD', $name ) ) {
				$open = null;
				if ( T_ARRAY === $tokens[ $i + 2 ][0] && isset( $tokens[ $i + 3 ] ) && '(' === $tokens[ $i + 3 ][0] ) {
					$open = $i + 3;
				} elseif ( '[' === $tokens[ $i + 2 ][0] ) {
					$open = $i + 2;
				}
				if ( null !== $open ) {
					foreach ( paidy_array_keys( $tokens, $open, 1 ) as $key ) {
						$refs[] = array( $key[0], $key[1], ltrim( $name, '$' ) . ' = array()' );
					}
				}
				continue;
			}
		}

		// get_option( <option> )['key'] and update_option( <option>, array( 'key' => ... ) ).
		$function = ltrim( $name, '\\' );
		if ( in_array( $tokens[ $i ][0], array( T_STRING, T_NAME_FULLY_QUALIFIED ), true )
			&& ! in_array( $prev, array_merge( $arrows, array( T_DOUBLE_COLON, T_FUNCTION ) ), true )
			&& in_array( $function, array( 'get_option', 'update_option', 'add_option' ), true )
			&& '(' === $tokens[ $i + 1 ][0] && paidy_is_settings_option( $tokens, $i + 2 ) ) {
			if ( 'get_option' === $function ) {
				// Skip to the closing parenthesis of the call.
				$depth = 0;
				for ( $j = $i + 1; $j < $count; $j++ ) {
					$depth += paidy_bracket( $tokens[ $j ] );
					if ( 0 === $depth ) {
						break;
					}
				}
				if ( isset( $tokens[ $j + 3 ] ) && '[' === $tokens[ $j + 1 ][0] && ']' === $tokens[ $j + 3 ][0] ) {
					$key = paidy_literal( $tokens[ $j + 2 ] );
					if ( null !== $key ) {
						$refs[] = array( $key, $tokens[ $i ][2], 'get_option()[]' );
					}
				}
			} else {
				foreach ( paidy_array_keys( $tokens, $i + 1, PHP_INT_MAX ) as $key ) {
					$refs[] = array( $key[0], $key[1], "$function() value" );
				}
			}
		}
	}
	return $refs;
}

/**
 * Expand files and directories into a sorted list of PHP files.
 *
 * Built assets (assets/), vendor/ and node_modules/ below a given directory are
 * skipped. A directory without any PHP file to check is an error, so a wrong
 * path cannot pass silently next to the other arguments.
 *
 * @param string[] $paths Paths.
 * @return string[] PHP files.
 */
function paidy_php_files( array $paths ) {
	$files = array();
	foreach ( $paths as $path ) {
		if ( is_file( $path ) ) {
			$files[] = $path;
			continue;
		}
		if ( ! is_dir( $path ) ) {
			paidy_fail( "no such file or directory: $path" );
		}
		$root     = rtrim( $path, '/' );
		$found    = 0;
		$iterator = new RecursiveIteratorIterator( new RecursiveDirectoryIterator( $path, FilesystemIterator::SKIP_DOTS ) );
		foreach ( $iterator as $entry ) {
			$file = $entry->getPathname();
			// Match below the given directory only: a checkout under ~/vendor/ is still scanned.
			if ( 'php' === $entry->getExtension() && ! preg_match( '#/(assets|vendor|node_modules)/#', substr( $file, strlen( $root ) ) ) ) {
				$files[] = $file;
				++$found;
			}
		}
		if ( 0 === $found ) {
			paidy_fail( "no PHP files to check in: $path" );
		}
	}
	sort( $files );
	return array_values( array_unique( $files ) );
}

$paidy_repo    = dirname( __DIR__, 3 );
$paidy_gateway = $paidy_repo . '/includes/gateways/paidy/class-wc-gateway-paidy.php';
$paidy_paths   = array();
$paidy_list    = false;
foreach ( array_slice( $argv, 1 ) as $paidy_arg ) {
	if ( '--list' === $paidy_arg ) {
		$paidy_list = true;
	} elseif ( 0 === strpos( $paidy_arg, '--gateway=' ) ) {
		$paidy_gateway = substr( $paidy_arg, strlen( '--gateway=' ) );
	} elseif ( '-h' === $paidy_arg || '--help' === $paidy_arg ) {
		fwrite( STDOUT, "Usage: php check-setting-keys.php [--list] [--gateway=<file>] [<file-or-dir> ...]\n" );
		exit( 0 );
	} else {
		$paidy_paths[] = $paidy_arg;
	}
}
if ( ! $paidy_paths ) {
	foreach ( array( 'paidy-wc.php', 'class-wc-paidy.php', 'uninstall.php', 'includes/gateways/paidy', 'tests' ) as $paidy_path ) {
		$paidy_paths[] = $paidy_repo . '/' . $paidy_path;
	}
}

if ( '' === $paidy_gateway ) {
	paidy_fail( '--gateway needs a file' );
}
$paidy_keys    = paidy_setting_keys( $paidy_gateway );
$paidy_files   = paidy_php_files( $paidy_paths );
$paidy_checked = 0;
$paidy_unknown = 0;
foreach ( $paidy_files as $paidy_file ) {
	$paidy_shown = 0 === strpos( $paidy_file, $paidy_repo . '/' ) ? substr( $paidy_file, strlen( $paidy_repo ) + 1 ) : $paidy_file;
	$paidy_refs  = paidy_setting_references( $paidy_file );
	if ( ! $paidy_refs && $paidy_list ) {
		fwrite( STDOUT, "$paidy_shown: no setting references\n" );
	}
	foreach ( $paidy_refs as $paidy_ref ) {
		++$paidy_checked;
		$paidy_known = in_array( $paidy_ref[0], $paidy_keys, true );
		if ( ! $paidy_known ) {
			++$paidy_unknown;
		}
		if ( ! $paidy_known || $paidy_list ) {
			fwrite( STDOUT, sprintf( "%s:%d: %s gateway setting '%s' (%s)\n", $paidy_shown, $paidy_ref[1], $paidy_known ? 'ok' : 'unknown', $paidy_ref[0], $paidy_ref[2] ) );
		}
	}
}

fwrite( STDOUT, sprintf( "Gateway settings (%d): %s\n", count( $paidy_keys ), implode( ', ', $paidy_keys ) ) );
fwrite( STDOUT, sprintf( "Checked %d references in %d files: %d unknown.\n", $paidy_checked, count( $paidy_files ), $paidy_unknown ) );
exit( $paidy_unknown ? 1 : 0 );
