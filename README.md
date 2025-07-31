# TaskShare - Gerenciamento Colaborativo de Tarefas

Uma aplicação web moderna para gerenciamento colaborativo de tarefas, permitindo que usuários criem listas de tarefas e as compartilhem com outros usuários.

## 🚀 Funcionalidades

### Autenticação
- ✅ Registro de usuário
- ✅ Login/Logout
- ✅ Persistência de sessão com JWT

### Gerenciamento de Listas
- ✅ Criar, editar e excluir listas de tarefas
- ✅ Compartilhar listas com outros usuários
- ✅ Visualizar listas próprias e compartilhadas
- ✅ Controle de acesso por usuário

### Gerenciamento de Tarefas
- ✅ Criar, editar e excluir tarefas
- ✅ Marcar tarefas como concluídas/incompletas
- ✅ Visualizar progresso das listas
- ✅ Organização por lista

### Sistema de Comentários
- ✅ Adicionar comentários às tarefas
- ✅ Visualizar histórico de comentários
- ✅ Identificação do autor dos comentários
- ✅ Timestamps dos comentários

## 🛠️ Tecnologias

### Backend
- **Node.js** com TypeScript
- **Express.js** - Framework web
- **Prisma ORM** - Gerenciamento de banco de dados
- **SQLite** (desenvolvimento) / **PostgreSQL** (produção)
- **JWT** - Autenticação
- **Zod** - Validação de esquemas
- **bcryptjs** - Hash de senhas
- **CORS** - Controle de acesso

### Frontend
- **React 18** com TypeScript
- **Vite** - Build tool e dev server
- **React Router DOM** - Roteamento
- **Tailwind CSS** - Estilização
- **React Hook Form** - Gerenciamento de formulários
- **Zod** - Validação de esquemas
- **Axios** - Cliente HTTP
- **React Hot Toast** - Notificações
- **Lucide React** - Ícones

## 📦 Estrutura do Projeto

```
taskshare/
├── backend/                 # API Backend
│   ├── src/
│   │   ├── routes/         # Rotas da API
│   │   ├── middleware/     # Middlewares
│   │   ├── utils/          # Utilitários
│   │   └── index.ts        # Ponto de entrada
│   ├── prisma/
│   │   └── schema.prisma   # Schema do banco
│   └── package.json
├── frontend/               # Interface React
│   ├── src/
│   │   ├── components/     # Componentes reutilizáveis
│   │   ├── contexts/       # Contextos React
│   │   ├── lib/           # Utilitários
│   │   ├── pages/         # Páginas da aplicação
│   │   ├── types/         # Definições TypeScript
│   │   └── main.tsx       # Ponto de entrada
│   └── package.json
└── package.json           # Scripts do projeto
```

## 🚀 Como Executar

### Opção 1: Docker (Recomendado) 🐳

