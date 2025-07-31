# 🐳 Docker Setup - TaskShare

## Pré-requisitos

- [Docker](https://www.docker.com/get-started) instalado
- [Docker Compose](https://docs.docker.com/compose/install/) instalado

## 🚀 Execução Rápida

### Opção 1: Usando Docker Compose (Recomendado)

```bash
# Clone o repositório
git clone <seu-repositorio>
cd taskshare

# Execute tudo com um comando
docker-compose up

# ⚠️ IMPORTANTE: Na primeira execução, execute as migrações do banco:
docker-compose exec backend npm run db:migrate
```

### Opção 2: Usando Scripts NPM

```bash
# Construir as imagens
npm run docker:build

# Executar em foreground (com logs)
npm run docker:up

# Executar em background
npm run docker:up:detached

# Ver logs
npm run docker:logs

# Parar containers
npm run docker:down

# Limpar tudo (containers, volumes, imagens)
npm run docker:clean
```

## 🗄️ Configuração do Banco de Dados

**⚠️ IMPORTANTE**: Na primeira execução, você deve inicializar o banco de dados:

```bash
# Após executar docker-compose up, em outro terminal:
docker-compose exec backend npm run db:migrate
```

Este comando:
- Cria as tabelas no banco de dados SQLite
- Aplica todas as migrações do Prisma
- Gera o cliente Prisma atualizado

## 🌐 Acessos

Após executar `docker-compose up` e configurar o banco:

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:3001
- **📋 Swagger API Docs**: http://localhost:3001/api-docs
- **🏥 Health Check**: http://localhost:3001/health

## 📋 Comandos Úteis

### Gerenciamento de Containers

```bash
# Ver containers rodando
docker ps

# Ver logs de um serviço específico
docker-compose logs backend
docker-compose logs frontend

# Executar comando dentro do container
docker-compose exec backend npm test
docker-compose exec frontend npm run build

# Reconstruir apenas um serviço
docker-compose build backend
docker-compose build frontend

# Reiniciar um serviço
docker-compose restart backend
```

### Desenvolvimento

```bash
# Executar em modo desenvolvimento com hot reload
docker-compose up

# Executar apenas o backend
docker-compose up backend

# Executar apenas o frontend
docker-compose up frontend
```

### Limpeza

```bash
# Parar e remover containers
docker-compose down

# Remover containers e volumes
docker-compose down -v

# Remover tudo (containers, volumes, imagens)
docker-compose down -v --rmi all

# Limpar cache do Docker
docker system prune -a
```

## 🔧 Configuração

### Variáveis de Ambiente

O arquivo `docker-compose.yml` já inclui as variáveis necessárias:

**Backend:**
- `NODE_ENV=development`
- `DATABASE_URL=file:./dev.db`
- `JWT_SECRET=your-super-secret-jwt-key-change-in-production`
- `PORT=3001`

**Frontend:**
- `VITE_API_URL=http://localhost:3001`

### Volumes

- **Backend**: Código sincronizado para hot reload + volume persistente para banco
- **Frontend**: Código sincronizado para hot reload
- **Database**: Volume nomeado para persistência dos dados

## 🏥 Health Checks

Ambos os serviços incluem health checks:

- **Backend**: Verifica endpoint `/health`
- **Frontend**: Verifica se a aplicação responde

## 🚀 Deploy para Produção

Para produção, modifique o `docker-compose.yml`:

```yaml
# docker-compose.prod.yml
version: '3.8'
services:
  backend:
    build: ./backend
    environment:
      - NODE_ENV=production
      - DATABASE_URL=${DATABASE_URL}
      - JWT_SECRET=${JWT_SECRET}
    # Remove volumes de desenvolvimento
    
  frontend:
    build: ./frontend
    # Usar nginx para servir arquivos estáticos
```

## 🐛 Troubleshooting

### Problemas Comuns

1. **Porta já em uso**:
   ```bash
   # Verificar o que está usando a porta
   netstat -tulpn | grep :3001
   netstat -tulpn | grep :5173
   
   # Parar containers
   docker-compose down
   ```

2. **Problemas de permissão**:
   ```bash
   # Linux/Mac - dar permissão para Docker
   sudo usermod -aG docker $USER
   ```

3. **Cache de build**:
   ```bash
   # Reconstruir sem cache
   docker-compose build --no-cache
   ```

4. **Banco de dados corrompido**:
   ```bash
   # Remover volume do banco
   docker-compose down -v
   docker-compose up
   ```

### Logs Detalhados

```bash
# Ver logs em tempo real
docker-compose logs -f

# Ver logs de um serviço específico
docker-compose logs -f backend
docker-compose logs -f frontend

# Ver logs com timestamp
docker-compose logs -t
```

## 📊 Monitoramento

### Status dos Serviços

```bash
# Ver status dos containers
docker-compose ps

# Ver uso de recursos
docker stats

# Ver health checks
docker inspect taskshare-backend | grep Health
docker inspect taskshare-frontend | grep Health
```

## 🎯 Vantagens do Docker Setup

1. **✅ Ambiente Consistente**: Funciona igual em qualquer máquina
2. **⚡ Setup Instantâneo**: Um comando e tudo funciona
3. **🔒 Isolamento**: Não interfere com outras aplicações
4. **📦 Portabilidade**: Fácil deploy em qualquer ambiente
5. **🔄 Reprodutibilidade**: Sempre o mesmo resultado
6. **🚀 Escalabilidade**: Fácil de escalar horizontalmente

## 📝 Notas para Recrutadores

- **Facilidade**: Execute apenas `docker-compose up`
- **📋 Documentação Swagger**: Acesse http://localhost:3001/api-docs
- **Testes**: Execute `docker-compose exec backend npm test`
- **Logs**: Use `docker-compose logs -f` para debug
- **Limpeza**: Use `docker-compose down -v` para limpar tudo
