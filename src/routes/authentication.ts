import { Router } from 'express';
import * as crypto from 'crypto';

import { User } from '../models/User';
import { sendMail } from '../modules/mail';
import { Invite } from '../models/Invite';
import { sendInviteEmail, sendForgotPasswordEmail } from '../modules/send-grid';

export const authRoutes = Router();

authRoutes.post('/register', async (req, res) => {
    try {
        const inviteToken = req.query.inviteToken;

        if (inviteToken) {
            const invite = await Invite.findOne({ token: inviteToken });

            if (!invite) {
                return res.status(404).send({ error: 'Token inválido!' })
            }

            const now = new Date();
            if (invite.expiresAt < now) {
                return res.status(404).send({ error: 'Token expirado!' })
            }
        }

        const user = new User(req.body)
        await user.save()

        const token = await user.generateAuthToken()

        return res.status(201).send({ token })
    } catch (error) {
        return res.status(400).send({ error: error.message })
    }
});

authRoutes.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findByCredentials(email, password);

        if (!user) {
            return res.status(401).send({ error: 'Email ou senha inválidos!' })
        }
        const token = await user.generateAuthToken()

        return res.status(200).send({ token })
    } catch (error) {
        return res.status(400).send({ error: error.message })
    }
});

authRoutes.post('/forgot_password', async (req, res) => {
    const { email } = req.body;

    try {
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).send({ error: 'Erro ao recuperar senha!' });
        }

        const token = crypto.randomBytes(20).toString('hex');

        const now = new Date();
        now.setHours(now.getHours() + 1)

        user.set({
            passwordResetToken: token,
            passwordResetExpires: now
        })

        await user.save();

        sendForgotPasswordEmail(user.email, token);

        return res.status(202).send();

    } catch (e) {
        return res.status(400).send({ error: 'Erro ao recuperar senha!' });
    }
});

authRoutes.post('/reset_password', async (req, res) => {
    const { email, token, password } = req.body;
    try {
        const user = await User.findOne({ email }).select('+passwordResetToken passwordResetExpires');

        if (!user) {
            return res.status(400).send({ error: 'Erro ao recuperar senha!' });
        }

        if (token !== user.passwordResetToken) {
            return res.status(400).send({ error: 'Token inválido!' });
        }

        const now = new Date();
        if (now > user.passwordResetExpires) {
            return res.status(400).send({ error: 'Token expirou!' });
        }

        user.set({
            password
        });

        await user.save();
    } catch (e) {
        return res.status(400).send({ error: 'Erro ao recuperar senha!' });
    }
});

