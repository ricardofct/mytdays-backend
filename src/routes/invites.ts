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

export const invitesRoutes = Router();

invitesRoutes.use(authorization);

// TODO implementar aceitar e rejeitar convite de trabalho
invitesRoutes.post('/:id/accepted', async (req, res) => { })
invitesRoutes.post('/:id/rejected', async (req, res) => { })
