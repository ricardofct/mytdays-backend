import { Router } from 'express';
import * as crypto from 'crypto';

import { authorization } from '../middleware/authorization';
import { Invite, IInviteDoc } from '../models/Invite';
import { sendInviteEmail } from '../modules/send-grid';
import { User } from '../models/User';
import { EmailTypes } from '../contants';
import { Vehicle } from '../models/Vehicle';
import ErrorHelper from '../helpers/ErrorHelper';

export const vehiclesRoutes = Router();

vehiclesRoutes.use(authorization);

vehiclesRoutes.get('/', async (req, res) => {
    try {
        const user = req['user']
        const vehicles = await Vehicle.find({ ownerId: user._id, });

        return res.status(200).send({ vehicles });
    } catch (error) {
        return res.status(400).send({ error: ErrorHelper.getErrorMessage(error) });
    }
});

vehiclesRoutes.post('/', async (req, res) => {
    try {
        const user = req['user']
        const vehicle = new Vehicle({ ...req.body, ownerId: user._id, createdBy: user._id, updatedBy: user._id });
        await vehicle.save();
        return res.status(200).send(vehicle._id);
    } catch (error) {
        return res.status(400).send({ error: ErrorHelper.getErrorMessage(error) });
    }
});