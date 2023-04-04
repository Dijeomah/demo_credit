import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import knex from 'knex';
import {json} from "body-parser";


//Database file
const knexDb:any = require('../../../db/index');

interface User {
    id: number;
    name: string;
    email: string;
    password: string
}

export default class AuthenticationService {

    // @ts-ignore
    private db: knex;

    constructor() {
        this.db = knexDb;
    }

    public async register(name: string, email: string, password: string): Promise<string> {
        const hashedPassword = await bcrypt.hash(password, 10);
        const timestamp = Date.now();
        await this.db<User>('users').insert({
            name,
            email,
            password: hashedPassword,
            created_at:timestamp,
            updated_at:timestamp,
        });
        return 'Registration Success';
    }

    public async login(email: string, password: string): Promise<string> {
        const user = await this.db('users').where({email}).first();

        if (!user) {
            throw new Error('Invalid email or password');
        }

        const validPassword = await bcrypt.compare(password, user.password);

        if (!validPassword) {
            throw new Error('Invalid email or password');
        }

        return jwt.sign({id: user.id}, 'secret', { expiresIn: '10m' });
    }

}
