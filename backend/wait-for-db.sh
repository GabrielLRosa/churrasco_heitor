#!/bin/sh

set -e

host="$DB_HOST"
port="$DB_PORT"

echo "Waiting for PostgreSQL at $host:$port to be available..."

until nc -z $host $port; do
  echo "PostgreSQL is unavailable - sleeping"
  sleep 1
done

echo "PostgreSQL is up - executing command"
exec "$@"