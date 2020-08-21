'use strict';

import compose from 'koa-compose';
import Router from 'koa-router';

import testRouter from './test';
import apiRouter from './api';

const router = new Router();

router.use('/test', testRouter.routes(), testRouter.allowedMethods())
router.use('/api', apiRouter.routes(), apiRouter.allowedMethods())

router.get('*', async (ctx, next) => {
  ctx.body = {status: 404}
  ctx.send = (404,{
    code:0,
    message:'未找到'
  })
})

export default function routes() {
  return compose(
    [
      router.routes(),
      router.allowedMethods()
    ]
  )
}
