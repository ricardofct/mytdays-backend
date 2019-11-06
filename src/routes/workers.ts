import { Router } from 'express';
import * as crypto from 'crypto';

import { authorization } from '../middleware/authorization';
import { Invite, IInviteDoc } from '../models/Invite';
import { sendInviteEmail } from '../modules/send-grid';
import { User } from '../models/User';
import { EmailTypes } from '../contants';

export const workersRoutes = Router();

workersRoutes.use(authorization);

workersRoutes.get('/', (req, res) => {
    return res.send({ user: req['user'], token: req['token'] })
})

workersRoutes.post('/invite', async (req, res) => {
    const { email } = req.body;
    try {
        let emailType: number;

        const existedInvite = await Invite.findOne({ email });
        const now = new Date;
        if (existedInvite && existedInvite.expiresAt > now) {
            if (existedInvite.emailAlreadyExist) {
                emailType = EmailTypes.INVITE_TO_REGISTER;
            } else {
                emailType = EmailTypes.INVITE_TO_ACCEPT;
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

        if (invitedUser) {
            emailType = EmailTypes.INVITE_TO_ACCEPT;

            invite = new Invite({ owner: req['user'], invitedEmail: invitedUser.email, token, expiresAt })
            await invite.save();
        } else {
            emailType = EmailTypes.INVITE_TO_REGISTER;

            invite = new Invite({ owner: req['user'], invitedEmail: email, token, expiresAt })
            await invite.save();
        }
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