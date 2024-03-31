#!/bin/sh
#
echo "Running database migrations..."
npm run db:migrate:prod

exec "$@"
