import { Router } from 'express';
import * as crypto from 'crypto';

import { authorization } from '../middleware/authorization';
import { Invite, IInviteDoc } from '../models/Invite';
import { sendInviteEmail } from '../modules/send-grid';
import { User, IUserDoc } from '../models/User';
import { EmailTypes } from '../contants';
import { Vehicle } from '../models/Vehicle';
import ErrorHelper from '../helpers/ErrorHelper';

export const vehiclesRoutes = Router();

vehiclesRoutes.use(authorization);

// Em uso
vehiclesRoutes.get('/', async (req, res) => {
    try {
        const user = req['user']
        const findOpts = user.permissions.superhero ? {} : { ownerId: user._id };
        const vehicles = await Vehicle.find(findOpts).populate('ownerId').populate('createdBy').populate('updatedBy');

        return res.status(200).send({ vehicles });
    } catch (error) {
        return res.status(400).send({ error: ErrorHelper.getErrorMessage(error) });
    }
});

// Em uso
vehiclesRoutes.post('/', async (req, res) => {
    try {
        const user = req['user']
        const { name,
            plate,
            plateDate,
            ownerId } = req.body;

        const vehicle = new Vehicle({
            name,
            plate,
            plateDate,
            createdBy: user._id,
            updatedBy: user._id
        });

        vehicle.ownerId = user.permissions.superhero && ownerId ? ownerId : user._id;

        await vehicle.save();
        return res.status(200).send(vehicle._id);
    } catch (error) {
        return res.status(400).send({ error: ErrorHelper.getErrorMessage(error) });
    }
});

vehiclesRoutes.put('/:id', async (req, res) => {
    try {
        const user: IUserDoc = req['user']

        const vehicleId = req.params['id'];
        if (!vehicleId) {
            return res.status(400).send({ error: 'Veículo em falta!' })
        }

        const vehicle = await Vehicle.findById(vehicleId);
        if (!user.permissions.superhero && user._id !== vehicle.ownerId) {
            return res.status(400).send({ error: 'Sem permissões para efetuar esta acção!' })
        }

        const { name,
            plate,
            plateDate,
            active } = req.body;

        if (name) {
            vehicle.name = name;
        }
        if (plate) {
            vehicle.plate = plate;
        }
        if (plateDate) {
            vehicle.plateDate = plateDate;
        }
        if (active !== undefined && active !== null) {
            vehicle.active = active;
        }
        vehicle.updatedAt = new Date();
        vehicle.updatedBy = user._id;

        await vehicle.save();
        return res.status(200).send();
    } catch (error) {
        return res.status(400).send({ error: ErrorHelper.getErrorMessage(error) });
    }
});

vehiclesRoutes.delete('/:id', async (req, res) => {
    try {
        const user: IUserDoc = req['user']

        const vehicleId = req.params['id'];
        if (!vehicleId) {
            return res.status(400).send({ error: 'Veículo em falta!' })
        }

        const vehicle = await Vehicle.findById(vehicleId);

        vehicle.active = false;
        vehicle.updatedAt = new Date();
        vehicle.updatedBy = user._id;

        await vehicle.save();
        return res.status(200).send();
    } catch (error) {
        return res.status(400).send({ error: ErrorHelper.getErrorMessage(error) });
    }
});