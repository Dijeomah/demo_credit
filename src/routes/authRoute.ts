import express, {Request, Response, NextFunction, Application, ErrorRequestHandler} from 'express';
import AuthenticationService from "../controllers/auth/authenticationService";
import {LocalStorage} from 'node-localstorage';


const localStorage = new LocalStorage('./scratch');
const app: Application = express();
app.use(express.json());

const authService = new AuthenticationService();

const authRoutes = express.Router();

authRoutes.post('/register', async (req: Request, res: Response, next: NextFunction) => {
    const {name, email, password} = req.body;
    await authService.register(name, email, password);
    res.status(201).send();
});

authRoutes.post('/login', async (req: Request, res: Response, next: NextFunction) => {
    const {email, password} = req.body;
    try {
        const token = await authService.login(email, password);
        res.cookie('jwt', token, { httpOnly: true });
        res.send({token});
        localStorage.setItem('user_access_token', token);
    } catch (error: any) {
        res.status(400).send(error.message);
    }
});

export default authRoutes;
