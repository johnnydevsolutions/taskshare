# TaskShare Deployment Guide

## Production Deployment

### Prerequisites
- Node.js 18+ installed on the server
- PostgreSQL database (recommended for production)
- Domain name and SSL certificate
- Reverse proxy (nginx recommended)

### Environment Setup

#### Backend Environment (.env)
```env
NODE_ENV=production
PORT=3001
DATABASE_URL="postgresql://username:password@localhost:5432/taskshare"
JWT_SECRET=your-very-secure-random-secret-key-here
JWT_EXPIRES_IN=7d
FRONTEND_URL=https://yourdomain.com
```

#### Frontend Environment (.env)
```env
VITE_API_URL=https://yourdomain.com/api
```

### Database Setup

1. **Create PostgreSQL database:**
```sql
CREATE DATABASE taskshare;
CREATE USER taskshare_user WITH PASSWORD 'secure_password';
GRANT ALL PRIVILEGES ON DATABASE taskshare TO taskshare_user;
```

2. **Run migrations:**
```bash
cd backend
npx prisma migrate deploy
npx prisma generate
```

### Build Process

1. **Install dependencies:**
```bash
npm install
cd backend && npm install
cd ../frontend && npm install
```

2. **Build frontend:**
```bash
cd frontend
npm run build
```

3. **The build files will be in `frontend/dist/`**

### Server Configuration

#### Option 1: Serve frontend from backend
Move the built frontend files to the backend's public directory and serve them statically.

#### Option 2: Separate servers with nginx
Use nginx to serve the frontend and proxy API requests to the backend.

**nginx configuration example:**
```nginx
server {
    listen 80;
    server_name yourdomain.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl;
    server_name yourdomain.com;
    
    ssl_certificate /path/to/certificate.crt;
    ssl_certificate_key /path/to/private.key;
    
    # Frontend
    location / {
        root /path/to/frontend/dist;
        try_files $uri $uri/ /index.html;
    }
    
    # API
    location /api {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### Process Management

Use PM2 to manage the Node.js process:

1. **Install PM2:**
```bash
npm install -g pm2
```

2. **Create ecosystem file (ecosystem.config.js):**
```javascript
module.exports = {
  apps: [{
    name: 'taskshare-backend',
    script: './backend/dist/index.js',
    cwd: '/path/to/your/app',
    env: {
      NODE_ENV: 'production',
      PORT: 3001
    },
    instances: 'max',
    exec_mode: 'cluster',
    watch: false,
    max_memory_restart: '1G',
    error_file: './logs/err.log',
    out_file: './logs/out.log',
    log_file: './logs/combined.log',
    time: true
  }]
};
```

3. **Start with PM2:**
```bash
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

### Docker Deployment

#### Dockerfile for Backend
```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY backend/package*.json ./
RUN npm ci --only=production

COPY backend/ .
RUN npx prisma generate

EXPOSE 3001

CMD ["npm", "start"]
```

#### Dockerfile for Frontend
```dockerfile
FROM node:18-alpine as builder

WORKDIR /app
COPY frontend/package*.json ./
RUN npm ci

COPY frontend/ .
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80
```

#### docker-compose.yml
```yaml
version: '3.8'

services:
  postgres:
    image: postgres:15
    environment:
      POSTGRES_DB: taskshare
      POSTGRES_USER: taskshare_user
      POSTGRES_PASSWORD: secure_password
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"

  backend:
    build:
      context: .
      dockerfile: backend/Dockerfile
    environment:
      DATABASE_URL: postgresql://taskshare_user:secure_password@postgres:5432/taskshare
      JWT_SECRET: your-secure-secret
      FRONTEND_URL: http://localhost:3000
    ports:
      - "3001:3001"
    depends_on:
      - postgres

  frontend:
    build:
      context: .
      dockerfile: frontend/Dockerfile
    ports:
      - "3000:80"
    depends_on:
      - backend

volumes:
  postgres_data:
```

### Security Considerations

1. **Environment Variables:**
   - Use strong, random JWT secrets
   - Never commit .env files to version control
   - Use environment-specific configurations

2. **Database:**
   - Use connection pooling
   - Regular backups
   - Secure database credentials

3. **HTTPS:**
   - Always use HTTPS in production
   - Implement proper SSL/TLS configuration
   - Use security headers

4. **Rate Limiting:**
   - Implement rate limiting for API endpoints
   - Use tools like express-rate-limit

5. **Monitoring:**
   - Set up logging and monitoring
   - Use tools like Winston for logging
   - Monitor application performance

### Backup Strategy

1. **Database Backups:**
```bash
# Daily backup script
pg_dump -h localhost -U taskshare_user taskshare > backup_$(date +%Y%m%d).sql
```

2. **File Backups:**
   - Backup uploaded files (if any)
   - Backup configuration files
   - Version control for code

### Monitoring and Maintenance

1. **Health Checks:**
   - Implement health check endpoints
   - Monitor server resources
   - Set up alerts for downtime

2. **Updates:**
   - Regular security updates
   - Dependency updates
   - Database maintenance

3. **Logs:**
   - Centralized logging
   - Log rotation
   - Error tracking

### Troubleshooting

Common issues and solutions:

1. **Database Connection Issues:**
   - Check DATABASE_URL format
   - Verify database credentials
   - Ensure database is running

2. **CORS Issues:**
   - Verify FRONTEND_URL in backend .env
   - Check nginx proxy configuration

3. **JWT Issues:**
   - Verify JWT_SECRET is set
   - Check token expiration settings

4. **Build Issues:**
   - Clear node_modules and reinstall
   - Check Node.js version compatibility
   - Verify environment variables
