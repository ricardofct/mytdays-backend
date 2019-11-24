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
import { Car } from '../models/Car';

export const workersRoutes = Router();

workersRoutes.use(authorization);

workersRoutes.get('/', async (req, res) => {
    try {
        const user: IUserDoc = req['user'];
        const cars = await Car.find({ ownerId: user._id }).select('_id');

        if (!cars.length) {
            return res.status(404).send('Crie os seus carros associar empregados!');
        }

        const workers = await Worker.find({ carId: cars }).populate('carId').populate('workerId');

        return res.status(200).send({ workers })
    } catch (error) {
        return res.status(400).send({ error: ErrorHelper.getErrorMessage(error) })
    }
})

workersRoutes.post('/', async (req, res) => {
    try {
        const {
            workerId,
            carId
        } = req.body;
        const user: IUserDoc = req['user'];

        const worker = new Worker({ workerId, carId, createdBy: user._id, updatedBy: user._id });
        worker.save();

        return res.status(200).send(worker._id)
    } catch (error) {
        return res.status(400).send({ error: ErrorHelper.getErrorMessage(error) })
    }
})

workersRoutes.post('/workday', async (req, res) => {
    try {
        const {
            carId,
            inDate,
            outDate
        } = req.body;
        const user: IUserDoc = req['user'];

        const worker = await Worker.findOne({ workerId: user._id, carId, active: true });

        if (!worker) {
            return res.status(404).send({ error: 'Empregado não encontrado!' })
        }

        if (inDate > outDate) {
            return res.status(400).send({ error: 'Data de entrada tem de ser inferior à de saída!' })
        }

        const workday = new Workday({ ...req.body, workerId: user._id });
        await workday.save();

        return res.status(200).send()
    } catch (error) {
        return res.status(400).send({ error: ErrorHelper.getErrorMessage(error) })
    }
})

workersRoutes.post('/invite', async (req, res) => {
    const { email } = req.body;
    try {
        let emailType: number;

        const existedInvite = await Invite.findOne({ email });
        const now = new Date;

        // Valida se convite já existe
        if (existedInvite && existedInvite.expiresAt > now) {
            if (existedInvite.emailAlreadyExist) {
                emailType = EmailTypes.INVITE_TO_ACCEPT;
            } else {
                emailType = EmailTypes.INVITE_TO_REGISTER;
            }

            sendInviteEmail(emailType, existedInvite);

            const { invitedEmail, sented, error, status } = existedInvite;
            return res.status(202).send({
                invite: {
                    invitedEmail, sented, error, status
                }
            });
        }

        const token = crypto.randomBytes(20).toString('hex');

        const expiresAt = new Date();
        expiresAt.setHours(expiresAt.getHours() + 24);

        const invitedUser = await User.findOne({ email });

        let invite: IInviteDoc;

        // Valida se email já existe
        if (invitedUser) {
            emailType = EmailTypes.INVITE_TO_ACCEPT;

            invite = new Invite({ owner: req['user'], invitedEmail: invitedUser.email, token, expiresAt, emailAlreadyExist: true })
        } else {
            emailType = EmailTypes.INVITE_TO_REGISTER;

            invite = new Invite({ owner: req['user'], invitedEmail: email, token, expiresAt })
        }

        await invite.save();
        sendInviteEmail(emailType, invite);

        const { invitedEmail, sented, error, status } = invite;

        return res.status(202).send({
            invite: {
                invitedEmail, sented, error, status
            }
        });
    } catch (e) {
        return res.status(400).send({ error: 'Erro ao enviar convite!', e });
    }
});