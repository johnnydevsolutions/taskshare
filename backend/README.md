# TaskShare Backend

API backend para a aplicação TaskShare.

## Tecnologias

- Node.js com TypeScript
- Express.js
- Prisma ORM
- SQLite (desenvolvimento) / PostgreSQL (produção)
- JWT para autenticação

## Setup

1. Instale as dependências:
```bash
npm install
```

2. Configure as variáveis de ambiente:
```bash
cp .env.example .env
# Edite o arquivo .env conforme necessário
```

3. Execute as migrações do banco:
```bash
npm run db:migrate
```

4. Inicie o servidor de desenvolvimento:
```bash
npm run dev
```

O servidor estará rodando em `http://localhost:3001`

## Scripts Disponíveis

- `npm run dev` - Inicia o servidor em modo desenvolvimento
- `npm run build` - Compila o TypeScript
- `npm start` - Inicia o servidor em produção
- `npm run db:migrate` - Executa migrações do banco
- `npm run db:generate` - Gera o cliente Prisma
- `npm run db:studio` - Abre o Prisma Studio

## Estrutura da API

### Autenticação
- `POST /api/auth/register` - Registro de usuário
- `POST /api/auth/login` - Login
- `GET /api/auth/me` - Dados do usuário atual
- `POST /api/auth/logout` - Logout

### Listas
- `GET /api/lists` - Listar todas as listas
- `POST /api/lists` - Criar nova lista
- `PUT /api/lists/:id` - Atualizar lista
- `DELETE /api/lists/:id` - Excluir lista
- `POST /api/lists/:id/share` - Compartilhar lista
- `DELETE /api/lists/:id/share/:userId` - Remover compartilhamento

### Tarefas
- `GET /api/lists/:listId/tasks` - Listar tarefas de uma lista
- `POST /api/lists/:listId/tasks` - Criar nova tarefa
- `PUT /api/tasks/:id` - Atualizar tarefa
- `DELETE /api/tasks/:id` - Excluir tarefa
- `PATCH /api/tasks/:id/toggle` - Alternar status da tarefa

### Comentários
- `GET /api/tasks/:taskId/comments` - Listar comentários de uma tarefa
- `POST /api/tasks/:taskId/comments` - Criar novo comentário