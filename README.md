# 🏋️ SempreFit

Uma plataforma completa de gestão de saúde e bem-estar que permite aos utilizadores acompanhar a sua evolução física, alimentação, exercícios e meditação através de uma interface moderna, segura e intuitiva.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Next.js](https://img.shields.io/badge/Next.js-15-black)
![Node.js](https://img.shields.io/badge/Node.js-20-green)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-blue)
![Docker](https://img.shields.io/badge/Docker-Ready-2496ED)

---

# 📖 Índice

- Sobre o projecto
- Funcionalidades
- Arquitectura
- Tecnologias utilizadas
- Estrutura do projecto
- Requisitos
- Instalação
- Configuração
- Execução
- Docker
- API
- Base de Dados
- Segurança
- Capturas de ecrã
- Roadmap
- Contribuição
- Licença

---

# 📌 Sobre o projecto

O SempreFit foi desenvolvido para auxiliar pessoas na gestão do seu estilo de vida saudável.

A plataforma permite controlar:

- Alimentação
- Exercícios
- Meditações
- Perfil do utilizador
- Indicadores de saúde
- Administração de utilizadores

O sistema possui autenticação tradicional e autenticação através do Google OAuth.

---

# ✨ Funcionalidades

## Utilizador

- Cadastro
- Login
- Login com Google
- Recuperação de senha
- Actualização de perfil
- Alteração de palavra-passe

### Dashboard

- Estatísticas gerais
- Resumo de actividades
- Indicadores pessoais

### Alimentação

- Criar refeições
- Editar refeições
- Eliminar refeições
- Histórico

### Exercícios

- Criar exercícios
- Editar
- Eliminar
- Histórico

### Meditação

- Criar sessões
- Editar
- Eliminar
- Histórico

---

## Administrador

- Gestão de utilizadores
- Gestão do sistema
- Visualização de estatísticas

---

# 🏗 Arquitectura

```
                Cliente

             Next.js Frontend
                     │
                     │ REST API
                     ▼

             Node.js Backend
                     │
                Prisma ORM
                     │
                     ▼
               PostgreSQL

        Docker + Docker Compose
               Nginx Reverse Proxy
```

---

# 🚀 Tecnologias utilizadas

## Frontend

- Next.js
- React
- TypeScript
- Tailwind CSS
- Axios

## Backend

- Node.js
- Express
- Prisma ORM
- JWT
- Google OAuth

## Base de Dados

- PostgreSQL

## DevOps

- Docker
- Docker Compose
- Nginx

---

# 📂 Estrutura do projecto

```
SempreFit

├── backend
│   ├── prisma
│   ├── src
│   ├── routes
│   ├── controllers
│   ├── middleware
│   └── services
│
├── frontend
│   ├── app
│   ├── components
│   ├── hooks
│   ├── services
│   └── styles
│
├── nginx
│   └── nginx.conf
│
├── docker-compose.yml
├── Dockerfile
└── README.md
```

---

# ⚙ Requisitos

- Node.js 20+
- PostgreSQL
- Docker
- Docker Compose
- Git

---

# 🔧 Instalação

Clone o projecto

```bash
git clone https://github.com/SEU_USUARIO/SempreFit.git
```

Entre na pasta

```bash
cd SempreFit
```

---

# 📦 Instalação das dependências

Backend

```bash
cd backend
npm install
```

Frontend

```bash
cd frontend
npm install
```

---

# 🔑 Configuração

Crie um ficheiro

```
.env
```

Utilize como base

```
.env.example
```

Exemplo:

```env
DATABASE_URL=

JWT_SECRET=

GOOGLE_CLIENT_ID=

GOOGLE_CLIENT_SECRET=
```

⚠ Nunca publique ficheiros `.env` no GitHub.

---

# 🗄 Base de Dados

Executar as migrations

```bash
npx prisma migrate dev
```

Gerar o Prisma Client

```bash
npx prisma generate
```

---

# ▶ Executar o projecto

Backend

```bash
npm run dev
```

Frontend

```bash
npm run dev
```

---

# 🐳 Docker

Construir os containers

```bash
docker compose up --build
```

Executar

```bash
docker compose up
```

Parar

```bash
docker compose down
```

---

# 🔌 API

Exemplo de endpoints

## Autenticação

```
POST /api/auth/login

POST /api/auth/register

POST /api/auth/google
```

## Perfil

```
GET /api/profile

PUT /api/profile
```

## Refeições

```
GET /api/meals

POST /api/meals

PUT /api/meals/:id

DELETE /api/meals/:id
```

## Exercícios

```
GET /api/exercises

POST /api/exercises

PUT /api/exercises/:id

DELETE /api/exercises/:id
```

## Meditação

```
GET /api/meditations

POST /api/meditations

PUT /api/meditations/:id

DELETE /api/meditations/:id
```

---

# 🔒 Segurança

O projecto utiliza:

- JWT
- Google OAuth
- Password Hashing
- Middleware de autenticação
- Protecção de rotas
- Variáveis de ambiente

---

# 📸 Capturas de ecrã

Adicionar imagens das seguintes páginas:

- Login
- Dashboard
- Perfil
- Exercícios
- Alimentação
- Meditação
- Administração

---

# 🛣 Roadmap

- Notificações
- Integração com Smartwatch
- Aplicação Android
- Aplicação iOS
- Relatórios PDF
- Estatísticas avançadas
- IA para recomendações de saúde

---

# 🤝 Contribuição

1. Faça um Fork

2. Crie uma Branch

```
git checkout -b feature/minha-feature
```

3. Faça Commit

```
git commit -m "Nova funcionalidade"
```

4. Push

```
git push origin feature/minha-feature
```

5. Abra um Pull Request

---

# 📄 Licença

Este projecto encontra-se licenciado sob a Licença MIT.

---

# 👨‍💻 Autor

**David Orlando A. Tomás**

Licenciatura em Engenharia Informática

Instituto Superior Politécnico de Tecnologias e Ciências (ISPTEC)

GitHub:
https://github.com/DavidOrlandoAATomas
