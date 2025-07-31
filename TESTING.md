# 🧪 TaskShare - Guia de Testes

## 🚀 Como Executar

```bash
# 1. Instalar dependências
cd backend && npm install
cd ../frontend && npm install

# 2. Executar aplicação
npm run dev  # Na raiz do projeto
```

## 🔗 URLs para Teste

### 📱 **Frontend (Aplicação Completa)**
```
http://localhost:5174
```
- ✅ Interface completa da aplicação
- ✅ Registro/Login de usuários
- ✅ Criação e gerenciamento de listas
- ✅ Drag & drop de tarefas
- ✅ Sistema de comentários
- ✅ Compartilhamento de listas

### 📚 **API Documentation (Swagger)**
```
http://localhost:3001/api-docs
```
- ✅ Documentação interativa completa
- ✅ Teste todos os endpoints diretamente
- ✅ Schemas e exemplos de request/response
- ✅ Autenticação JWT integrada

### ℹ️ **API Info**
```
http://localhost:3001/
```
- ✅ Visão geral dos endpoints disponíveis
- ✅ Exemplos de uso da API

## 🧪 Fluxo de Teste Sugerido

### 1. **Frontend Testing**
1. Acesse `http://localhost:5174`
2. Registre um novo usuário
3. Faça login
4. Crie uma lista de tarefas
5. Adicione algumas tarefas
6. Teste drag & drop para reordenar
7. Marque tarefas como concluídas
8. Adicione comentários às tarefas
9. Teste compartilhamento de listas

### 2. **API Testing (Swagger)**
1. Acesse `http://localhost:3001/api-docs`
2. Teste endpoint de registro: `POST /auth/register`
3. Teste endpoint de login: `POST /auth/login`
4. Use o token JWT para testar endpoints protegidos
5. Teste CRUD de listas: `GET/POST/PUT/DELETE /lists`
6. Teste CRUD de tarefas: `GET/POST/PUT/DELETE /tasks`

### 3. **Endpoints Principais**

#### **Autenticação**
- `POST /api/auth/register` - Registro de usuário
- `POST /api/auth/login` - Login
- `GET /api/auth/me` - Dados do usuário logado

#### **Listas**
- `GET /api/lists` - Listar todas as listas
- `POST /api/lists` - Criar nova lista
- `PUT /api/lists/{id}` - Atualizar lista
- `DELETE /api/lists/{id}` - Deletar lista
- `POST /api/lists/{id}/share` - Compartilhar lista

#### **Tarefas**
- `GET /api/lists/{listId}/tasks` - Tarefas de uma lista
- `POST /api/lists/{listId}/tasks` - Criar tarefa
- `PUT /api/tasks/{id}` - Atualizar tarefa
- `DELETE /api/tasks/{id}` - Deletar tarefa
- `PATCH /api/tasks/{id}/toggle` - Marcar como concluída
- `PATCH /api/lists/{listId}/tasks/reorder` - Reordenar tarefas

#### **Comentários**
- `GET /api/tasks/{taskId}/comments` - Listar comentários
- `POST /api/tasks/{taskId}/comments` - Adicionar comentário

## 🔧 Tecnologias Utilizadas

### **Backend**
- Node.js + TypeScript
- Express.js
- Prisma ORM
- SQLite Database
- JWT Authentication
- Swagger/OpenAPI Documentation
- Zod Validation

### **Frontend**
- React + TypeScript
- Vite
- Tailwind CSS
- React Router DOM
- Axios
- React Hot Toast
- @hello-pangea/dnd (Drag & Drop)

## 📊 Funcionalidades Implementadas

- ✅ **Autenticação JWT** completa
- ✅ **CRUD de Listas** com validação
- ✅ **CRUD de Tarefas** com reordenação
- ✅ **Sistema de Comentários**
- ✅ **Compartilhamento de Listas**
- ✅ **Drag & Drop** para reordenação
- ✅ **URLs amigáveis** com slugs
- ✅ **Documentação Swagger** completa
- ✅ **Validação de dados** com Zod
- ✅ **Tratamento de erros** centralizado
- ✅ **Interface responsiva** com Tailwind
- ✅ **Busca e filtros** no Dashboard
- ✅ **Navegação breadcrumb**
- ✅ **Modais customizados**

## 🔒 Segurança

- ✅ **CUIDs** para IDs únicos e seguros
- ✅ **Hash de senhas** com bcryptjs
- ✅ **JWT tokens** para autenticação
- ✅ **Validação de entrada** em todos os endpoints
- ✅ **CORS** configurado adequadamente
- ✅ **Middleware de autenticação** em rotas protegidas

## 📝 Observações

- O banco SQLite é local e não será versionado no Git
- Todos os dados são criados localmente durante os testes
- A aplicação está configurada para desenvolvimento
- URLs amigáveis implementadas para melhor UX
