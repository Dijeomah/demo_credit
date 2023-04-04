import express, {Request, Response, NextFunction, Application, ErrorRequestHandler} from 'express';
import {Server} from 'http';
import createHttpError from "http-errors";
import {config} from "dotenv";

import {authMiddleware} from './controllers/authMiddleware';

// @ts-ignore
import appStart from "./routes";

config();

const app: Application = express();

app.use(express.json());
app.get('/', (req: Request, res: Response, next: NextFunction) => {
    res.send('Hello from ts app');
});

appStart(app);

app.use((req: Request, res: Response, next: NextFunction) => {
    next(new createHttpError.NotFound())
});

const errorHandler: ErrorRequestHandler = (err, req: Request, res: Response, next: NextFunction) => {
    res.status(err.status || 500);
    res.send({
        status: err.status || 500,
        message: err.message,
    })
}

app.use((req: Request, res: Response, next: NextFunction) => {
    next(authMiddleware);
});

app.use(errorHandler);

const PORT: number = Number(process.env.PORT|| 3000)

const server: Server = app.listen(PORT , () => console.log(`Server is running on Port ${PORT}`));
