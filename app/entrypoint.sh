#!/bin/sh

if [ "$DATABASE_DB" = "postgres" ]
then
    echo "Waiting for postgres..."

    while ! nc -z $PGHOST $PGPORT; do
        sleep 0.1
    done

    echo "PostgreSQL started"
fi

python manage.py migrate

exec "$@"