'use strict';

import compose from 'koa-compose';
import requestId from "@kasa/koa-request-id";
// import onerror from "koa-onerror";
import cors from "kcors";
import Helmet from "koa-helmet";
import cookiesMiddleware from "universal-cookie-koa";
import session from "koa-session";
import ioredis from 'koa-2-ioredis';
import bodyParser from "koa-bodyparser";
import respond from "koa-respond";
import serve from "koa-static";
import views from "koa-views";
import logger from './logger';
import dbKeeper from './mongod';
import routes from '../routes';
// import path from 'path'
// const resolve = file => path.resolve(__dirname, file);


export default function middleware(app, config) {
  return compose(
    [
      // onerror,
      Helmet(),
      cookiesMiddleware(),
      ioredis(),
      // redis 测试服务
      // async (ctx, next) => {
      //
      //   await ctx.redis.set('test', '25345235234');
      //   const data = await ctx.redis.get('test');
      //   console.log('redis ',data)
      //   await next()
      // },
      // session({
      //   store: redisStore(config.redis)
      // }),
      session({
        key: 'server-im-session-key',
        maxAge: 86400000,
        autoCommit: true,
        overwrite: true,
        httpOnly: true,
        /** (boolean) httpOnly or not (default true) */
        signed: true,
        /** (boolean) signed or not (default true) */
        rolling: false,
        /** (boolean) Force a session identifier cookie to be set on every response. The expiration is reset to the original maxAge, resetting the expiration countdown. (default is false) */
        renew: false,
      }, app),
      bodyParser({
        enableTypes: ['json'],
        jsonLimit: '10mb',
        strict: true,
        extended: true,
        onerror: function (err, ctx) {
          if (err) {
            console.log(err)
          }
          ctx.throw('body parse error', 422)
        }
      }),
      requestId(),
      respond(),
      logger(),
      cors({credentials: true}),
      dbKeeper(),
      serve(__dirname + '/../../public'),
      // views(__dirname + '/../views', {extension: 'swig'}),
      serve(__dirname + '/../assets'),
      views(__dirname + '/../views', {extension: 'ejs'}),
      /**  手动跨域操作 **/
      // async (ctx, next) => {
      //   ctx.set('Access-Control-Allow-Origin', ctx.headers.origin);
      //   ctx.set('Access-Control-Allow-Headers', 'content-type');
      //   ctx.set('Access-Control-Allow-Methods', 'OPTIONS,GET,HEAD,PUT,POST,DELETE,PATCH')
      //   await next();
      // },
      routes(),
    ]
  )
}
