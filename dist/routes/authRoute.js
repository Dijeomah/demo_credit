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
const authenticationService_1 = __importDefault(require("../controllers/auth/authenticationService"));
const node_localstorage_1 = require("node-localstorage");
const localStorage = new node_localstorage_1.LocalStorage('./scratch');
const app = (0, express_1.default)();
app.use(express_1.default.json());
const authService = new authenticationService_1.default();
const authRoutes = express_1.default.Router();
authRoutes.post('/register', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, email, password } = req.body;
    yield authService.register(name, email, password);
    res.status(201).send();
}));
authRoutes.post('/login', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    try {
        const token = yield authService.login(email, password);
        res.cookie('jwt', token, { httpOnly: true });
        res.send({ token });
        localStorage.setItem('user_access_token', token);
    }
    catch (error) {
        res.status(400).send(error.message);
    }
}));
exports.default = authRoutes;
