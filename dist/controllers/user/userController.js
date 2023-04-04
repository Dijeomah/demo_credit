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
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const node_localstorage_1 = require("node-localstorage");
const localStorage = new node_localstorage_1.LocalStorage('./scratch');
//Database file
const knexDb = require('../../../db/index');
class UserController {
    constructor() {
        // @ts-ignore
        this.db = knexDb;
    }
    getProfile(token) {
        return __awaiter(this, void 0, void 0, function* () {
            const decodedToken = jsonwebtoken_1.default.verify(token, 'secret');
            const user = yield this.db('users').where({ id: decodedToken.id }).first();
            localStorage.setItem('user_data', JSON.stringify(user));
            if (!user) {
                throw new Error('User not found');
            }
            return user;
        });
    }
}
exports.default = UserController;
