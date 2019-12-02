import { Router } from 'express';
import * as crypto from 'crypto';

import { authorization } from '../middleware/authorization';
import { Invite, IInviteDoc } from '../models/Invite';
import { sendInviteEmail } from '../modules/send-grid';
import { User, IUserDoc } from '../models/User';
import { EmailTypes } from '../contants';
import { Worker } from '../models/Worker';
import ErrorHelper from '../helpers/ErrorHelper';
import { Vehicle } from '../models/Vehicle';

export const workersRoutes = Router();

workersRoutes.use(authorization);

// Em uso
workersRoutes.get('/', async (req, res) => {
    try {
        const user: IUserDoc = req['user'];
        const findOpts = user.permissions.superhero ? {} : { ownerId: user._id }
        const workers = await Worker.find(findOpts).populate('vehicles').populate('userId').populate('ownerId').populate('updatedBy').populate('createdBy');

        return res.status(200).send({ workers })
    } catch (error) {
        return res.status(400).send({ error: ErrorHelper.getErrorMessage(error) })
    }
})

// Em uso
workersRoutes.post('/', async (req, res) => {
    try {
        const {
            ownerId,
            userId
        } = req.body;
        const user: IUserDoc = req['user'];

        if (!user.permissions.superhero) {
            return res.status(404).send('Sem permissões!');
        }

        if (ownerId === userId) {
            return res.status(404).send('Empresário e funcionário têm que ser diferentes!');
        }


        const userOwner = await User.findById(ownerId).populate('permissions');

        if (!userOwner || !userOwner.permissions.entrepreneur) {
            return res.status(404).send('Empresário não encontrado!');
        }
        const userWorker = await User.findById(userId);

        if (!userWorker) {
            return res.status(404).send('Funcionário não encontrado!');
        }

        const newWorker = new Worker({ ownerId, userId, createdBy: user._id, updatedBy: user._id });
        newWorker.save();

        return res.status(200).send(newWorker._id)
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

workersRoutes.get('/workdays', async (req, res) => {
    try {

    } catch (e) {
        return res.status(400).send({ error: ErrorHelper.getErrorMessage(e) });
    }
})

workersRoutes.get('/:id/workdays', async (req, res) => {
    try {

    } catch (e) {
        return res.status(400).send({ error: ErrorHelper.getErrorMessage(e) });
    }
})

workersRoutes.post('/:id/vehicles', async (req, res) => {
    try {
        const user: IUserDoc = req['user'];
        if (!user.permissions.entrepreneur) {
            return res.status(400).send('Sem permissões!');
        }

        const workerId = req.params.id;
        if (!workerId) {
            return res.status(404).send('Funcionário em falta!');
        }

        const worker = await Worker.findById(workerId);
        if (!worker) {
            return res.status(404).send('Funcionário não encontrado!');
        }

        if (!user.permissions.superhero && user._id !== worker.ownerId) {
            return res.status(400).send('Sem permissões!');
        }

        const { vehicleId } = req.body;
        if (!vehicleId) {
            return res.status(404).send('Veículo em falta!');
        }

        const vehicle = await Vehicle.findById(vehicleId);
        if (!vehicle) {
            return res.status(404).send('Veículo não encontrado!');
        }

        const vehicleAlreadyExist = worker.vehicles.includes(vehicle._id);
        if (vehicleAlreadyExist) {
            return res.status(404).send('Veículo já se encontra na lista do funcionário!');
        }

        worker.vehicles.push(vehicle._id)
        worker.updatedAt = new Date();
        worker.updatedBy = user._id;
        worker.save()

        return res.status(200).send();
    } catch (e) {
        return res.status(400).send({ error: ErrorHelper.getErrorMessage(e) });
    }
})

workersRoutes.get('/:id/vehicles', async (req, res) => {
    try {
        const user: IUserDoc = req['user'];
        if (!user.permissions.entrepreneur) {
            return res.status(400).send('Sem permissões!');
        }

        const workerId = req.params.id;
        if (!workerId) {
            return res.status(404).send('Funcionário em falta!');
        }

        const worker = await Worker.findById(workerId).populate('vehicles');
        if (!worker) {
            return res.status(404).send('Funcionário não encontrado!');
        }

        if (!user.permissions.superhero && user._id !== worker.ownerId) {
            return res.status(400).send('Sem permissões!');
        }

        const vehicles = worker.vehicles;

        return res.status(200).send({ vehicles });
    } catch (e) {
        return res.status(400).send({ error: ErrorHelper.getErrorMessage(e) });
    }
})

workersRoutes.delete('/:id/vehicle', async (req, res) => {
    try {
        const user: IUserDoc = req['user'];
        if (!user.permissions.entrepreneur) {
            return res.status(400).send('Sem permissões!');
        }

        const workerId = req.params.id;
        if (!workerId) {
            return res.status(404).send('Funcionário em falta!');
        }

        const worker = await Worker.findById(workerId);
        if (!worker) {
            return res.status(404).send('Funcionário não encontrado!');
        }

        if (!user.permissions.superhero && user._id !== worker.ownerId) {
            return res.status(400).send('Sem permissões!');
        }

        const { vehicleId } = req.body;
        if (!vehicleId) {
            return res.status(404).send('Veículo em falta!');
        }

        const vehicle = await Vehicle.findById(vehicleId);
        if (!vehicle) {
            return res.status(404).send('Veículo não encontrado!');
        }

        worker.vehicles = worker.vehicles.filter(vId => vId !== vehicleId)
        worker.updatedAt = new Date();
        worker.updatedBy = user._id;
        worker.save()

        return res.status(200).send();
    } catch (e) {
        return res.status(400).send({ error: ErrorHelper.getErrorMessage(e) });
    }
})