"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const koa_1 = __importDefault(require("koa"));
const router_1 = __importDefault(require("@koa/router"));
const routes_1 = require("./router/routes");
const app = new koa_1.default();
const router = new router_1.default();
(0, routes_1.RegisterRoutes)(router);
app.use(router.routes());
app.listen(80, () => {
    console.log("server started");
});
