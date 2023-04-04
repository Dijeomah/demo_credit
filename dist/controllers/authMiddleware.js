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
exports.authMiddleware = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const knex_1 = __importDefault(require("knex"));
// const knexDb:any = require('../../db/index');
const authMiddleware = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const token = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(' ')[1];
        if (!token) {
            return res.status(401).json({ message: 'Auth failed' });
        }
        const decodedToken = jsonwebtoken_1.default.verify(token, 'secret');
        const databaseInstance = (0, knex_1.default)({
            client: 'mysql',
            connection: {
                host: '127.0.0.1',
                port: 3306,
                user: 'root',
                password: '',
                database: 'demo_credit'
            }
        });
        const user = yield databaseInstance('users').where({ id: decodedToken.id }).first();
        if (!user) {
            return res.status(401).json({ message: 'Auth failed' });
        }
        // req.use = user;
        next();
    }
    catch (error) {
        return res.status(401).json({ message: 'Auth failed' });
    }
});
exports.authMiddleware = authMiddleware;
