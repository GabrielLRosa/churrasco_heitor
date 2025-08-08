FROM postgres:15

# Instala o pgaudit
RUN apt-get update && apt-get install -y postgresql-15-pgaudit

# Copia os arquivos de configuração
COPY postgresql.conf /etc/postgresql/postgresql.conf

# Adiciona o init.sql para criar as tabelas
COPY init.sql /docker-entrypoint-initdb.d/