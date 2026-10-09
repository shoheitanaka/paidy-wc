#!/usr/bin/env bash
#
# Install the WordPress core, the WordPress PHPUnit test library and WooCommerce
# into the temp directory used by tests/bootstrap.php.
#
# Based on the WP-CLI `wp scaffold plugin-tests` script, plus install_woocommerce().
#
#   bash bin/install-wp-tests.sh <db-name> <db-user> <db-pass> [db-host] [wp-version] [skip-database-creation]
#
# Environment:
#   WP_TESTS_DIR  where the test library goes      (default: $TMPDIR/wordpress-tests-lib)
#   WP_CORE_DIR   where WordPress core goes        (default: $TMPDIR/wordpress)
#   WC_VERSION    WooCommerce version to install   (default: latest; e.g. 10.6.2)
#
# Local use (Docker MySQL from bin/test-db.sh, database already created by the container):
#   composer test:db
#   composer test:install        # = bash bin/install-wp-tests.sh wordpress_test root root 127.0.0.1:10154 latest true

if [ $# -lt 3 ]; then
	echo "usage: $0 <db-name> <db-user> <db-pass> [db-host] [wp-version] [skip-database-creation]"
	exit 1
fi

DB_NAME=$1
DB_USER=$2
DB_PASS=$3
DB_HOST=${4-localhost}
WP_VERSION=${5-latest}
SKIP_DB_CREATE=${6-false}
WC_VERSION=${WC_VERSION-latest}

TMPDIR=${TMPDIR-/tmp}
TMPDIR=$(echo $TMPDIR | sed -e "s/\/$//")
WP_TESTS_DIR=${WP_TESTS_DIR-$TMPDIR/wordpress-tests-lib}
WP_CORE_DIR=${WP_CORE_DIR-$TMPDIR/wordpress}

download() {
    if [ `which curl` ]; then
        curl -s "$1" > "$2";
    elif [ `which wget` ]; then
        wget -nv -O "$2" "$1"
    else
        echo "Error: Neither curl nor wget is installed."
        exit 1
    fi
}

# Check if svn is installed
check_svn_installed() {
    if ! command -v svn > /dev/null; then
        echo "Error: svn is not installed. Please install svn and try again."
        exit 1
    fi
}

if [[ $WP_VERSION =~ ^[0-9]+\.[0-9]+\-(beta|RC)[0-9]+$ ]]; then
	WP_BRANCH=${WP_VERSION%\-*}
	WP_TESTS_TAG="branches/$WP_BRANCH"

elif [[ $WP_VERSION =~ ^[0-9]+\.[0-9]+$ ]]; then
	WP_TESTS_TAG="branches/$WP_VERSION"
elif [[ $WP_VERSION =~ [0-9]+\.[0-9]+\.[0-9]+ ]]; then
	if [[ $WP_VERSION =~ [0-9]+\.[0-9]+\.[0] ]]; then
		# version x.x.0 means the first release of the major version, so strip off the .0 and download version x.x
		WP_TESTS_TAG="tags/${WP_VERSION%??}"
	else
		WP_TESTS_TAG="tags/$WP_VERSION"
	fi
elif [[ $WP_VERSION == 'nightly' || $WP_VERSION == 'trunk' ]]; then
	WP_TESTS_TAG="trunk"
else
	# http serves a single offer, whereas https serves multiple. we only want one
	download http://api.wordpress.org/core/version-check/1.7/ /tmp/wp-latest.json
	grep '[0-9]+\.[0-9]+(\.[0-9]+)?' /tmp/wp-latest.json
	LATEST_VERSION=$(grep -o '"version":"[^"]*' /tmp/wp-latest.json | sed 's/"version":"//')
	if [[ -z "$LATEST_VERSION" ]]; then
		echo "Latest WordPress version could not be found"
		exit 1
	fi
	WP_TESTS_TAG="tags/$LATEST_VERSION"
fi
# -e only: with -x every command would be echoed, including the sed/mysqladmin
# lines that carry $DB_PASS, so the database password would end up in CI logs.
set -e

log() {
	echo "[install-wp-tests] $*"
}

install_wp() {

	# Check for a real install, not just the directory: a download or extraction
	# that failed half-way must be completed by simply re-running the script.
	if [ -f "$WP_CORE_DIR/wp-includes/version.php" ]; then
		log "WordPress already installed in $WP_CORE_DIR (remove the directory to reinstall)"
		return;
	fi

	log "Installing WordPress ($WP_VERSION) into $WP_CORE_DIR"
	mkdir -p $WP_CORE_DIR

	if [[ $WP_VERSION == 'nightly' || $WP_VERSION == 'trunk' ]]; then
		mkdir -p $TMPDIR/wordpress-trunk
		rm -rf $TMPDIR/wordpress-trunk/*
        check_svn_installed
		svn export --quiet https://core.svn.wordpress.org/trunk $TMPDIR/wordpress-trunk/wordpress
		mv $TMPDIR/wordpress-trunk/wordpress/* $WP_CORE_DIR
	else
		if [ $WP_VERSION == 'latest' ]; then
			local ARCHIVE_NAME='latest'
		elif [[ $WP_VERSION =~ [0-9]+\.[0-9]+ ]]; then
			# https serves multiple offers, whereas http serves single.
			download https://api.wordpress.org/core/version-check/1.7/ $TMPDIR/wp-latest.json
			if [[ $WP_VERSION =~ [0-9]+\.[0-9]+\.[0] ]]; then
				# version x.x.0 means the first release of the major version, so strip off the .0 and download version x.x
				LATEST_VERSION=${WP_VERSION%??}
			else
				# otherwise, scan the releases and get the most up to date minor version of the major release
				local VERSION_ESCAPED=`echo $WP_VERSION | sed 's/\./\\\\./g'`
				LATEST_VERSION=$(grep -o '"version":"'$VERSION_ESCAPED'[^"]*' $TMPDIR/wp-latest.json | sed 's/"version":"//' | head -1)
			fi
			if [[ -z "$LATEST_VERSION" ]]; then
				local ARCHIVE_NAME="wordpress-$WP_VERSION"
			else
				local ARCHIVE_NAME="wordpress-$LATEST_VERSION"
			fi
		else
			local ARCHIVE_NAME="wordpress-$WP_VERSION"
		fi
		download https://wordpress.org/${ARCHIVE_NAME}.tar.gz  $TMPDIR/wordpress.tar.gz
		tar --strip-components=1 -zxmf $TMPDIR/wordpress.tar.gz -C $WP_CORE_DIR
	fi

	download https://raw.githubusercontent.com/markoheijnen/wp-mysqli/master/db.php $WP_CORE_DIR/wp-content/db.php
}

install_woocommerce() {
	local WC_DIR=$WP_CORE_DIR/wp-content/plugins/woocommerce

	if [ -f "$WC_DIR/woocommerce.php" ]; then
		log "WooCommerce already installed in $WC_DIR (set WC_VERSION and remove the directory to change it)"
		return;
	fi

	if [ -d "$WC_DIR" ]; then
		# A previous extraction was interrupted. Without this, unzip would stop to
		# ask about overwriting files and abort when there is no terminal.
		log "Removing incomplete WooCommerce install in $WC_DIR"
		rm -rf "$WC_DIR"
	fi

	log "Installing WooCommerce ($WC_VERSION) into $WC_DIR"

	# woocommerce.zip (no version) is served directly with the current stable
	# release; woocommerce.latest-stable.zip would answer with a 302 instead.
	if [ "$WC_VERSION" = 'latest' ]; then
		local WC_URL="https://downloads.wordpress.org/plugin/woocommerce.zip"
	else
		local WC_URL="https://downloads.wordpress.org/plugin/woocommerce.${WC_VERSION}.zip"
	fi

	mkdir -p $WP_CORE_DIR/wp-content/plugins
	# Follow redirects (-L) and fail on HTTP errors (-f) so a non-zip body is
	# never saved; verify the archive before extracting.
	if [ `which curl` ]; then
		curl -fsSL "$WC_URL" -o $TMPDIR/woocommerce.zip
	else
		wget -nv --max-redirect=5 -O $TMPDIR/woocommerce.zip "$WC_URL"
	fi
	unzip -tq $TMPDIR/woocommerce.zip > /dev/null
	unzip -oq $TMPDIR/woocommerce.zip -d $WP_CORE_DIR/wp-content/plugins/
	rm -f $TMPDIR/woocommerce.zip
}

install_test_suite() {
	# portable in-place argument for both GNU sed and Mac OSX sed
	if [[ $(uname -s) == 'Darwin' ]]; then
		local ioption='-i.bak'
	else
		local ioption='-i'
	fi

	# Set up the test library unless a complete copy is already there. Checking
	# for functions.php (not the directory) lets a re-run finish an export that
	# was interrupted.
	if [ ! -f "$WP_TESTS_DIR/includes/functions.php" ]; then
		log "Installing the WordPress test library (${WP_TESTS_TAG}) into $WP_TESTS_DIR"
		mkdir -p $WP_TESTS_DIR
		rm -rf $WP_TESTS_DIR/{includes,data}
        check_svn_installed
		svn export --quiet --ignore-externals https://develop.svn.wordpress.org/${WP_TESTS_TAG}/tests/phpunit/includes/ $WP_TESTS_DIR/includes
		svn export --quiet --ignore-externals https://develop.svn.wordpress.org/${WP_TESTS_TAG}/tests/phpunit/data/ $WP_TESTS_DIR/data
	else
		log "WordPress test library already installed in $WP_TESTS_DIR"
	fi

	# Always (re)generate wp-tests-config.php so that re-running with different
	# database arguments (local Docker vs CI service) takes effect.
	log "Writing $WP_TESTS_DIR/wp-tests-config.php (DB $DB_NAME on $DB_HOST)"
	download https://develop.svn.wordpress.org/${WP_TESTS_TAG}/wp-tests-config-sample.php "$WP_TESTS_DIR"/wp-tests-config.php
	# remove all forward slashes in the end
	WP_CORE_DIR=$(echo $WP_CORE_DIR | sed "s:/\+$::")
	sed $ioption "s:dirname( __FILE__ ) . '/src/':'$WP_CORE_DIR/':" "$WP_TESTS_DIR"/wp-tests-config.php
	sed $ioption "s:__DIR__ . '/src/':'$WP_CORE_DIR/':" "$WP_TESTS_DIR"/wp-tests-config.php
	sed $ioption "s/youremptytestdbnamehere/$DB_NAME/" "$WP_TESTS_DIR"/wp-tests-config.php
	sed $ioption "s/yourusernamehere/$DB_USER/" "$WP_TESTS_DIR"/wp-tests-config.php
	sed $ioption "s/yourpasswordhere/$DB_PASS/" "$WP_TESTS_DIR"/wp-tests-config.php
	sed $ioption "s|localhost|${DB_HOST}|" "$WP_TESTS_DIR"/wp-tests-config.php
	rm -f "$WP_TESTS_DIR"/wp-tests-config.php.bak

}

recreate_db() {
	shopt -s nocasematch
	if [[ $1 =~ ^(y|yes)$ ]]
	then
		mysqladmin drop $DB_NAME -f --user="$DB_USER" --password="$DB_PASS"$EXTRA
		create_db
		echo "Recreated the database ($DB_NAME)."
	else
		echo "Leaving the existing database ($DB_NAME) in place."
	fi
	shopt -u nocasematch
}

create_db() {
	mysqladmin create $DB_NAME --user="$DB_USER" --password="$DB_PASS"$EXTRA
}

install_db() {

	if [ ${SKIP_DB_CREATE} = "true" ]; then
		log "Skipping database creation (expected to exist already, e.g. created by the MySQL container)"
		return 0
	fi

	# parse DB_HOST for port or socket references
	local PARTS=(${DB_HOST//\:/ })
	local DB_HOSTNAME=${PARTS[0]};
	local DB_SOCK_OR_PORT=${PARTS[1]};
	local EXTRA=""

	if ! [ -z $DB_HOSTNAME ] ; then
		if [ $(echo $DB_SOCK_OR_PORT | grep -e '^[0-9]\{1,\}$') ]; then
			EXTRA=" --host=$DB_HOSTNAME --port=$DB_SOCK_OR_PORT --protocol=tcp"
		elif ! [ -z $DB_SOCK_OR_PORT ] ; then
			EXTRA=" --socket=$DB_SOCK_OR_PORT"
		elif ! [ -z $DB_HOSTNAME ] ; then
			EXTRA=" --host=$DB_HOSTNAME --protocol=tcp"
		fi
	fi

	# create database
	if [ $(mysql --user="$DB_USER" --password="$DB_PASS"$EXTRA --execute='show databases;' | grep ^$DB_NAME$) ]
	then
		echo "Reinstalling will delete the existing test database ($DB_NAME)"
		read -p 'Are you sure you want to proceed? [y/N]: ' DELETE_EXISTING_DB
		recreate_db $DELETE_EXISTING_DB
	else
		create_db
	fi
}

install_wp
install_woocommerce
install_test_suite
install_db
log "Done. Run: vendor/bin/phpunit"
