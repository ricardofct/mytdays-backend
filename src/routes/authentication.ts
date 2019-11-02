import { Router } from 'express';
// import bcrypt from 'bcryptjs';

import { User } from '../models/User';

export const authRoutes = Router();

authRoutes.get('/', async (req, res) => {
    const users = await User.find({});
    return res.send(users);
});

authRoutes.post(
    '/register',
    async (req, res) => {
        try {
            const user = new User(req.body)
            await user.save()

            const token = await user.generateAuthToken()

            res.status(201).send({ token })
        } catch (error) {
            res.status(400).send({ error: error.message })
        }
    }
);

authRoutes.post(
    '/login',
    async (req, res) => {
        try {
            const { email, password } = req.body;
            const user = await User.findByCredentials(email, password);

            if (!user) {
                return res.status(401).send({ error: 'Login failed! Check authentication credentials' })
            }
            const token = await user.generateAuthToken()

            return res.status(200).send({ token })
        } catch (error) {
            return res.status(400).send({ error: error.message })
        }
    }
);