#!/bin/sh

if [ "$DATABESE" = "postgres" ]
then
    echo "Waiting for postgres..."

    while ! nc -z $PGHOST $PGPORT; do
        sleep 0.1
    done

    echo "PostgreSQL started"
fi

python manage.py flush --no-input
python manage.py migrate

exec "$@"