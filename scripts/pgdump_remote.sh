source scripts/env/$1.sh

ssh "${POSTGRES_SSH_HOST}" -l root -p "${POSTGRES_SSH_PORT}" "runuser -l postgres -c 'pg_dump -U postgres -h localhost -p 5432 ${POSTGRES_DB_NAME}'" >> "$2"
