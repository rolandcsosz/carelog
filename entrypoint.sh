#!/bin/sh

if [ -z "$BACKEND_URL" ]; then
  echo "BACKEND_URL not set, using default http://localhost:8080"
  BACKEND_URL="http://localhost:8080"
fi

sed -i "s|__BACKEND_URL__|${BACKEND_URL}|g" /usr/share/nginx/html/index.html

exec "$@"
