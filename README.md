URL Shortener API

API para encurtar URLs e gerenciar URLs de usuários.

Começando

# URL Shortener API

API for shortening URLs and managing user URLs.

## Prerequisites

Before running the project, make sure you have the following installed:

- Node.js  v18.19.0
- npm (Node Package Manager)
- Prisma CLI
- Docker (for running Prisma with Docker)

## Getting Started

1. Clone the repository:

```bash
git clone <repository-url>
```

2. Navigate to the project directory:

```bash
cd url-shortener
```

3. Install dependencies:

```bash
npm install
```

4.Para rodar os containers em segundo plano (modo "detached")
docker compose up -d

5. Rodar migrate do prisma pra sincronizar a base
npx prisma migrate dev


6. Start the server:
```bash
npm run dev 
```

7. Rodar o primeiro serviço para registrar o primeiro user

http://localhost:3000/register

`
{
  "email": "manaus@meuemail.com",
  "password": "minhasenha"
}

`
8. Com user criado, pode-se logar. 
POST: http://localhost:3000/login

`{
  "email": "manaus@meuemail.com",
  "password": "minhasenha"
}
`

9. Serviço de encurtador de URL
POST: http://localhost:3000/urls

´
{
  "originalUrl": "https://teddy360.com.br/material/marco-legal-das-garantias-sancionado-entenda-o-que-muda/"
}
´

10. Serviço de Listar URLs de usuários. Pegar o valor do atributo "short": 
GET: http://localhost:3000/urls

11. Serviço de redirecionamento para URL original. Navegar na página original
GET: http://localhost:3000/codigoshort

12. Serviço de editar URL encurtada para o novo destinatário
PUT:  http://localhost:3000/url

13. Serviço de deletar url
DELETE: http://localhost:3000/url

`
{
  "shortUrl": "codigoshort"
}
`


9. Start para acessar o banco prisma:
```bash
npx prisma studio 
```

## Documentação da API

## Acesse a documentação Swagger no seu navegador. Certifique-se de que o servidor esteja em execução para que a documentação seja acessível:

http://localhost:3000/api-docs

## Endpoints

## A API possui os seguintes endpoints:

    POST /register: Registrar um novo usuário
    POST /login: Login com as credenciais existentes
    POST /url: Encurtar uma URL
    GET /url: Listar URLs encurtadas do usuário
    PUT /url: Editar o destino de uma URL encurtada
    DELETE /url: Excluir uma URL encurtada
    GET /:short: Redirecionar para a URL original usando o código curto

## Registrar um Novo Usuário

plaintext

## POST /register
## http://localhost:3000/register

Corpo da requisição:

json

{
  "email": "user@example.com",
  "password": "password"
}

## Login

plaintext

## POST /login
## http://localhost:3000/login


Corpo da requisição:

json

{
  "email": "user@example.com",
  "password": "password"
}

## Encurtar uma URL

plaintext

## POST /url
## http://localhost:3000/url

Corpo da requisição:

json

{
  "originalUrl": "https://teddy360.com.br/material/marco-legal-das-garantias-sancionado-entenda-o-que-muda/"
}


## Listar URLs Encurtadas do Usuário
## http://localhost:3000/urls

plaintext

## GET /url
## http://localhost:3000/VXxSuc

## Editar o Destino de uma URL Encurtada

plaintext

## PUT /url
## http://localhost:3000/url

Corpo da requisição:

json

{
  "shortUrl": "abc123",
  "newDestination": "https://new-destination.com"
}

## Excluir uma URL Encurtada

plaintext

## DELETE /url
## http://localhost:3000/url

Corpo da requisição:

json

{
  "shortUrl": "abc123"
}

## Redirecionar para a URL Original

plaintext

## GET /:short
