import { Router } from 'express';

import { authorization } from '../middleware/authorization';

export const workersRoutes = Router();

workersRoutes.use(authorization);

workersRoutes.get('/', (req, res) => {
    return res.send({ id: req['userId'] })
})