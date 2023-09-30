import koa from "koa";
import KoaRouter from "@koa/router";
import { RegisterRoutes } from "./router/routes";
import morgan from "koa-morgan";
import bodyParser from "koa-bodyparser";
import dotenv from "dotenv";

dotenv.config();

const app = new koa();
app.use(bodyParser());
app.use(morgan("dev"));

const router = new KoaRouter();
RegisterRoutes(router);
app.use(router.routes());

app.listen(80, () => {
  console.log("server started");
});
