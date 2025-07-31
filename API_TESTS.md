# Teste das Rotas da API TaskShare

## Testando a API

### 1. Health Check
```bash
curl http://localhost:3001/health
```

### 2. Informações da API
```bash
curl http://localhost:3001/api
```

### 3. Registro de Usuário
```bash
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "João Silva",
    "email": "joao@example.com",
    "password": "123456"
  }'
```

### 4. Login
```bash
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "joao@example.com",
    "password": "123456"
  }'
```

### 5. Obter dados do usuário (substitua TOKEN pelo token recebido no login)
```bash
curl http://localhost:3001/api/auth/me \
  -H "Authorization: Bearer TOKEN"
```

### 6. Criar uma lista (substitua TOKEN pelo token recebido no login)
```bash
curl -X POST http://localhost:3001/api/lists \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer TOKEN" \
  -d '{
    "title": "Minha Lista de Tarefas",
    "description": "Lista para organizar minhas atividades"
  }'
```

## URLs Importantes

- **Frontend**: http://localhost:5173/
- **API**: http://localhost:3001/api
- **Documentação Swagger**: http://localhost:3001/api-docs
- **Health Check**: http://localhost:3001/health

## Problemas Resolvidos

✅ **Erro 'error' is of type 'unknown'**: Corrigido especificando o tipo `any` no catch
✅ **Warning @tailwind**: Corrigido adicionando plugin `tailwindcss/nesting` no PostCSS
✅ **Segurança de senhas**: Confirmado que o hash já estava implementado corretamente
✅ **Documentação Swagger**: Implementada com sucesso
✅ **Route not found**: Rotas configuradas corretamente

## Swagger/OpenAPI

A documentação da API está disponível em: http://localhost:3001/api-docs

Sim, é uma **excelente prática** usar Swagger para documentar APIs! Benefícios:

- 📚 **Documentação interativa**: Permite testar endpoints diretamente
- 🔄 **Sempre atualizada**: Documentação gerada automaticamente do código
- 👥 **Colaboração**: Facilita o trabalho em equipe
- 🧪 **Testes**: Interface para testar a API sem ferramentas externas
- 📋 **Especificação**: Padrão OpenAPI reconhecido mundialmente