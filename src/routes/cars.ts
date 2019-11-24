import { Router } from 'express';
import * as crypto from 'crypto';

import { authorization } from '../middleware/authorization';
import { Invite, IInviteDoc } from '../models/Invite';
import { sendInviteEmail } from '../modules/send-grid';
import { User } from '../models/User';
import { EmailTypes } from '../contants';
import { Car } from '../models/Car';
import ErrorHelper from '../helpers/ErrorHelper';

export const carsRoutes = Router();

carsRoutes.use(authorization);

carsRoutes.get('/', async (req, res) => {
    try {
        const user = req['user']
        const cars = await Car.find({ ownerId: user._id, });

        return res.status(200).send({ cars });
    } catch (error) {
        return res.status(400).send({ error: ErrorHelper.getErrorMessage(error) });
    }
});

carsRoutes.post('/', async (req, res) => {
    try {
        const user = req['user']
        const car = new Car({ ...req.body, ownerId: user._id, createdBy: user._id, updatedBy: user._id });
        await car.save();
        return res.status(200).send(car._id);
    } catch (error) {
        return res.status(400).send({ error: ErrorHelper.getErrorMessage(error) });
    }
});