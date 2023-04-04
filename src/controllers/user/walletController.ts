import jwt from 'jsonwebtoken';
import knex from 'knex';
import {LocalStorage} from 'node-localstorage';


const localStorage = new LocalStorage('./scratch');

//Database file
const knexDb:any = require('../../../db/index');

interface User {
    id: number;
    name: string;
    email: string;
    password: string
}

export default class WalletController {

    // @ts-ignore
    private db: knex;

    constructor() {
        // @ts-ignore
        this.db = knexDb;
    }

    public async createWallet(token: string): Promise<string[]> {
        const decodedToken = jwt.verify(token, 'secret') as { id: number };

        //check the logged in token
        let localToken = localStorage.getItem('user_access_token');

        if (token !== localToken) {
            throw new Error('Access denied');
        }

        const userData = await this.db<User>('users').where({id: decodedToken.id}).first();

        if (!userData) {
            throw new Error('User not found');
        }

        let user_id = userData.id;

        const userWalletData = await this.db('wallets').where({user_id: user_id}).first();

        if (userWalletData) {
            throw new Error('Wallet already created.');
        }
        const timestamp = Date.now();
        await this.db('wallets').insert({user_id, created_at: timestamp, updated_at: timestamp});

        return ['User: ' + userData, 'Message: Wallet created'];

    }

    public async fundWallet(token: any, amount: number): Promise<string[]> {
        const decodedToken = jwt.verify(token, 'secret') as { id: number };

        //check the logged in token
        let localToken = localStorage.getItem('user_access_token');

        if (token !== localToken) {
            throw new Error('Access denied');
        }
        const userData = await this.db<User>('users').where({id: decodedToken.id}).first();

        if (!userData) {
            throw new Error('User not found');
        }

        //check if the amount is numerical

        if (isNaN(amount)) {
            return ['Invalid amount type']
        }

        let user_u_id = userData.id;

        const walletData = await this.db('wallets').where({user_id: user_u_id}).first();
        let new_balance = walletData.main_balance + amount;
        console.log(Number(new_balance).toFixed(2));

        const timestamp = Date.now();
        await this.db('wallets').where({user_id: user_u_id}).update({
            amount: amount,
            main_balance: new_balance,
            prev_balance: walletData.main_balance,
            updated_at: timestamp,
        });

        await this.db('transactions').insert({
            user_id: user_u_id,
            transaction_type: 'funding',
            amount: amount,
            main_balance: new_balance,
            prev_balance: walletData.main_balance,
            created_at: timestamp,
            updated_at: timestamp,
        });
        return ['Account Funded with : ' + amount, 'Wallet Balance: ' + new_balance];
    }


    public async walletBalance(token: any): Promise<string[]> {
        const decodedToken = jwt.verify(token, 'secret') as { id: number };

        //check the logged in token
        let localToken = localStorage.getItem('user_access_token');

        if (token !== localToken) {
            throw new Error('Access denied');
        }
        const userData = await this.db('users').where({id: decodedToken.id}).first();

        if (!userData) {
            throw new Error('User not found');
        }

        let user_u_id = userData.id;

        const walletData = await this.db('wallets').where({user_id: user_u_id}).first();

        return walletData.main_balance;
    }

    public async walletTransactions(token: any): Promise<string[]> {

        const decodedToken = jwt.verify(token, 'secret') as { id: number };

        //check the logged in token
        let localToken = localStorage.getItem('user_access_token');

        if (token !== localToken) {
            throw new Error('Access denied');
        }
        const userData = await this.db('users').where({id: decodedToken.id}).first();

        if (!userData) {
            throw new Error('User not found');
        }

        let user_u_id = userData.id;

        const transactionHistory = await this.db('transactions').select('*').where({user_id: user_u_id});

        return transactionHistory;
    }


    public async transferFund(token: any, amount: any, id: any): Promise<string[]> {
        const decodedToken = jwt.verify(token, 'secret') as { id: number };

        //check the logged in token
        let localToken = localStorage.getItem('user_access_token');

        if (token !== localToken) {
            throw new Error('Access denied');
        }
        //fetch current user data
        const userData = await this.db('users').where({id: decodedToken.id}).first();

        //fetch receiver data
        const receiverData = await this.db('users').where({id: id}).first();

        if (!userData) {
            throw new Error('User not found');
        }
        if (!receiverData) {
            throw new Error('Receiver not found');
        }

        let user_u_id = userData.id;
        let receiver_u_id = receiverData.id;

        //fetch current user wallet
        const userWalletData = await this.db('wallets').where({user_id: user_u_id}).first();
        const receiverWalletData = await this.db('wallets').where({user_id: receiver_u_id}).first();

        //check if the user have enough fund
        if (userWalletData.main_balance < amount) {
            return ['Balance is low']
        }
        if (isNaN(amount)) {
            return ['Invalid amount type']
        }

        // return receiverWalletData;
        let new_user_balance = userWalletData.main_balance - amount;
        let new_receiver_balance = receiverWalletData.main_balance + amount;

        console.log(Number(new_user_balance).toFixed(2));

        const timestamp = Date.now();
        await this.db('wallets').where({user_id: user_u_id}).update({
            amount: amount,
            main_balance: new_user_balance,
            prev_balance: userWalletData.main_balance,
            updated_at: timestamp,
        });

        await this.db('wallets').where({user_id: receiver_u_id}).update({
            amount: amount,
            main_balance: new_receiver_balance,
            prev_balance: receiverWalletData.main_balance,
            updated_at: timestamp,
        });

        await this.db('transactions').insert({
            user_id: user_u_id,
            amount: amount,
            transaction_type: 'transfer_debit',
            main_balance: new_user_balance,
            prev_balance: userWalletData.main_balance,
            created_at: timestamp,
            updated_at: timestamp,
        });

        await this.db('transactions').insert({
            user_id: receiver_u_id,
            amount: amount,
            transaction_type: 'transfer_credit',
            main_balance: new_receiver_balance,
            prev_balance: receiverWalletData.main_balance,
            created_at: timestamp,
            updated_at: timestamp,
        });
        return ['Sent : ' + amount + ' to User : ' + receiverData.name];
    }

    public async withdrawFund(token: any, amount: any): Promise<string[]> {
        const decodedToken = jwt.verify(token, 'secret') as { id: number };

        //check the logged in token
        let localToken = localStorage.getItem('user_access_token');

        if (token !== localToken) {
            throw new Error('Access denied');
        }
        //fetch current user data
        const userData = await this.db('users').where({id: decodedToken.id}).first();

        if (!userData) {
            throw new Error('User not found');
        }

        let user_u_id = userData.id;

        //fetch current user wallet
        const userWalletData = await this.db('wallets').where({user_id: user_u_id}).first();

        if (isNaN(amount)) {
            return ['Invalid amount type']
        }

        //check if the user have enough fund
        if (userWalletData.main_balance < amount) {
            return ['Balance is low']
        }

        // return receiverWalletData;
        const new_user_balance = userWalletData.main_balance - amount;

        const timestamp = Date.now();
        await this.db('wallets').where({user_id: user_u_id}).update({
            amount: amount,
            main_balance: new_user_balance,
            prev_balance: userWalletData.main_balance,
            updated_at: timestamp,
        });

        await this.db('transactions').insert({
            user_id: user_u_id,
            amount: amount,
            transaction_type: 'withdrawal',
            main_balance: new_user_balance,
            prev_balance: userWalletData.main_balance,
            created_at: timestamp,
            updated_at: timestamp,
        });

        return ['Successfully Withdrawn: ' + amount];
    }

}
