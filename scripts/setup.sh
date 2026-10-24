#!/usr/bin/env bash
set -euo pipefail

USB_MOUNT="/Volumes/LIFTOFF_USB"
if [ ! -d "$USB_MOUNT" ]; then
    USB_MOUNT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
fi

TARGET_DIR="$HOME/.liftoff/toolchain"
mkdir -p "$TARGET_DIR/bin" "$TARGET_DIR/jdk-17" "$TARGET_DIR/android-sdk"
mkdir -p "$HOME/.gradle/wrapper/dists" "$HOME/.gradle/caches/modules-2"

echo "Provisioning Environment Zero toolchain from $USB_MOUNT..."

if [ -f "$USB_MOUNT/toolchain/jdk-17.tar.gz" ]; then
    tar -xzf "$USB_MOUNT/toolchain/jdk-17.tar.gz" -C "$TARGET_DIR/jdk-17" --strip-components=1
fi

if [ -f "$USB_MOUNT/toolchain/android-sdk.tar.gz" ]; then
    tar -xzf "$USB_MOUNT/toolchain/android-sdk.tar.gz" -C "$TARGET_DIR/android-sdk"
fi

if [ -d "$USB_MOUNT/toolchain/bin" ]; then
    cp -R "$USB_MOUNT/toolchain/bin/"* "$TARGET_DIR/bin/"
    chmod +x "$TARGET_DIR/bin/"* || true
fi

if [ -d "$USB_MOUNT/gradle-seed/dists" ]; then
    cp -R "$USB_MOUNT/gradle-seed/dists/"* "$HOME/.gradle/wrapper/dists/"
fi

if [ -d "$USB_MOUNT/gradle-seed/modules-2" ]; then
    cp -R "$USB_MOUNT/gradle-seed/modules-2/"* "$HOME/.gradle/caches/modules-2/"
fi

ZSHRC="$HOME/.zshrc"
touch "$ZSHRC"
if ! grep -q "LIFTOFF_TOOLCHAIN" "$ZSHRC"; then
    cat <<'EOF' >> "$ZSHRC"

# Liftoff Zero-to-One Toolchain
export LIFTOFF_TOOLCHAIN="$HOME/.liftoff/toolchain"
export JAVA_HOME="${JAVA_HOME:-$LIFTOFF_TOOLCHAIN/jdk-17}"
export ANDROID_HOME="${ANDROID_HOME:-$LIFTOFF_TOOLCHAIN/android-sdk}"
export PATH="$LIFTOFF_TOOLCHAIN/bin:$ANDROID_HOME/platform-tools:$ANDROID_HOME/cmdline-tools/latest/bin:$PATH"
EOF
    echo "Appended environment exports to $ZSHRC"
fi

echo "Environment Zero provisioned successfully on macOS."
