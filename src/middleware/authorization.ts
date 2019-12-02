import * as jwt from 'jsonwebtoken';
import { User } from '../models/User';
import { Permissions } from '../models/Permission';
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
        }).populate('permissions')

        if (!user) {
            return res.status(404).send({ error: 'Utilizador não encontrado!' });
        }

        // const permissions = await Permissions.findById(user.permissions);

        // if (!permissions) {
        //     return res.status(401).send({ error: 'Utilizador sem permissões!' });
        // }

        // req.permissions = permissions;
        req.user = user;
        req.token = token;

        return next();
    });

}