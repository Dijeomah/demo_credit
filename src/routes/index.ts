import express from "express";

import authRoutes from "./authRoute";
import userRoutes from "./userRoutes";
import walletRoutes from "./walletRoutes";


export const appStart = (app: any) => {
    app.use(express.json({limit: '1mb'}))
    app.use('/api/v1/', [authRoutes,userRoutes,walletRoutes])
};
module.exports = appStart