**Pré-requisitos:**
- [Docker](https://www.docker.com/get-started)
- [Docker Compose](https://docs.docker.com/compose/install/)

```bash
# Execute tudo com um comando
docker-compose up

# ⚠️ IMPORTANTE: Na primeira execução, inicialize o banco de dados:
docker-compose exec backend npm run db:migrate

# 💡 OPCIONAL: Para IntelliSense no VS Code, instale dependências localmente:
cd backend && npm install
cd ../frontend && npm install
```

**Acessos:**
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:3001
- **📋 Swagger API Documentation**: http://localhost:3001/api-docs
- **🏥 Health Check**: http://localhost:3001/health

> **🎯 Para Recrutadores**: Acesse a **documentação interativa Swagger** em http://localhost:3001/api-docs para testar todos os endpoints da API diretamente no navegador!

📖 **Documentação completa**: [DOCKER.md](./DOCKER.md)

### Opção 2: Desenvolvimento Local

**Pré-requisitos:**
- Node.js 18+
- npm ou yarn

### 1. Clone o repositório
```bash
git clone <repository-url>
cd taskshare
```

### 2. Instale as dependências
```bash
# Instalar dependências de ambos os projetos
npm install

# Ou instalar separadamente:
cd backend && npm install
cd ../frontend && npm install
```

### 3. Configure o ambiente

#### Backend (.env)
```env
NODE_ENV=development
PORT=3001
DATABASE_URL="file:./dev.db"
JWT_SECRET=your-super-secret-jwt-key-here
JWT_EXPIRES_IN=7d
FRONTEND_URL=http://localhost:5173
```

#### Frontend (.env)
```env
VITE_API_URL=http://localhost:3001/api
```

### 4. Configure o banco de dados
```bash
cd backend
npx prisma generate
npx prisma migrate dev --name init
```

### 5. Inicie os servidores

#### Opção 1: Usar scripts do projeto raiz
```bash
# Inicia ambos os servidores simultaneamente
npm run dev

# Ou separadamente:
npm run dev:backend
npm run dev:frontend
```

#### Opção 2: Iniciar manualmente
```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend  
cd frontend
npm run dev
```

### 6. Acesse a aplicação
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:3001
- **Prisma Studio**: `npx prisma studio` (no diretório backend)

## 📚 API Endpoints

### Autenticação
- `POST /api/auth/register` - Registro
- `POST /api/auth/login` - Login
- `GET /api/auth/me` - Usuário atual
- `POST /api/auth/logout` - Logout

### Listas
- `GET /api/lists` - Listar listas
- `POST /api/lists` - Criar lista
- `PUT /api/lists/:id` - Atualizar lista
- `DELETE /api/lists/:id` - Excluir lista
- `POST /api/lists/:id/share` - Compartilhar lista
- `DELETE /api/lists/:id/share/:userId` - Remover compartilhamento

### Tarefas
- `GET /api/lists/:listId/tasks` - Listar tarefas
- `POST /api/lists/:listId/tasks` - Criar tarefa
- `PUT /api/tasks/:id` - Atualizar tarefa
- `DELETE /api/tasks/:id` - Excluir tarefa
- `PATCH /api/tasks/:id/toggle` - Alternar status

### Comentários
- `GET /api/tasks/:taskId/comments` - Listar comentários
- `POST /api/tasks/:taskId/comments` - Criar comentário

## 📋 Regras de Negócio

### Autenticação e Usuários
- ✅ **Registro obrigatório**: Usuários devem se registrar com email único, nome e senha
- ✅ **Autenticação JWT**: Sessões mantidas por 7 dias por padrão
- ✅ **Validação de senha**: Mínimo 6 caracteres obrigatório
- ✅ **Hash de senhas**: Senhas são criptografadas com bcrypt (salt rounds = 12)

### Listas de Tarefas
- ✅ **Propriedade**: Apenas o criador da lista pode editá-la, excluí-la ou compartilhá-la
- ✅ **Compartilhamento**: Listas podem ser compartilhadas com outros usuários via email
- ✅ **Acesso compartilhado**: Usuários com acesso podem visualizar e gerenciar tarefas
- ✅ **Exclusão em cascata**: Excluir lista remove todas as tarefas e comentários

### Tarefas
- ✅ **Criação livre**: Não há limite para criação de tarefas em uma lista
- ✅ **Acesso baseado na lista**: Usuários com acesso à lista podem gerenciar suas tarefas
- ✅ **Status toggle**: Tarefas podem ser marcadas como completas/incompletas a qualquer momento
- ✅ **Edição**: Título das tarefas pode ser editado por usuários com acesso
- ✅ **Exclusão**: Tarefas podem ser excluídas (com confirmação via modal)

### Comentários
- ✅ **Acesso baseado na lista**: Apenas usuários com acesso à lista podem comentar
- ✅ **Identificação do autor**: Comentários mostram nome e data do autor
- ✅ **Histórico permanente**: Comentários não podem ser editados ou excluídos
- ✅ **Contador visual**: Tarefas mostram número de comentários

### Interface e UX
- ✅ **Confirmações**: Ações destrutivas (exclusões) requerem confirmação via modal
- ✅ **Feedback visual**: Notificações toast para todas as ações
- ✅ **Estados de carregamento**: Indicadores visuais durante operações
- ✅ **Validação em tempo real**: Formulários validados antes do envio

### Limitações Técnicas
- ✅ **Títulos**: Máximo 200 caracteres para tarefas e listas
- ✅ **Comentários**: Sem limite de caracteres (dentro do razoável)
- ✅ **Compartilhamento**: Apenas por email de usuários registrados
- ✅ **Sessões**: Tokens JWT expiram em 7 dias

## 📋 API Documentation (Swagger)

### 🎯 Para Recrutadores - Teste a API Interativamente!

A aplicação inclui **documentação Swagger completa e interativa** onde você pode:

- **📖 Visualizar todos os endpoints** com descrições detalhadas
- **🧪 Testar endpoints diretamente** no navegador
- **📝 Ver exemplos de request/response** para cada operação
- **🔐 Autenticar e testar fluxos completos** de usuário

**Acesso:** http://localhost:3001/api-docs

### Principais Endpoints Disponíveis:

#### 🔐 Autenticação
- `POST /api/auth/register` - Registrar novo usuário
- `POST /api/auth/login` - Fazer login
- `GET /api/auth/me` - Obter dados do usuário logado

#### 📋 Listas de Tarefas
- `GET /api/lists` - Listar todas as listas do usuário
- `POST /api/lists` - Criar nova lista
- `PUT /api/lists/:id` - Editar lista
- `DELETE /api/lists/:id` - Excluir lista
- `POST /api/lists/:id/share` - Compartilhar lista

#### ✅ Tarefas
- `GET /api/lists/:listId/tasks` - Listar tarefas de uma lista
- `POST /api/lists/:listId/tasks` - Criar nova tarefa
- `PUT /api/tasks/:id` - Editar tarefa
- `PATCH /api/tasks/:id/toggle` - Marcar/desmarcar como concluída
- `DELETE /api/tasks/:id` - Excluir tarefa

#### 💬 Comentários
- `GET /api/tasks/:taskId/comments` - Listar comentários de uma tarefa
- `POST /api/tasks/:taskId/comments` - Adicionar comentário

### Como Testar:

1. **Execute a aplicação** (Docker ou local)
2. **Acesse** http://localhost:3001/api-docs
3. **Registre um usuário** via endpoint `/api/auth/register`
4. **Faça login** e copie o token JWT
5. **Clique em "Authorize"** no Swagger e cole o token
6. **Teste todos os endpoints** diretamente na interface!

## 🔒 Segurança

- Autenticação JWT com tokens seguros
- Validação de entrada com Zod
- Hash de senhas com bcryptjs
- Controle de acesso baseado em usuário
- Sanitização de dados
- CORS configurado

## 🎨 Interface

- Design responsivo com Tailwind CSS
- Interface intuitiva e moderna
- Notificações em tempo real
- Indicadores de carregamento
- Validação de formulários em tempo real
- Tema consistente com paleta de cores personalizada

## � Troubleshooting

### Erro 500 ao registrar usuário
Se você receber erro 500 ao tentar registrar um usuário, provavelmente o banco de dados não foi inicializado:

```bash
# Execute as migrações do banco
docker-compose exec backend npm run db:migrate
```

### Containers não iniciam
```bash
# Pare todos os containers
docker-compose down

# Reconstrua as imagens
docker-compose up --build
```

### Problemas de TypeScript no VS Code
Para que o IntelliSense funcione corretamente no VS Code, você precisa instalar as dependências localmente (mesmo usando Docker):

```bash
# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

**Por que isso é necessário?**
- O Docker instala as dependências apenas dentro do container
- O VS Code precisa das dependências locais para análise de código, autocomplete e detecção de erros
- Isso não afeta o funcionamento da aplicação, apenas melhora a experiência de desenvolvimento
- Resolve erros como "Cannot find module 'vite'" ou "Cannot find module 'express'"

### Erro de proxy no frontend (ECONNREFUSED)
Se o frontend não conseguir se conectar ao backend:

```bash
# Reconstrua os containers
docker-compose down
docker-compose up --build
```

## �📝 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 🤝 Contribuição

Contribuições são bem-vindas! Por favor, abra uma issue ou envie um pull request.

## 📞 Suporte

Para suporte, abra uma issue no repositório ou entre em contato através do email.

---

Desenvolvido com ❤️ usando React, Node.js e TypeScript