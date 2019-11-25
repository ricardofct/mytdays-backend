import { Router } from 'express';

import { authRoutes } from './authentication';
import { workersRoutes } from './workers';
import { vehiclesRoutes } from './vehicles';
import { invitesRoutes } from './invites';

export const routes = Router();

routes.get('/', async (req, res) => {
    return res.send('/ working!')
});

routes.use('/auth', authRoutes);
routes.use('/workers', workersRoutes);
routes.use('/vehicles', vehiclesRoutes);
routes.use('/invites', invitesRoutes);
