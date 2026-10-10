#!/usr/bin/env bash
#
# Build an installable ZIP of the plugin for a staging site.
#
#   bash bin/build-zip.sh
#
# The ZIP has the layout of the WordPress.org / GitHub Release ZIP: the files
# Git tracks, filtered through .distignore with rsync (as the deploy workflow
# does), inside a top-level paidy-wc/ folder, so "Upload Plugin" can replace an
# installed copy. The version is not bumped.
#
# Unlike the release, the files are read from the working tree, so changes that
# are not committed yet can be tried on staging. The ZIP is written to
# dist/paidy-wc-<short HEAD>.zip, or to dist/paidy-wc-<short HEAD>-dirty.zip
# when the shipped files differ from HEAD (the differing files are listed).
# Files Git does not track are never included; the ones that would ship are
# listed so they can be `git add`ed.

set -euo pipefail

SLUG=paidy-wc
ROOT=$(cd "$(dirname "$0")/.." && pwd)
cd "${ROOT}"

for cmd in git rsync zip unzip; do
	if ! command -v "${cmd}" >/dev/null 2>&1; then
		echo "${cmd} is required." >&2
		exit 1
	fi
done

WORK=$(mktemp -d "${TMPDIR:-/tmp}/${SLUG}-zip.XXXXXX")
trap 'rm -rf "${WORK}"' EXIT
PKG="${WORK}/zip/${SLUG}"
HEAD_DIST="${WORK}/head-dist"

# Copy the NUL-separated paths on stdin (relative to the repository root) into
# $1, then apply .distignore into $2 the way the deploy workflow does.
stage() {
	mkdir -p "$1" "$2"
	rsync -a --from0 --files-from=- ./ "$1/"
	rsync -a --exclude-from=.distignore "$1/" "$2/"
}

# Tracked paths that still exist in the working tree. A deleted but not yet
# committed file makes rsync exit 23, and openrsync (macOS) then skips the
# remaining files, so leave it out.
tracked_files() {
	git ls-files -z | while IFS= read -r -d '' path; do
		if [ -e "${path}" ] || [ -L "${path}" ]; then
			printf '%s\0' "${path}"
		fi
	done
}

echo "Building the ${SLUG} ZIP from the working tree..."
tracked_files | stage "${WORK}/tree" "${PKG}"

# What HEAD would ship, to tell which changed paths end up in the ZIP.
# git archive also drops export-ignore paths; those are all in .distignore, and
# a shipped one would only make the ZIP be labelled -dirty.
mkdir -p "${WORK}/head"
git archive --format=tar HEAD | tar -x -C "${WORK}/head"
rsync -a --exclude-from=.distignore "${WORK}/head/" "${HEAD_DIST}/"

dirty=''
while IFS= read -r -d '' path; do
	if [ -e "${HEAD_DIST}/${path}" ] || [ -e "${PKG}/${path}" ]; then
		dirty="${dirty}  ${path}"$'\n'
	fi
done < <(git diff -z --no-renames --name-only HEAD --)

untracked=''
if [ -n "$(git ls-files --others --exclude-standard)" ]; then
	git ls-files -z --others --exclude-standard | stage "${WORK}/untracked" "${WORK}/untracked-dist"
	untracked=$(cd "${WORK}/untracked-dist" && find . -type f | sed 's|^\./|  |' | sort)
fi

rev=$(git rev-parse --short HEAD)
ZIP="${ROOT}/dist/${SLUG}-${rev}${dirty:+-dirty}.zip"
mkdir -p "${ROOT}/dist"
# zip -r adds to an existing archive and keeps entries that are gone now.
rm -f "${ZIP}"
(cd "${WORK}/zip" && zip -qr -X "${ZIP}" "${SLUG}")

unzip -tq "${ZIP}" >/dev/null
listing=$(unzip -Z1 "${ZIP}")
if ! grep -qx "${SLUG}/${SLUG}.php" <<<"${listing}"; then
	echo "${SLUG}/${SLUG}.php is missing from ${ZIP}." >&2
	exit 1
fi
# The anchored .distignore entries (/bin, /tests, /vendor, ...) must not ship.
leaked=$(awk -v slug="${SLUG}" '
	NR == FNR { sub(/[[:space:]]+$/, ""); if ($0 ~ /^\//) { excluded[slug $0] = 1 } next }
	{ for (p in excluded) if ($0 == p || index($0, p "/") == 1) { print "  " $0; break } }
' .distignore - <<<"${listing}")
if [ -n "${leaked}" ]; then
	echo "${ZIP} contains files .distignore excludes:" >&2
	echo "${leaked}" >&2
	exit 1
fi

version=$(sed -n '/Version:/{s/^[[:space:]*]*Version:[[:space:]]*//p;q;}' "${PKG}/${SLUG}.php")
files=$(grep -vc '/$' <<<"${listing}")
echo "Built dist/${ZIP##*/} (version ${version}, ${files} files, $(du -h "${ZIP}" | cut -f1 | tr -d '[:space:]'))."

if [ -n "${dirty}" ]; then
	echo
	echo "It contains changes not committed to HEAD (${rev}):"
	printf '%s' "${dirty}"
fi
if [ -n "${untracked}" ]; then
	echo
	echo "Not included because Git does not track them (git add them to ship them):"
	echo "${untracked}"
fi
echo
echo "Upload it from Plugins > Add New Plugin > Upload Plugin and choose to replace the installed ${SLUG}."
