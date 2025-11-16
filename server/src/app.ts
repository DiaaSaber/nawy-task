import express, { Application } from 'express';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';
import swaggerSpec from './config/swagger';
import healthRoutes from './routes/healthRoutes';
import apartmentRoutes from './routes/apartmentRoutes';
import errorHandler from './middleware/errorHandler';

const createApp = (): Application => {
  const app = express();

  // Middlewares
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Simple request logging
  app.use((req, res, next) => {
    console.log(`${req.method} ${req.path}`);
    next();
  });

  // Routes
  app.use('/api/health', healthRoutes);
  app.use('/api/apartments', apartmentRoutes);

  // Swagger documentation
  app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

  // Error handler (must be last)
  app.use(errorHandler);

  return app;
};

export default createApp;
