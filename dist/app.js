"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const http_errors_1 = __importDefault(require("http-errors"));
const dotenv_1 = require("dotenv");
const authMiddleware_1 = require("./controllers/authMiddleware");
// @ts-ignore
const routes_1 = __importDefault(require("./routes"));
(0, dotenv_1.config)();
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.get('/', (req, res, next) => {
    res.send('Hello from ts app');
});
(0, routes_1.default)(app);
app.use((req, res, next) => {
    next(new http_errors_1.default.NotFound());
});
const errorHandler = (err, req, res, next) => {
    res.status(err.status || 500);
    res.send({
        status: err.status || 500,
        message: err.message,
    });
};
app.use((req, res, next) => {
    next(authMiddleware_1.authMiddleware);
});
app.use(errorHandler);
const PORT = Number(process.env.PORT);
const server = app.listen(PORT, () => console.log(`Server is running on Port ${PORT}`));
