import express from 'express';
import swaggerUi from 'swagger-ui-express';
import YAML from 'yamljs';

const router = express.Router();

// IMPORTANT: use absolute-safe path
const swaggerDocument = YAML.load(process.cwd() + '/swagger.yaml');

// DO NOT nest router.use('/')
router.use(swaggerUi.serve);
router.get('/', swaggerUi.setup(swaggerDocument));

export default router;