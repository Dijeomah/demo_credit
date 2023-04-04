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
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
//Database file
const knexDb = require('../../../db/index');
class AuthenticationService {
    constructor() {
        this.db = knexDb;
    }
    register(name, email, password) {
        return __awaiter(this, void 0, void 0, function* () {
            const hashedPassword = yield bcrypt_1.default.hash(password, 10);
            const timestamp = Date.now();
            yield this.db('users').insert({
                name,
                email,
                password: hashedPassword,
                created_at: timestamp,
                updated_at: timestamp,
            });
        });
    }
    login(email, password) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this.db('users').where({ email }).first();
            if (!user) {
                throw new Error('Invalid email or password');
            }
            const validPassword = yield bcrypt_1.default.compare(password, user.password);
            if (!validPassword) {
                throw new Error('Invalid email or password');
            }
            return jsonwebtoken_1.default.sign({ id: user.id }, 'secret', { expiresIn: '10m' });
        });
    }
}
exports.default = AuthenticationService;
