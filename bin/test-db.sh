#!/usr/bin/env bash
#
# Start / stop the throw-away MySQL container used by the PHPUnit suite on a
# developer machine. CI uses a GitHub Actions service container instead.
#
#   bash bin/test-db.sh start   # start (idempotent) and wait until ready
#   bash bin/test-db.sh stop    # stop and remove the container
#   bash bin/test-db.sh status
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

start() {
	if docker ps --format '{{.Names}}' | grep -qx "${CONTAINER_NAME}"; then
		echo "MySQL container '${CONTAINER_NAME}' is already running on 127.0.0.1:${DB_PORT}."
	else
		docker rm -f "${CONTAINER_NAME}" >/dev/null 2>&1 || true
		echo "Starting MySQL container '${CONTAINER_NAME}' on 127.0.0.1:${DB_PORT}..."
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
			echo
			echo "Next: composer test:install   (first time, or after the temp dir was purged)"
			echo "Then: composer test"
			return 0
		fi
		sleep 2
	done

	echo "MySQL did not become ready in time. Check: docker logs ${CONTAINER_NAME}" >&2
	return 1
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
	start) start ;;
	stop) stop ;;
	status) status ;;
	*)
		echo "usage: $0 start|stop|status" >&2
		exit 64
		;;
esac
