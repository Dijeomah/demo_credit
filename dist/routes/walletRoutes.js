"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const walletController_1 = __importDefault(require("../controllers/user/walletController"));
const walletController = new walletController_1.default();
const app = (0, express_1.default)();
app.use(express_1.default.json());
const walletRoutes = express_1.default.Router();
walletRoutes.post('/wallet/createWallet', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const token = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(' ')[1];
    try {
        // @ts-ignore
        const userWallet = yield walletController.createWallet(token);
        res.send(userWallet);
    }
    catch (error) {
        res.status(400).send(error.message);
    }
}));
walletRoutes.post('/wallet/fundWallet', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _b;
    const { amount } = req.body;
    const token = (_b = req.headers.authorization) === null || _b === void 0 ? void 0 : _b.split(' ')[1];
    try {
        const walletInfo = yield walletController.fundWallet(token, amount);
        res.send({ walletInfo });
    }
    catch (error) {
        res.status(400).send(error.message);
    }
}));
walletRoutes.get('/wallet/balance', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _c;
    const token = (_c = req.headers.authorization) === null || _c === void 0 ? void 0 : _c.split(' ')[1];
    try {
        const walletInfo = yield walletController.walletBalance(token);
        res.send({ walletInfo });
    }
    catch (error) {
        res.status(400).send(error.message);
    }
}));
walletRoutes.get('/wallet/transactions', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _d;
    const token = (_d = req.headers.authorization) === null || _d === void 0 ? void 0 : _d.split(' ')[1];
    try {
        const walletInfo = yield walletController.walletTransactions(token);
        res.send({ walletInfo });
    }
    catch (error) {
        res.status(400).send(error.message);
    }
}));
walletRoutes.post('/wallet/transferFund/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _e;
    const id = req.params.id;
    const { amount } = req.body;
    const token = (_e = req.headers.authorization) === null || _e === void 0 ? void 0 : _e.split(' ')[1];
    try {
        const transferFund = yield walletController.transferFund(token, amount, id);
        res.send({ transferFund });
    }
    catch (error) {
        res.status(400).send(error.message);
    }
}));
walletRoutes.post('/wallet/withdrawFund', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _f;
    const { amount } = req.body;
    const token = (_f = req.headers.authorization) === null || _f === void 0 ? void 0 : _f.split(' ')[1];
    try {
        const withdrawFund = yield walletController.withdrawFund(token, amount);
        res.send({ withdrawFund });
    }
    catch (error) {
        res.status(400).send(error.message);
    }
}));
exports.default = walletRoutes;
