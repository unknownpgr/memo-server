import koa from "koa";
import KoaRouter from "@koa/router";
import { RegisterRoutes } from "./router/routes";
import morgan from "koa-morgan";
import bodyParser from "koa-bodyparser";
import dotenv from "dotenv";
import serve from "koa-static";
import fs from "fs";

dotenv.config();

const app = new koa();

// Global middlewares
app.use(bodyParser());
app.use(morgan("dev"));

// Application routes
const router = new KoaRouter();
RegisterRoutes(router);
app.use(router.routes());

// Static files
app.use(serve("public"));

// SPA support
const indexHtml = fs.readFileSync("public/index.html");
app.use(async (ctx, next) => {
  await next();
  if (ctx.status === 404) {
    ctx.type = "html";
    ctx.body = indexHtml;
  }
});

app.listen(80, () => {
  console.log("server started");
});
