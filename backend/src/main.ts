import koa from "koa";
import KoaRouter from "@koa/router";
import { RegisterRoutes } from "./router/routes";
import morgan from "koa-morgan";
import bodyParser from "koa-bodyparser";
import dotenv from "dotenv";
import serve from "koa-static";
import fs from "fs";
import { JsonFileRepository } from "./infra/repository";
import { MemoService } from "./core/memoService";
import { AuthService } from "./core/authService";
import { MemoController } from "./infra/controller";

dotenv.config();

const repository = new JsonFileRepository();
const memoService = new MemoService(repository);
const authService = new AuthService();
MemoController.injectDependencies(memoService, authService); // Dependency injection with constructor is not supported

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
