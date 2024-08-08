FROM postgres

COPY init.sql /docker-entrypoint-initdb.d/

ENV POSTGRES_USER user
ENV POSTGRES_PASSWORD password
ENV POSTGRES_DB task_test

EXPOSE 5432