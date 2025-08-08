FROM postgres:15

RUN apt-get update && apt-get install -y postgresql-15-pgaudit

COPY postgresql.conf /etc/postgresql/postgresql.conf

COPY init.sql /docker-entrypoint-initdb.d/