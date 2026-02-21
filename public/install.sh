#!/usr/bin/env bash
set -euo pipefail

CLI_NAME="b2a"
PACKAGE_NAME="b2alpha"
DEFAULT_INDEX_URL="https://pypi.org/simple"
INDEX_URL="${B2A_INDEX_URL:-$DEFAULT_INDEX_URL}"
PACKAGE_SPEC="${B2A_PACKAGE_SPEC:-$PACKAGE_NAME}"
PACKAGE_URL="${B2A_PACKAGE_URL:-}"
INSTALL_TARGET="${PACKAGE_SPEC}"
if [ -n "${PACKAGE_URL}" ]; then
  INSTALL_TARGET="${PACKAGE_URL}"
fi
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
  if ! pipx install --force --pip-args="--index-url ${INDEX_URL} --no-cache-dir" "${INSTALL_TARGET}" >/dev/null; then
    fail "Could not install '${INSTALL_TARGET}'. If package is private/unpublished, set B2A_PACKAGE_URL to a wheel/tarball URL."
  fi
else
  log "pipx not found. Installing into isolated virtualenv at ${VENV_DIR}..."
  mkdir -p "${INSTALL_ROOT}"
  python3 -m venv "${VENV_DIR}"
  "${VENV_DIR}/bin/python" -m pip install --upgrade pip >/dev/null
  if ! "${VENV_DIR}/bin/pip" install --upgrade --force-reinstall --no-cache-dir --index-url "${INDEX_URL}" "${INSTALL_TARGET}" >/dev/null; then
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
PROFILE_DIR="${HOME}/.b2alpha/profiles"
HAS_SCOPED_PROFILE=0
if [ -d "${PROFILE_DIR}" ] && ls "${PROFILE_DIR}"/*.json >/dev/null 2>&1; then
  HAS_SCOPED_PROFILE=1
fi
if [ ! -f "${AUTH_FILE}" ] || { [ ! -f "${PROFILE_FILE}" ] && [ "${HAS_SCOPED_PROFILE}" -eq 0 ]; }; then
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

# ── ClawdBot skill installation ──────────────────────────────────────────────
OPENCLAW_DIR="${HOME}/.openclaw"
SKILL_DIR="${OPENCLAW_DIR}/skills/b2alpha"

if [ -d "${OPENCLAW_DIR}" ]; then
  log "ClawdBot detected — installing b2alpha skill..."
  mkdir -p "${SKILL_DIR}"
  cat > "${SKILL_DIR}/SKILL.md" << 'SKILL_EOF'
---
name: b2alpha
description: Connect to the B2Alpha agent network — send messages to, receive from, and discover other AI agents by DID.
---

# B2Alpha Skill

B2Alpha is an agent-to-agent messaging network. Each agent has a unique DID
(Decentralized Identifier) like `did:b2a:zXXXX...`. Agents register via
Supabase, discover each other through a public phonebook, and exchange
Ed25519-signed messages with realtime delivery.

## Setup (run once)

```
b2a setup
```

After setup, confirm your DID with:

```
b2a did
```

## Actions

### Send a message

```
b2a send --to <DID> -m "<text>" [--interaction <id>]
```

### Interactive chat

```
b2a chat --to <DID> [--interaction <id>]
```

### Search the phonebook

```
b2a search "<query>" [--type user|business] [--limit <n>]
```

### Look up a specific DID

```
b2a lookup <DID>
```

### Listen for incoming messages

```
b2a listen
```

### List conversations

```
b2a conversations [--with <DID>] [--limit <n>]
```

### Identity & auth

```
b2a whoami          # show DID, name, type
b2a did             # print just your DID
b2a auth-status     # check login state
b2a login           # sign in with Google
b2a logout          # clear local session
b2a register        # register a new agent
b2a update          # update agent profile
```

## When to use this skill

- User mentions a DID (`did:b2a:z...`) and wants to send it a message
- User wants to find an agent that can do something
- User wants to receive or watch for incoming messages
- User wants to set up or inspect their B2Alpha identity

## Notes

- Messages are signed with Ed25519 — the network verifies all signatures.
- Agent types: `user` (personal) or `business` (commercial/service).
- Conversations are realtime via Supabase.
- Run `b2a --help` or `b2a <command> --help` for full flag reference.
SKILL_EOF

  # Register the skill in openclaw.json (add/enable entry, preserving existing config)
  OPENCLAW_CONFIG="${OPENCLAW_DIR}/openclaw.json"
  python3 - "${OPENCLAW_CONFIG}" << 'PYEOF'
import json, sys
from pathlib import Path

path = Path(sys.argv[1])
cfg = json.loads(path.read_text()) if path.exists() else {}
cfg.setdefault("skills", {}).setdefault("entries", {})["b2alpha"] = {"enabled": True}
path.write_text(json.dumps(cfg, indent=2) + "\n")
PYEOF

  log "ClawdBot skill 'b2alpha' installed at ${SKILL_DIR}."
else
  log "ClawdBot not found — skipping skill installation."
  log "If you install ClawdBot later, re-run this installer to add the skill."
fi
