import { Router } from 'express';

import { authRoutes } from './authentication';
import { workersRoutes } from './workers';
import { carsRoutes } from './cars';

export const routes = Router();

routes.get('/', async (req, res) => {
    return res.send('/ working!')
});

routes.use('/auth', authRoutes);
routes.use('/workers', workersRoutes);
routes.use('/cars', carsRoutes);
