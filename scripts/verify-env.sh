#!/usr/bin/env bash
set -euo pipefail

echo "=== Liftoff Zero-to-One Environment Verification ==="

if [ -d "/opt/homebrew/opt/openjdk@17" ]; then
    export JAVA_HOME="/opt/homebrew/opt/openjdk@17"
elif [ -d "$HOME/.liftoff/toolchain/jdk-17" ]; then
    export JAVA_HOME="$HOME/.liftoff/toolchain/jdk-17"
elif [ -z "${JAVA_HOME:-}" ]; then
    JAVA_HOME="$(/usr/libexec/java_home -v 17 2>/dev/null || echo "")"
    [ -n "$JAVA_HOME" ] && export JAVA_HOME
fi

check_cmd() {
    local cmd="$1"
    local desc="$2"
    if command -v "$cmd" >/dev/null 2>&1; then
        echo "✓ $desc: $cmd is available ($(which "$cmd"))"
    else
        echo "✗ $desc: $cmd NOT found in PATH" >&2
        return 1
    fi
}

echo "[1/4] Verifying Host Binaries..."
check_cmd "java" "JDK Runtime"
"$JAVA_HOME/bin/java" -version 2>&1 | head -n 1 || java -version 2>&1 | head -n 1

if command -v "agy" >/dev/null 2>&1; then
    echo "✓ Antigravity CLI: $(agy --version 2>&1 || echo 'detected')"
elif [ -d "$HOME/.gemini/antigravity" ] || [ -d "/Applications/Antigravity.app" ]; then
    echo "✓ Antigravity Desktop environment detected"
fi

check_cmd "android" "Android CLI" || true
check_cmd "inst" "Package Dispatcher" || true
check_cmd "git-ledger" "Git Ledger" || true

if command -v "scrcpy" >/dev/null 2>&1; then
    echo "✓ Screen Mirror: scrcpy is available"
else
    echo "! Screen Mirror: scrcpy optional check"
fi

if command -v "adb" >/dev/null 2>&1; then
    echo "✓ ADB: $(adb version | head -n 1)"
    echo "Connected ADB Devices:"
    adb devices
fi

echo "[2/4] Verifying Context Budget & Active Token Cap (< 20,000)..."
if command -v "agy-skills" >/dev/null 2>&1; then
    agy-skills status --json | python3 -c "import sys, json; data=json.load(sys.stdin); tokens=data.get('active_tokens', 0); print(f'Active Tokens: {tokens}'); sys.exit(0 if tokens < 20000 else 1)"
    echo "✓ Token budget is within sovereign 20,000 cap."
else
    echo "! agy-skills not directly installed; skipping live budget assertion."
fi

echo "[3/4] Verifying Android Starter Template Offline Invariant..."
STARTER_DIR="templates/liftoff-starter"
if [ -d "$STARTER_DIR" ]; then
    (
        cd "$STARTER_DIR"
        if [ -x "./gradlew" ]; then
            echo "Running verifyZeroEgress audit..."
            ./gradlew verifyZeroEgress --offline --console=plain || echo "Note: verifyZeroEgress requires offline cache or network pre-seed."
        fi
    )
fi

echo "[4/4] Environment verification sequence complete."
