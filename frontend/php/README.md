# PHP Orquestrador

Este é um projeto de um orquestrador em PhP utilizando o CodeIgniter 3.

## Pré-requisitos

Antes de começar, certifique-se de ter instalado em sua máquina:

- [Docker](https://docs.docker.com/get-docker/)
- [Docker Compose](https://docs.docker.com/compose/install/)

## Como Executar o Projeto

1. Clone o repositório:
```bash
git clone https://github.com/AnaBerg/php-orquestrador
cd php-orquestrador
```

2. Inicie os containers usando Docker Compose:
```bash
docker compose up -d
```

O projeto estará disponível em `http://localhost:80`

### Comandos Úteis

- Para parar os containers:
```bash
docker compose down
```

- Para visualizar os logs:
```bash
docker compose logs -f
```

- Para reconstruir os containers após alterações no Dockerfile:
```bash
docker compose up -d --build
```

### Troubleshooting

Se você encontrar algum problema ao executar o projeto:

1. Verifique se o Docker está em execução
2. Certifique-se de que a porta 80 não está sendo usada por outro serviço
3. Verifique os logs do container para mais detalhes sobre possíveis erros

## Estrutura do projeto

O projeto segue a estrutura padrão do CodeIgniter 3:

- `application/` - Contém o código principal da aplicação
  - `controllers/` - Controladores da aplicação
  - `models/` - Modelos de dados
  - `views/` - Arquivos de visualização
  - `config/` - Arquivos de configuração
  - `helpers/` - Funções auxiliares
  - `libraries/` - Bibliotecas personalizadas

- `system/` - Core do CodeIgniter (não deve ser modificado)
- `public/` - Diretório público com arquivos acessíveis via web
- `docker/` - Arquivos de configuração do Docker
- `index.php` - Ponto de entrada da aplicação
- `.htaccess` - Configurações do Apache
- `composer.json` - Gerenciamento de dependências PHP

## Suporte

Para mais informações ou suporte, entre em contato com o(a) tech recruiter do seu processo.
