import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import swaggerUi from 'swagger-ui-express';
import swaggerJsdoc from 'swagger-jsdoc';
import { authRoutes } from './routes/auth';
import { listRoutes } from './routes/lists';
import { taskRoutes } from './routes/tasks';
import { commentRoutes } from './routes/comments';
import { errorHandler } from './middleware/errorHandler';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());

// Swagger Documentation
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'TaskShare API',
      version: '1.0.0',
      description: 'API for TaskShare application',
    },
    servers: [
      {
        url: `http://localhost:${PORT}/api`,
        description: 'Development server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
      schemas: {
        User: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              format: 'uuid',
            },
            name: {
              type: 'string',
            },
            email: {
              type: 'string',
              format: 'email',
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
            },
          },
        },
      },
    },
  },
  apis: ['./src/config/swagger-docs.ts'],
};

// Swagger setup
const swaggerSpec = swaggerJsdoc(swaggerOptions);

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/lists', listRoutes);
app.use('/api', taskRoutes);
app.use('/api', commentRoutes);

// Swagger API Documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
  explorer: true,
  customSiteTitle: 'TaskShare API Documentation',
  customfavIcon: '/favicon.ico',
  customCss: '.swagger-ui .topbar { display: none }', // Remove barra superior
  swaggerOptions: {
    docExpansion: 'list',  // Expande os endpoints automaticamente
    filter: false,        // Remove filtro por tag
    showExtensions: false, // Remove os asteriscos (extensões)
    displayRequestDuration: true, // Mostra duração das requisições
    operationsSorter: 'alpha', // Ordena operações alfabeticamente
    tagsSorter: 'alpha',   // Ordena tags alfabeticamente
    defaultModelsExpandDepth: 1, // Expande schemas
    defaultModelExpandDepth: 1,
    url: '/api-docs/swagger.json' // URL do spec JSON
  }
}));

// API info endpoint for non-browser clients
app.get('/api-info', (req, res) => {
  res.json({ 
    message: 'TaskShare API',
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth',
      lists: '/api/lists',
      tasks: '/api/tasks',
      comments: '/api/comments'
    }
  });
});

// Root route - API information
app.get('/', (req, res) => {
  res.json({
    name: 'TaskShare API',
    version: '1.0.0',
    description: 'Collaborative task management API',
    endpoints: {
      documentation: '/api-docs',
      health: '/health',
      auth: '/api/auth',
      lists: '/api/lists',
      tasks: '/api/tasks',
      comments: '/api/tasks/:taskId/comments'
    },
    examples: {
      'Get all lists': 'GET /api/lists',
      'Create list': 'POST /api/lists',
      'Get list tasks': 'GET /api/lists/:id/tasks',
      'Toggle task': 'PATCH /api/tasks/:id/toggle'
    }
  });
});

// Error handling
app.use(errorHandler);

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📱 Frontend URL: ${process.env.FRONTEND_URL}`);
  console.log(`📝 API Documentation: http://localhost:${PORT}/api-docs`);
});