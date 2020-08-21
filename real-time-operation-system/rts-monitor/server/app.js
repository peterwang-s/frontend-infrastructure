'use strict';
import Koa from 'koa'
import middleware from './middleware';
import config from './config';
// import onerror from "koa-onerror";
const app = new Koa();
app.proxy = false;
app.keys = ['server-im-session-key'];
app.context.state = {}
app.context.state = Object.assign(app.context.state, {config: config});

function handleError(err, ctx) {
  if (err) {
    console.log('应用错误：', err)
  }
  if (ctx) {
    console.log('错误信息：', JSON.stringify(ctx.onerror))
  }
}

app.on('error', handleError)
app.on('session:missed', (err, ctx) => {
  console.log('session:missed', err)
})
app.on('session:invalid', (err, ctx) => {
  console.log('session:invalid', err)
})
app.on('session:expired', (err, ctx) => {
  console.log('session:expired', err)
})
app.use(async (ctx, next) => {

  const start = new Date()
  await next()
  const ms = new Date() - start
  console.log(`${ctx.method} ${ctx.url} - ${ms}ms`)
})
app.use(middleware(app, config))
// app.use(onerror)

let server = app.listen(config.app.port, () => {
  console.info({event: 'execute'}, `API server listening on ${config.app.host}:${config.app.port}, in ${config.app.env}`)
})

export default app
