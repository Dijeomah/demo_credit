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
class WalletController {
    constructor() {
        // @ts-ignore
        this.db = knexDb;
    }
    createWallet(token) {
        return __awaiter(this, void 0, void 0, function* () {
            const decodedToken = jsonwebtoken_1.default.verify(token, 'secret');
            //check the logged in token
            let localToken = localStorage.getItem('user_access_token');
            if (token !== localToken) {
                throw new Error('Access denied');
            }
            const userData = yield this.db('users').where({ id: decodedToken.id }).first();
            if (!userData) {
                throw new Error('User not found');
            }
            let user_id = userData.id;
            const userWalletData = yield this.db('wallets').where({ user_id: user_id }).first();
            if (userWalletData) {
                throw new Error('Wallet already created.');
            }
            const timestamp = Date.now();
            yield this.db('wallets').insert({ user_id, created_at: timestamp, updated_at: timestamp });
            return ['User: ' + userData, 'Message: Wallet created'];
        });
    }
    fundWallet(token, amount) {
        return __awaiter(this, void 0, void 0, function* () {
            const decodedToken = jsonwebtoken_1.default.verify(token, 'secret');
            //check the logged in token
            let localToken = localStorage.getItem('user_access_token');
            if (token !== localToken) {
                throw new Error('Access denied');
            }
            const userData = yield this.db('users').where({ id: decodedToken.id }).first();
            if (!userData) {
                throw new Error('User not found');
            }
            //check if the amount is numerical
            if (isNaN(amount)) {
                return ['Invalid amount type'];
            }
            let user_u_id = userData.id;
            const walletData = yield this.db('wallets').where({ user_id: user_u_id }).first();
            let new_balance = walletData.main_balance + amount;
            console.log(Number(new_balance).toFixed(2));
            const timestamp = Date.now();
            yield this.db('wallets').where({ user_id: user_u_id }).update({
                amount: amount,
                main_balance: new_balance,
                prev_balance: walletData.main_balance,
                updated_at: timestamp,
            });
            yield this.db('transactions').insert({
                user_id: user_u_id,
                transaction_type: 'funding',
                amount: amount,
                main_balance: new_balance,
                prev_balance: walletData.main_balance,
                created_at: timestamp,
                updated_at: timestamp,
            });
            return ['Account Funded with : ' + amount, 'Wallet Balance: ' + new_balance];
        });
    }
    walletBalance(token) {
        return __awaiter(this, void 0, void 0, function* () {
            const decodedToken = jsonwebtoken_1.default.verify(token, 'secret');
            //check the logged in token
            let localToken = localStorage.getItem('user_access_token');
            if (token !== localToken) {
                throw new Error('Access denied');
            }
            const userData = yield this.db('users').where({ id: decodedToken.id }).first();
            if (!userData) {
                throw new Error('User not found');
            }
            let user_u_id = userData.id;
            const walletData = yield this.db('wallets').where({ user_id: user_u_id }).first();
            return walletData.main_balance;
        });
    }
    walletTransactions(token) {
        return __awaiter(this, void 0, void 0, function* () {
            const decodedToken = jsonwebtoken_1.default.verify(token, 'secret');
            //check the logged in token
            let localToken = localStorage.getItem('user_access_token');
            if (token !== localToken) {
                throw new Error('Access denied');
            }
            const userData = yield this.db('users').where({ id: decodedToken.id }).first();
            if (!userData) {
                throw new Error('User not found');
            }
            let user_u_id = userData.id;
            const transactionHistory = yield this.db('transactions').select('*').where({ user_id: user_u_id });
            return transactionHistory;
        });
    }
    transferFund(token, amount, id) {
        return __awaiter(this, void 0, void 0, function* () {
            const decodedToken = jsonwebtoken_1.default.verify(token, 'secret');
            //check the logged in token
            let localToken = localStorage.getItem('user_access_token');
            if (token !== localToken) {
                throw new Error('Access denied');
            }
            //fetch current user data
            const userData = yield this.db('users').where({ id: decodedToken.id }).first();
            //fetch receiver data
            const receiverData = yield this.db('users').where({ id: id }).first();
            if (!userData) {
                throw new Error('User not found');
            }
            if (!receiverData) {
                throw new Error('Receiver not found');
            }
            let user_u_id = userData.id;
            let receiver_u_id = receiverData.id;
            //fetch current user wallet
            const userWalletData = yield this.db('wallets').where({ user_id: user_u_id }).first();
            const receiverWalletData = yield this.db('wallets').where({ user_id: receiver_u_id }).first();
            //check if the user have enough fund
            if (userWalletData.main_balance < amount) {
                return ['Balance is low'];
            }
            if (isNaN(amount)) {
                return ['Invalid amount type'];
            }
            // return receiverWalletData;
            let new_user_balance = userWalletData.main_balance - amount;
            let new_receiver_balance = receiverWalletData.main_balance + amount;
            console.log(Number(new_user_balance).toFixed(2));
            const timestamp = Date.now();
            yield this.db('wallets').where({ user_id: user_u_id }).update({
                amount: amount,
                main_balance: new_user_balance,
                prev_balance: userWalletData.main_balance,
                updated_at: timestamp,
            });
            yield this.db('wallets').where({ user_id: receiver_u_id }).update({
                amount: amount,
                main_balance: new_receiver_balance,
                prev_balance: receiverWalletData.main_balance,
                updated_at: timestamp,
            });
            yield this.db('transactions').insert({
                user_id: user_u_id,
                amount: amount,
                transaction_type: 'transfer_debit',
                main_balance: new_user_balance,
                prev_balance: userWalletData.main_balance,
                created_at: timestamp,
                updated_at: timestamp,
            });
            yield this.db('transactions').insert({
                user_id: receiver_u_id,
                amount: amount,
                transaction_type: 'transfer_credit',
                main_balance: new_receiver_balance,
                prev_balance: receiverWalletData.main_balance,
                created_at: timestamp,
                updated_at: timestamp,
            });
            return ['Sent : ' + amount + ' to User : ' + receiverData.name];
        });
    }
    withdrawFund(token, amount) {
        return __awaiter(this, void 0, void 0, function* () {
            const decodedToken = jsonwebtoken_1.default.verify(token, 'secret');
            //check the logged in token
            let localToken = localStorage.getItem('user_access_token');
            if (token !== localToken) {
                throw new Error('Access denied');
            }
            //fetch current user data
            const userData = yield this.db('users').where({ id: decodedToken.id }).first();
            if (!userData) {
                throw new Error('User not found');
            }
            let user_u_id = userData.id;
            //fetch current user wallet
            const userWalletData = yield this.db('wallets').where({ user_id: user_u_id }).first();
            if (isNaN(amount)) {
                return ['Invalid amount type'];
            }
            //check if the user have enough fund
            if (userWalletData.main_balance < amount) {
                return ['Balance is low'];
            }
            // return receiverWalletData;
            const new_user_balance = userWalletData.main_balance - amount;
            const timestamp = Date.now();
            yield this.db('wallets').where({ user_id: user_u_id }).update({
                amount: amount,
                main_balance: new_user_balance,
                prev_balance: userWalletData.main_balance,
                updated_at: timestamp,
            });
            yield this.db('transactions').insert({
                user_id: user_u_id,
                amount: amount,
                transaction_type: 'withdrawal',
                main_balance: new_user_balance,
                prev_balance: userWalletData.main_balance,
                created_at: timestamp,
                updated_at: timestamp,
            });
            return ['Successfully Withdrawn: ' + amount];
        });
    }
}
exports.default = WalletController;
