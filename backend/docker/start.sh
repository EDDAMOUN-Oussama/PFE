#!/bin/sh
set -eu
case "${PORT:-10000}" in
  ''|*[!0-9]*) echo "PORT must be numeric" >&2; exit 1 ;;
esac
port="${PORT:-10000}"
if [ "$port" -lt 1 ] || [ "$port" -gt 65535 ]; then
  echo "PORT must be between 1 and 65535" >&2; exit 1
fi
printf 'Listen %s\n' "$port" > /etc/apache2/ports.conf
sed -i "s/<VirtualHost \*:[0-9]*>/<VirtualHost *:$port>/" /etc/apache2/sites-available/000-default.conf
exec apache2-foreground
