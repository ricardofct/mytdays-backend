import * as jwt from 'jsonwebtoken';
import { User } from '../models/User';

export const authorization = async (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(401).send({ error: 'Nenhum token encontrado!' });
    }

    const parts = authHeader.split(' ');
    if (parts.length !== 2) {
        return res.status(401).send({ error: 'Token invalido!' });
    }

    const [bearer, token] = parts;

    if (!/^Bearer$/.test(bearer)) {
        return res.status(401).send({ error: 'Token invalido!' });
    }

    jwt.verify(token, process.env.JWT_KEY, async (err, decoded) => {
        if (err) {
            return res.status(401).send({ error: 'Token invalido!' });
        }

        const user = await User.findOne({
            _id: decoded.id,
            'tokens.token': token
        })

        if (!user) {
            return res.status(401).send({ error: 'Utilizador não encontrado!' });
        }

        req.user = user;
        req.token = token;

        return next();
    });

}