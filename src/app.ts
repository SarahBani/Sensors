import Koa from "koa";
import router from "./router";
import logger from "koa-logger";
import { config } from "./config";
import { seed } from "./seed";
import { bodyParser } from "@koa/bodyparser";

const app = new Koa();

app
  .use(logger())
  .use(bodyParser())
  .use(router.routes())
  .use(router.allowedMethods())
  .listen(config.PORT);

const baseUrl = `http://localhost:${config.PORT}`;

console.log(
  [
    `Listening on ${baseUrl}`,
    "",
    "Routes:",
    ...router.stack.map(
      (route) => `=> ${route.methods} ${baseUrl}${route.path}`
    ),
  ].join("\n")
);

seed();
