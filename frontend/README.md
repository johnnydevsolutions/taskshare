# TaskShare Frontend

Interface web para a aplicação TaskShare.

## Tecnologias

- React 18 com TypeScript
- Vite
- React Router DOM
- Tailwind CSS
- React Hook Form
- Zod para validação
- Axios para requisições HTTP
- React Hot Toast para notificações
- Lucide React para ícones

## Setup

1. Instale as dependências:
```bash
npm install
```

2. Inicie o servidor de desenvolvimento:
```bash
npm run dev
```

A aplicação estará rodando em `http://localhost:5173`

## Scripts Disponíveis

- `npm run dev` - Inicia o servidor de desenvolvimento
- `npm run build` - Compila para produção
- `npm run preview` - Visualiza a build de produção
- `npm run lint` - Executa o ESLint

## Funcionalidades

### Autenticação
- Registro de usuário
- Login/Logout
- Persistência de sessão

### Gerenciamento de Listas
- Criar, editar e excluir listas de tarefas
- Compartilhar listas com outros usuários
- Visualizar listas próprias e compartilhadas

### Gerenciamento de Tarefas
- Criar, editar e excluir tarefas
- Marcar tarefas como concluídas/incompletas
- Visualizar progresso das listas

### Comentários
- Adicionar comentários às tarefas
- Visualizar histórico de comentários
- Identificação do autor dos comentários

## Estrutura do Projeto

```
src/
├── components/     # Componentes reutilizáveis
├── contexts/       # Contextos React (Auth)
├── lib/           # Utilitários (API client)
├── pages/         # Páginas da aplicação
├── types/         # Definições TypeScript
└── main.tsx       # Ponto de entrada
```