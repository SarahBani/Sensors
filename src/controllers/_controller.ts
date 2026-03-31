import Koa from "koa";

export interface Controller {
  list?(ctx: Koa.Context, next?: Koa.Next): any;
  create?(ctx: Koa.Context, next?: Koa.Next): any;
  read?(ctx: Koa.Context, next?: Koa.Next): any;
  update?(ctx: Koa.Context, next?: Koa.Next): any;
  delete?(ctx: Koa.Context, next?: Koa.Next): any;
}
