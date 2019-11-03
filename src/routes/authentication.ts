import { Router } from 'express';
// import bcrypt from 'bcryptjs';
import * as crypto from 'crypto';

import { User } from '../models/User';
import { sendMail } from '../modules/mail';

export const authRoutes = Router();

authRoutes.post('/register', async (req, res) => {
    try {
        const user = new User(req.body)
        await user.save()

        const token = await user.generateAuthToken()

        res.status(201).send({ token })
    } catch (error) {
        res.status(400).send({ error: error.message })
    }
});

authRoutes.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findByCredentials(email, password);

        if (!user) {
            return res.status(401).send({ error: 'Credenciais inválidas!' })
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

        // await User.findOneAndUpdate(user.id, {
        //     '$set': {
        //         passwordResetToke: token,
        //         passwordResetExpires: now
        //     }
        // })

        await sendMail('', token).catch(err => res.status(400).send({ error: 'Erro ao recuperar senha!' }))

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
            return res.status(400).send({ error: 'Token invalido!' });
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