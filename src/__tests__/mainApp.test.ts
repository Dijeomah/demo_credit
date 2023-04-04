import express, {Request, Response, NextFunction, Application, ErrorRequestHandler} from 'express';
import {describe, expect, test} from '@jest/globals';
import request from 'supertest';

import authRoutes from "../routes/authRoute";
// import userRoutes from "../routes/userRoutes";
// import walletRoutes from "../routes/walletRoutes";

const app: Application = express();

// @ts-ignore
import app from '../app';
// @ts-ignore
import appStart from "../routes";

app.use(express.json())


describe('Test user authentication', () => {
    let token = '';

    it('should register a new user', async () => {
        const res = await request(appStart(app)).post('/register').send({
            name: 'Test User',
            email: 'testuser@example.com',
            password: 'password',
        });

        console.log(res);
        expect(res.status).toEqual(201);
    });

    it('should log in as the new user', async () => {
        // @ts-ignore
        // const res = await request(authRoutes(app)).post('/login').send({
        const res = await request(appStart(app)).post('/login').send({
            email: 'testuser@example.com',
            password: 'password',
        });
        expect(res.status).toEqual(200);
        expect(res.body).toHaveProperty('token');
        token = res.body.token;
    });

    it('should get user profile', async () => {
        const res = await request(app)
            .get('/profile')
            .set('Authorization', `Bearer ${token}`);
        expect(res.status).toEqual(200);
        expect(res.body).toHaveProperty('name');
    });
});
