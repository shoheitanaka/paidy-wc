#!/usr/bin/env bash
#
# Start / stop the throw-away MySQL container used by the PHPUnit suite on a
# developer machine. CI uses a GitHub Actions service container instead.
#
#   bash bin/test-db.sh start              # start (idempotent) and wait until ready
#   bash bin/test-db.sh install [wp-ver]   # start + install WordPress/WooCommerce/test library
#                                          # (what `composer test:install` runs; WC_VERSION is passed through)
#   bash bin/test-db.sh stop               # stop and remove the container
#   bash bin/test-db.sh status
#
# The connection settings live in this file only (PAIDY_WC_TEST_DB_PORT / _NAME /
# _PASS / _CONTAINER / _IMAGE). `install` hands the same values to
# bin/install-wp-tests.sh, so overriding a variable keeps the container and the
# generated wp-tests-config.php in sync, and `start` refuses to reuse a container
# that publishes a different port than the one configured.
#
# The container listens on 127.0.0.1:10154 - the "+4" spare port of this
# repository's wp-env slot (slot 15, see ~/.claude/skills/dev-env/ports.json) -
# so it never collides with Herd, another repository's test DB on 3306, or the
# wp-env containers of this repository.

set -euo pipefail

CONTAINER_NAME=${PAIDY_WC_TEST_DB_CONTAINER:-paidy-wc-mysql-test}
DB_PORT=${PAIDY_WC_TEST_DB_PORT:-10154}
DB_NAME=${PAIDY_WC_TEST_DB_NAME:-wordpress_test}
DB_PASS=${PAIDY_WC_TEST_DB_PASS:-root}
MYSQL_IMAGE=${PAIDY_WC_TEST_DB_IMAGE:-mysql:8.0}

# Host port the existing container (running or stopped) publishes for MySQL; empty if none.
container_port() {
	docker inspect --format '{{ with index .HostConfig.PortBindings "3306/tcp" }}{{ (index . 0).HostPort }}{{ end }}' "${CONTAINER_NAME}" 2>/dev/null || true
}

start() {
	if docker ps -a --format '{{.Names}}' | grep -qx "${CONTAINER_NAME}"; then
		local existing_port
		existing_port=$(container_port)
		if [ -n "${existing_port}" ] && [ "${existing_port}" != "${DB_PORT}" ]; then
			echo "MySQL container '${CONTAINER_NAME}' exists but publishes port ${existing_port}, not the configured ${DB_PORT}." >&2
			echo "Run 'composer test:db:stop' and start again, or set PAIDY_WC_TEST_DB_PORT=${existing_port}." >&2
			return 1
		fi
	fi

	if docker ps --format '{{.Names}}' | grep -qx "${CONTAINER_NAME}"; then
		echo "MySQL container '${CONTAINER_NAME}' is already running on 127.0.0.1:${DB_PORT}."
	elif docker ps -a --format '{{.Names}}' | grep -qx "${CONTAINER_NAME}"; then
		# Left over from a Docker restart or `docker stop`: resume it instead of recreating.
		echo "Starting the existing (stopped) MySQL container '${CONTAINER_NAME}'..."
		docker start "${CONTAINER_NAME}" >/dev/null
	else
		echo "Creating MySQL container '${CONTAINER_NAME}' on 127.0.0.1:${DB_PORT}..."
		docker run -d \
			--name "${CONTAINER_NAME}" \
			-e MYSQL_ROOT_PASSWORD="${DB_PASS}" \
			-e MYSQL_DATABASE="${DB_NAME}" \
			-p "127.0.0.1:${DB_PORT}:3306" \
			"${MYSQL_IMAGE}" \
			--default-authentication-plugin=mysql_native_password >/dev/null
	fi

	echo "Waiting for MySQL to accept connections..."
	for i in $(seq 1 30); do
		if docker exec "${CONTAINER_NAME}" mysqladmin ping -uroot -p"${DB_PASS}" --silent >/dev/null 2>&1; then
			echo "MySQL is ready."
			return 0
		fi
		sleep 2
	done

	echo "MySQL did not become ready in time. Check: docker logs ${CONTAINER_NAME}" >&2
	return 1
}

# Start the container and install WordPress, WooCommerce and the test library
# against it, passing the very same connection settings to the installer.
install() {
	local wp_version=${1:-latest}

	start
	echo
	echo "Installing WordPress (${wp_version}), WooCommerce (${WC_VERSION:-latest}) and the test library for '${DB_NAME}' on 127.0.0.1:${DB_PORT}..."
	bash "$(dirname "$0")/install-wp-tests.sh" "${DB_NAME}" root "${DB_PASS}" "127.0.0.1:${DB_PORT}" "${wp_version}" true
}

stop() {
	docker stop "${CONTAINER_NAME}" >/dev/null 2>&1 || true
	docker rm "${CONTAINER_NAME}" >/dev/null 2>&1 || true
	echo "MySQL container '${CONTAINER_NAME}' removed."
}

status() {
	if docker ps --format '{{.Names}}\t{{.Ports}}' | grep "^${CONTAINER_NAME}"; then
		return 0
	fi
	echo "MySQL container '${CONTAINER_NAME}' is not running."
	return 1
}

case "${1:-}" in
	start)
		start
		echo
		echo "Next: composer test:install   (first time, or after the temp dir was purged)"
		echo "Then: composer test"
		;;
	install) install "${2:-latest}" ;;
	stop) stop ;;
	status) status ;;
	*)
		echo "usage: $0 start|install [wp-version]|stop|status" >&2
		exit 64
		;;
esac
