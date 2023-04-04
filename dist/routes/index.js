"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.appStart = void 0;
const express_1 = __importDefault(require("express"));
const authRoute_1 = __importDefault(require("./authRoute"));
const userRoutes_1 = __importDefault(require("./userRoutes"));
const walletRoutes_1 = __importDefault(require("./walletRoutes"));
const appStart = (app) => {
    app.use(express_1.default.json({ limit: '1mb' }));
    app.use('/api/v1/', [authRoute_1.default, userRoutes_1.default, walletRoutes_1.default]);
};
exports.appStart = appStart;
module.exports = exports.appStart;
