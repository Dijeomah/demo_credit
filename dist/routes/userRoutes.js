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
const node_localstorage_1 = require("node-localstorage");
const userController_1 = __importDefault(require("../controllers/user/userController"));
const localStorage = new node_localstorage_1.LocalStorage('./scratch');
const userController = new userController_1.default();
const app = (0, express_1.default)();
app.use(express_1.default.json());
const userRoutes = express_1.default.Router();
userRoutes.get('/user', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const token = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(' ')[1];
    try {
        // @ts-ignore
        const user = yield userController.getProfile(token);
        console.log(localStorage.getItem('user_data'));
        res.send(user);
    }
    catch (error) {
        res.status(400).send(error.message);
    }
}));
userRoutes.post('/logout', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _b;
    const token = (_b = req.headers.authorization) === null || _b === void 0 ? void 0 : _b.split(' ')[1];
    res.cookie('jwt', token, { httpOnly: true });
    res.json({ message: 'Successfully signed out' });
}));
exports.default = userRoutes;
