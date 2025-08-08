import express from 'express';
import cors from 'cors';
import routes from '@adapters/controllers/routes';
import errorHandler from '@infra/middlewares/errorHandler';
import swaggerUi from 'swagger-ui-express';
import { swaggerSpecs } from '@config/swagger';

const app = express();

app.use(express.json());
app.use(cors());

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpecs));
app.use('/v1', routes); 

app.use(errorHandler);

app.listen(3000, () => {
    console.log('Documentação em http://localhost:8081/api-docs');
  });


export default app;