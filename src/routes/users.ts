import { Router } from 'express';
import * as mongoose from 'mongoose';

import { authorization } from '../middleware/authorization';
import { Invite, IInviteDoc } from '../models/Invite';
import { sendInviteEmail, sendForgotPasswordEmail } from '../modules/send-grid';
import { User, IUserDoc } from '../models/User';
import { EmailTypes } from '../contants';
import { Workday } from '../models/Workday';
import { Worker } from '../models/Worker';
import ErrorHelper from '../helpers/ErrorHelper';
import { Vehicle } from '../models/Vehicle';

export const usersRoutes = Router();

usersRoutes.use(authorization);

// Em uso
usersRoutes.get('/', async (req, res) => {
    try {
        const user: IUserDoc = req['user'];

        if (!user.permissions.superhero) {
            return res.status(400).send({ error: 'Sem permissões!' })
        }

        const users = await User.find({}).populate('permissions');

        return res.status(200).send({ users })
    } catch (error) {
        return res.status(400).send({ error: ErrorHelper.getErrorMessage(error) })
    }
})

// Em uso
usersRoutes.get('/entrepreneurs', async (req, res) => {
    try {
        const user: IUserDoc = req['user'];

        if (!user.permissions.superhero) {
            return res.status(400).send({ error: 'Sem permissões!' })
        }

        let users = await User.find({}).populate('permissions');

        users = users.filter(user => {
            console.log(JSON.stringify(user.permissions))
            return user.permissions.entrepreneur
        })

        return res.status(200).send({ users })
    } catch (error) {
        return res.status(400).send({ error: ErrorHelper.getErrorMessage(error) })
    }
})



usersRoutes.get('/:id/vehicles', async (req, res) => {
    try {
        const user: IUserDoc = req['user'];
        const userId = req.params.id;
        const { exclude } = req.body;

        if (!user.permissions.superhero && user._id !== userId) {
            return res.status(400).send({ error: 'Sem permissões!' })
        }

        let vehicles = await Vehicle.find({ ownerId: userId });

        if (exclude) {
            vehicles = vehicles.filter(vehicle => !exclude.includes(vehicle._id))
        }

        return res.status(200).send({ vehicles })
    } catch (error) {
        return res.status(400).send({ error: ErrorHelper.getErrorMessage(error) })
    }
})

usersRoutes.get('/:id/workers', async (req, res) => {
    try {
        const user: IUserDoc = req['user'];
        const userId = req.params.id;

        if (!user.permissions.superhero && user._id !== userId) {
            return res.status(400).send({ error: 'Sem permissões!' })
        }

        const workers = await Worker.find({ ownerId: userId }).populate('vehicles')
            .populate('userId').populate('ownerId').populate('updatedBy').populate('createdBy');

        return res.status(200).send({ workers })
    } catch (error) {
        return res.status(400).send({ error: ErrorHelper.getErrorMessage(error) })
    }
})
