import { Router } from 'express';
import * as crypto from 'crypto';

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

usersRoutes.get('/', async (req, res) => {
    try {
        const user: IUserDoc = req['user'];

        const users = await User.find({});

        return res.status(200).send({ users })
    } catch (error) {
        return res.status(400).send({ error: ErrorHelper.getErrorMessage(error) })
    }
})
