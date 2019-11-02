import * as jwt from 'jsonwebtoken';

export const authorization = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(401).send({ error: 'No token provided!' });
    }

    const parts = authHeader.split(' ');
    if (parts.length !== 2) {
        return res.status(401).send({ error: 'Invalid token!' });
    }

    const [bearer, token] = parts;

    if (!/^Bearer$/.test(bearer)) {
        return res.status(401).send({ error: 'Invalid token!' });
    }

    jwt.verify(token, process.env.JWT_KEY, (err, decoded) => {
        if (err) {
            return res.status(401).send({ error: 'Invalid token!' });
        }

        req.userId = decoded.id;

        return next();
    });

}