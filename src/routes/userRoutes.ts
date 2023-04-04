import express, {Request, Response, NextFunction, Application, ErrorRequestHandler} from 'express';
import {LocalStorage} from 'node-localstorage';
import UserController from '../controllers/user/userController';

const localStorage = new LocalStorage('./scratch');
const userController = new UserController();


const app: Application = express();
app.use(express.json());

const userRoutes = express.Router();

userRoutes.get('/user', async (req: Request, res: Response) => {
    const token = req.headers.authorization?.split(' ')[1];

    try {
        // @ts-ignore
        const user = await userController.getProfile(token);
        console.log(localStorage.getItem('user_data'));
        res.send(user);
    } catch (error: any) {
        res.status(400).send(error.message);
    }
});

export default userRoutes;
