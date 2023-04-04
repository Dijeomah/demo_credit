import {NextFunction, Request, Response} from 'express';
import jwt from 'jsonwebtoken';
import knex from "knex";

// const knexDb:any = require('../../db/index');

export const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) {
            return res.status(401).json({ message: 'Auth failed' });
        }
        const decodedToken = jwt.verify(token, 'secret') as { id: number };
        const databaseInstance = knex({
            client: 'mysql',
            connection: {
                host : '127.0.0.1',
                port : 3306,
                user : 'root',
                password : '',
                database : 'demo_credit'
            }
        });
        const user = await databaseInstance('users').where({ id: decodedToken.id}).first();
        if (!user) {
            return res.status(401).json({ message: 'Auth failed' });
        }
        // req.use = user;
        next();
    } catch (error) {
        return res.status(401).json({ message: 'Auth failed' });
    }
};
