#!/usr/bin/env bash
set -euo pipefail

CLI_NAME="b2a"
PACKAGE_NAME="b2alpha"
DEFAULT_INDEX_URL="https://pypi.org/simple"
INDEX_URL="${B2A_INDEX_URL:-$DEFAULT_INDEX_URL}"
DEFAULT_PACKAGE_URL="https://b2alpha-landing.vercel.app/downloads/b2alpha-0.1.0-py3-none-any.whl"
PACKAGE_SPEC="${B2A_PACKAGE_SPEC:-$PACKAGE_NAME}"
PACKAGE_URL="${B2A_PACKAGE_URL:-$DEFAULT_PACKAGE_URL}"
INSTALL_TARGET="${PACKAGE_URL:-$PACKAGE_SPEC}"
INSTALL_ROOT="${B2A_INSTALL_ROOT:-$HOME/.b2alpha}"
VENV_DIR="${B2A_VENV_DIR:-$INSTALL_ROOT/venv}"
BIN_DIR="${B2A_BIN_DIR:-$HOME/.local/bin}"

log() {
  printf '[b2alpha-install] %s\n' "$1"
}

fail() {
  printf '[b2alpha-install] ERROR: %s\n' "$1" >&2
  exit 1
}

if ! command -v python3 >/dev/null 2>&1; then
  fail "python3 is required. Install Python 3.11+ and retry."
fi

if command -v pipx >/dev/null 2>&1; then
  log "Installing via pipx..."
  if ! pipx install --force --pip-args="--index-url ${INDEX_URL}" "${INSTALL_TARGET}" >/dev/null; then
    fail "Could not install '${INSTALL_TARGET}'. If package is private/unpublished, set B2A_PACKAGE_URL to a wheel/tarball URL."
  fi
else
  log "pipx not found. Installing into isolated virtualenv at ${VENV_DIR}..."
  mkdir -p "${INSTALL_ROOT}"
  python3 -m venv "${VENV_DIR}"
  "${VENV_DIR}/bin/python" -m pip install --upgrade pip >/dev/null
  if ! "${VENV_DIR}/bin/pip" install --upgrade --index-url "${INDEX_URL}" "${INSTALL_TARGET}" >/dev/null; then
    fail "Could not install '${INSTALL_TARGET}'. If package is private/unpublished, set B2A_PACKAGE_URL to a wheel/tarball URL."
  fi
  mkdir -p "${BIN_DIR}"
  ln -sf "${VENV_DIR}/bin/${CLI_NAME}" "${BIN_DIR}/${CLI_NAME}"
fi

if ! command -v "${CLI_NAME}" >/dev/null 2>&1; then
  if [ -d "${BIN_DIR}" ]; then
    export PATH="${BIN_DIR}:${PATH}"
  fi
  PY_BIN_DIR="$(python3 -m site --user-base)/bin"
  if [ -d "${PY_BIN_DIR}" ]; then
    export PATH="${PY_BIN_DIR}:${PATH}"
  fi
fi

if ! command -v "${CLI_NAME}" >/dev/null 2>&1; then
  fail "CLI installed but not on PATH. Add ${BIN_DIR} to PATH and re-open terminal."
fi

log "Installed successfully."
"${CLI_NAME}" --version
log "Next: run '${CLI_NAME} setup' for first-time Google login + registration."

AUTH_FILE="${HOME}/.b2alpha/auth.json"
PROFILE_FILE="${HOME}/.b2alpha/profile.json"
if [ ! -f "${AUTH_FILE}" ] || [ ! -f "${PROFILE_FILE}" ]; then
  if [ -e /dev/tty ]; then
    log "Starting first-time setup wizard..."
    if "${CLI_NAME}" setup </dev/tty; then
      log "Setup finished."
    else
      log "Setup did not complete. Run '${CLI_NAME} setup' anytime."
    fi
  else
    log "Interactive terminal unavailable. Run '${CLI_NAME} setup' to finish onboarding."
  fi
fi
