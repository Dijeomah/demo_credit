import express, {Request, Response, NextFunction, Application, ErrorRequestHandler} from 'express';
import WalletController from '../controllers/user/walletController';

const walletController = new WalletController();

const app: Application = express();
app.use(express.json());

const walletRoutes = express.Router();

walletRoutes.post('/wallet/createWallet', async (req: Request, res: Response) => {
    const token = req.headers.authorization?.split(' ')[1];

    try {
        // @ts-ignore
        const userWallet = await walletController.createWallet(token);
        res.send(userWallet);
    } catch (error: any) {
        res.status(400).send(error.message);
    }
});

walletRoutes.post('/wallet/fundWallet', async (req: Request, res: Response) => {
    const {amount} = req.body;
    const token = req.headers.authorization?.split(' ')[1];

    try {
        const walletInfo = await walletController.fundWallet(token, amount);

        res.send({walletInfo});
    } catch (error: any) {
        res.status(400).send(error.message);
    }
});

walletRoutes.get('/wallet/balance', async (req: Request, res: Response) => {
    const token = req.headers.authorization?.split(' ')[1];

    try {
        const walletInfo = await walletController.walletBalance(token);
        res.send({walletInfo});
    } catch (error: any) {
        res.status(400).send(error.message);
    }
});

walletRoutes.get('/wallet/transactions', async (req: Request, res: Response) => {
    const token = req.headers.authorization?.split(' ')[1];

    try {
        const walletInfo = await walletController.walletTransactions(token);
        res.send({walletInfo});
    } catch (error: any) {
        res.status(400).send(error.message);
    }
});


walletRoutes.post('/wallet/transferFund/:id', async (req: Request, res: Response) => {
    const id = req.params.id;
    const {amount} = req.body;
    const token = req.headers.authorization?.split(' ')[1];

    try {
        const transferFund = await walletController.transferFund(token, amount, id);

        res.send({transferFund});
    } catch (error: any) {
        res.status(400).send(error.message);
    }
});

walletRoutes.post('/wallet/withdrawFund', async (req: Request, res: Response) => {
    const {amount} = req.body;
    const token = req.headers.authorization?.split(' ')[1];

    try {
        const withdrawFund = await walletController.withdrawFund(token, amount);

        res.send({withdrawFund});
    } catch (error: any) {
        res.status(400).send(error.message);
    }
});

export default walletRoutes;
