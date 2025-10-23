#!/bin/bash
set -e

PGPASSWORD="$DB_PASSWORD" psql -U "$POSTGRES_USER" -d "$POSTGRES_DB" -f /scripts/init.sql
PGPASSWORD="$DB_PASSWORD" psql -U "$POSTGRES_USER" -d "$POSTGRES_DB" -c "CREATE EXTENSION IF NOT EXISTS pgcrypto;"
PGPASSWORD="$DB_PASSWORD" psql -U "$POSTGRES_USER" -d "$POSTGRES_DB" -c "INSERT INTO admins (name, email, password) SELECT 'Admin', 'admin@example.com', crypt('supersecurepassword', gen_salt('bf')) WHERE NOT EXISTS (SELECT 1 FROM admins WHERE email = 'admin@example.com');"

if [ "$INIT_PG_DATA" = "true" ]; then
  echo "Seeding example data..."
  PGPASSWORD="$DB_PASSWORD" psql -U "$POSTGRES_USER" -d "$POSTGRES_DB" -f /scripts/example_data.sql
else
  echo "Skipping example data seeding."
fi
