import { Router } from 'express';
import { connect, users } from './db';
import { Db } from 'mongodb';

export const routes = Router();

routes.get(
    '/',
    (req, res) => {
        return res.send('/ working!');
    }
);

routes.get(
    '/workers',
    async (req, res) => {
        console.log('/a working!');
        try {
            return res.send(await connect(async (mongodb: Db) => await users(mongodb).find({}).toArray()));
        } catch (e) {
            return res.send(e);
        }
    }
);



