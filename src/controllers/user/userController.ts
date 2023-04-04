import jwt from 'jsonwebtoken';
import knex from 'knex';
import {LocalStorage} from 'node-localstorage';


const localStorage = new LocalStorage('./scratch');

//Database file
const knexDb:any = require('../../../db/index');

interface User {
    id: number;
    name: string;
    email: string;
    password: string
}

export default class UserController {

    // @ts-ignore
    private db: knex;

    constructor() {
        // @ts-ignore
        this.db = knexDb;
    }

    public async getProfile(token: string): Promise<User> {
        const decodedToken = jwt.verify(token, 'secret') as { id: number };

        const user = await this.db<User>('users').where({id: decodedToken.id}).first();

        localStorage.setItem('user_data', JSON.stringify(user));

        if (!user) {
            throw new Error('User not found');
        }
        return user;
    }

    // const logout = (req: Request, res: Response, next: NextFunction) => {
    //
    // }
}
