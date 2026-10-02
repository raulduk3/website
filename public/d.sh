#!/bin/bash
set -Eeuo pipefail

echo "=== OMARCHY MAC BOOTSTRAP ==="

# Must be root
if [ "$(id -u)" -ne 0 ]; then
    echo "ERROR: Run as root"
    exit 1
fi

# Get WiFi credentials (read from the terminal so `curl ... | bash` works)
printf "WiFi name: "
read -r SSID </dev/tty

printf "WiFi password: "
read -rs WIFIPASS </dev/tty
echo

# Start networking
systemctl enable --now NetworkManager

sleep 3

nmcli radio wifi on

# Find WiFi interface
WIFI_IF="$(
    nmcli -t -f DEVICE,TYPE device |
    awk -F: '$2=="wifi"{print $1; exit}'
)"

if [ -z "$WIFI_IF" ]; then
    echo "ERROR: No WiFi interface found"
    ip link
    exit 1
fi

echo "WiFi interface: $WIFI_IF"

# Scan
nmcli device set "$WIFI_IF" managed yes || true
nmcli device wifi rescan ifname "$WIFI_IF" || true

sleep 3

# Connect
nmcli device wifi connect "$SSID" \
    password "$WIFIPASS" \
    ifname "$WIFI_IF"

echo "Testing network..."

if ! ping -c 2 -W 5 1.1.1.1; then
    echo "ERROR: No internet connection"
    exit 1
fi

if ! getent hosts github.com >/dev/null; then
    echo "ERROR: DNS is not working"
    exit 1
fi

echo "=== INTERNET WORKING ==="

# Make future debugging possible remotely
systemctl enable --now sshd || true

# Download official Omarchy Mac installer
INSTALLER="/root/omarchy-mac-setup"

curl -fL \
    https://raw.githubusercontent.com/omarchy-mac/omarchy-mac/quattro/bin/omarchy-mac-setup \
    -o "$INSTALLER"

chmod +x "$INSTALLER"

echo
echo "=== OMARCHY INSTALLER READY ==="
echo

# Start official installer (attach to the terminal, not the curl pipe)
exec "$INSTALLER" \
    --no-encrypt \
    --user richardalvarez \
    --hostname omarchy \
    --keymap us \
    --keep-root-password </dev/tty
