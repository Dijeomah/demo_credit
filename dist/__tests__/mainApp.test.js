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
const globals_1 = require("@jest/globals");
const supertest_1 = __importDefault(require("supertest"));
// import userRoutes from "../routes/userRoutes";
// import walletRoutes from "../routes/walletRoutes";
const app = (0, express_1.default)();
// @ts-ignore
const routes_1 = __importDefault(require("../routes"));
app.use(express_1.default.json());
(0, globals_1.describe)('Test user authentication', () => {
    let token = '';
    it('should register a new user', () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)((0, routes_1.default)(app)).post('/register').send({
            name: 'Test User',
            email: 'testuser@example.com',
            password: 'password',
        });
        console.log(res);
        (0, globals_1.expect)(res.status).toEqual(201);
    }));
    it('should log in as the new user', () => __awaiter(void 0, void 0, void 0, function* () {
        // @ts-ignore
        // const res = await request(authRoutes(app)).post('/login').send({
        const res = yield (0, supertest_1.default)((0, routes_1.default)(app)).post('/login').send({
            email: 'testuser@example.com',
            password: 'password',
        });
        (0, globals_1.expect)(res.status).toEqual(200);
        (0, globals_1.expect)(res.body).toHaveProperty('token');
        token = res.body.token;
    }));
    it('should get user profile', () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app)
            .get('/profile')
            .set('Authorization', `Bearer ${token}`);
        (0, globals_1.expect)(res.status).toEqual(200);
        (0, globals_1.expect)(res.body).toHaveProperty('name');
    }));
});
