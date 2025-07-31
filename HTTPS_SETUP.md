# Configuração HTTPS para Desenvolvimento Local

## Sobre a senha no payload

É normal ver a senha no payload de rede durante o registro ou login, pois isso é apenas o que está sendo enviado do frontend para o backend. O importante é que:

1. O backend **nunca armazena a senha em texto puro** no banco de dados
2. A senha é hashada usando `bcryptjs` antes de ser armazenada
3. Quando um usuário faz login, a senha fornecida é comparada com o hash armazenado

Confirmamos que o sistema está usando hash de senha corretamente:

```typescript
// Em auth.ts
export const hashPassword = async (password: string): Promise<string> => {
  return bcrypt.hash(password, 12);
};

export const comparePassword = async (password: string, hash: string): Promise<boolean> => {
  return bcrypt.compare(password, hash);
};
```

## Status das Correções

1. ✅ Erro JWT corrigido com casting explícito de tipos
2. ✅ Rotas configuradas conforme a estrutura sugerida
3. ✅ Swagger removido da rota `/api-docs`
4. ✅ Hash de senha funcionando corretamente

## Opções para Configurar HTTPS em Desenvolvimento

### Opção 1: Usar mkcert (Recomendado)

[mkcert](https://github.com/FiloSottile/mkcert) é uma ferramenta simples para criar certificados localmente confiáveis.

1. Instale o mkcert
2. Execute:
   ```
   mkcert -install
   mkcert localhost 127.0.0.1 ::1
   ```
3. Configure o Express para usar HTTPS:

```typescript
// Em index.ts
import https from 'https';
import fs from 'fs';

const options = {
  key: fs.readFileSync('path/to/localhost-key.pem'),
  cert: fs.readFileSync('path/to/localhost.pem')
};

// Em vez de app.listen
https.createServer(options, app).listen(PORT, () => {
  console.log(`🚀 Server running on https://localhost:${PORT}`);
});
```

### Opção 2: Usar Express com HTTPS

Se não quiser usar mkcert, você pode gerar certificados autoassinados:

```bash
openssl req -nodes -new -x509 -keyout server.key -out server.cert
```

E então configurar o Express como na Opção 1.

### Opção 3: Usar um Proxy Reverso

Você pode continuar usando HTTP para o servidor de desenvolvimento, mas configurar um proxy reverso como Nginx ou Caddy que lida com HTTPS.

## Nota Importante

Para desenvolvimento local, usar HTTP é perfeitamente aceitável. HTTPS é mais importante em ambientes de produção. Se você estiver apenas desenvolvendo e testando localmente, não há necessidade imediata de configurar HTTPS.

## Rotas da API

### Autenticação
- POST /api/auth/register - Registrar novo usuário
- POST /api/auth/login - Fazer login
- POST /api/auth/logout - Fazer logout
- GET /api/auth/me - Obter dados do usuário atual

### Listas
- GET /api/lists - Obter todas as listas
- POST /api/lists - Criar nova lista
- PUT /api/lists/:id - Atualizar lista
- DELETE /api/lists/:id - Deletar lista
- POST /api/lists/:id/share - Compartilhar lista
- DELETE /api/lists/:id/share/:userId - Remover compartilhamento

### Tarefas
- GET /api/lists/:listId/tasks - Obter tarefas de uma lista
- POST /api/lists/:listId/tasks - Criar nova tarefa
- PUT /api/tasks/:id - Atualizar tarefa
- DELETE /api/tasks/:id - Deletar tarefa
- PATCH /api/tasks/:id/toggle - Alternar conclusão da tarefa

### Comentários
- GET /api/tasks/:taskId/comments - Obter comentários de uma tarefa
- POST /api/tasks/:taskId/comments - Criar novo comentário

## URLs Atuais

- Frontend: http://localhost:5173
- API: http://localhost:3001/api
- Health Check: http://localhost:3001/health