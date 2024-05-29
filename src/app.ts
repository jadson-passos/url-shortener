import express from 'express';
import cors from 'cors';
import { authRoutes } from './routes/authRoutes';
import { urlRoutes } from './routes/urlRoutes';
import swaggerUI from 'swagger-ui-express';
import swaggerDocs from '../swagger.json'

const app = express();

app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerDocs))

app.use(express.json());

app.use(cors());

app.use(authRoutes);

app.use(urlRoutes);

export { app };
