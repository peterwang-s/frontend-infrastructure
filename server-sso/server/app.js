'use strict';
// 1、导入原生node模块
// 2、导入框架类库
// 3、导入自定义模块
import path from 'path'

import Koa from 'koa';
import Router from 'koa-router';

// import config from './config';

const config = {
    app: {
        root: path.normalize(path.join(__dirname, "/..")),
        env: process.env.NODE_ENV,
        port: 5008,
        name: "social-butterfly",
        excluded: "excluded_path",
        default_avatar: ''
    },
    jwt: {
        secret: 'social-butterfly', // 默认
    },
}

// import onerror from "koa-onerror";

// 生成koa实例
const app = new Koa();
// 全局配置信息
app.proxy = false;
app.keys = ['server-im-session-key'];
// app.context.state = {}
// app.context.state = Object.assign(app.context.state, {config: config});

// 中间件 - 接口响应时间
app.use(async (ctx, next) => {
    const start = new Date()
    await next()
    const ms = new Date() - start
    console.log(`${ctx.method} ${ctx.url} - ${ms}ms`) // 日志打印
})


/**  **************************业务逻辑********************************  **/

/**  控制器逻辑 @type {Server Controller层逻辑  **/

/**  redis客户端调用逻辑  **/
// import ioredis from 'koa-2-ioredis/redis';
// ioredis.set('test', 'test');

class SuperController {
    constructor() {
        // const {params, query, querystring} = ctx
    }
}

class SuperServer {
    constructor() {
        // const {params, query, querystring} = ctx
    }
}

/** **************** middleware 中间件 ************************ **/
// import middleware from './middleware';  // 原始代码

// 1、组合中间件
import compose from 'koa-compose';
// 2、为每一个http请求生成一个唯一UUID，并添加到response X-Request-Id标头上；可以通过ctx.state.reqId访问，同时可以修改配置。
import requestId from "@kasa/koa-request-id";
// import onerror from "koa-onerror";
// 3、跨域资源共享（CORS）的KOA
import cors from "kcors";
// 4、通过提供了重要的安全标头，为应用提供14种安全防护策略，增强了服务的安全性，保护了服务器的重要敏感信息。
import Helmet from "koa-helmet";
// 5、为koa应用提供了cookies的存取方法。
import cookiesMiddleware from "universal-cookie-koa";
// 6、会话管理内容，提供了会话信息存储
import session from "koa-session";
// 7、提供了完整的redis客户端API，可以建立数据库连接，并且在上下文和全局对象中，对数据库进行操作；在启动命令中添加DEBUG=koa2:ioredis，可以进行调试；使用config文件夹下
// default.json文件提供数据库配置。
import ioredis from 'koa-2-ioredis';
// 8、对koa请求体进行解析，从而获取了请求数据
import bodyParser from "koa-bodyparser";
// 9、为上下文添加响应方法；
import respond from "koa-respond";
// 10、静态文件服务中间件，帮助用户访问服务器静态资源文件。
import serve from "koa-static";
// 11、初始化相应的模版引擎，帮助模版渲染；在应用启动命令中添加DEBUG=koa-views，使用调试功能
import views from "koa-views";

import logger from './middleware/logger';
import dbKeeper from './middleware/mongod';




/**  core 应用核心自定义模块，路由  **/

import router from './router';


// router.get('*', async (ctx, next) => {
//   ctx.body = {status: 404}
//   ctx.send = (404, {
//     code: 0,
//     message: '未找到'
//   })
// })




// export default function middleware(app, config) {
// compose函数将所有中间件组合以后，用koa实例app.use方法进行挂载；部分中间件在初始化的时候，需要传入应用实例，从而可以对应用程序做进一步处理。
function middleware(app, config) {
    return compose(
        [
            // onerror,
            requestId(),
            cors({credentials: true}),
            Helmet(),
            cookiesMiddleware(),
            ioredis(),
            // session({
            //   store: redisStore(config.redis)
            // }),
            session({
                /** (string) cookie key (default is koa:sess) */
                // 设置了cookie的名称
                key: 'session-key',
                maxAge: 86400000,
                autoCommit: true,
                overwrite: true,
                /** (boolean) httpOnly or not (default true) */
                signed: true,
                httpOnly: true,
                /** (boolean) signed or not (default true) */
                // 签名
                rolling: false,
                /** (boolean) Force a session identifier cookie to be set on every response. The expiration is reset to the original maxAge, resetting the expiration countdown. (default is false) */
                // 强制刷新cookies，保证user保持登陆状态
                renew: false,
                // encode:()=>{}, // 编码方法
                // decode:()=>{}, // 解码方法
                /** 默认情况下，会话信息是存储在浏览器端的。存在缺点：会话未加密存储在客户端；cookie有长度限制
                 *  所以必要的时候可以提供外部存储。
                 * **/
                // store:async ()=>{}
                // store: redisStore(config.redis)
            }, app),
            bodyParser({
                // 请求类型符合解析类型，才可以获取数据。
                enableTypes: ['json', 'form'],
                // 扩展请求体类型
                // extendTypes:{json: ['application/x-javascript']},
                // 请求体大小限制；formLimit，textLimit
                jsonLimit: '10mb',
                strict: true,
                extended: true,
                // 自定义错误处理
                onerror: function (err, ctx) {
                    if (err) {
                        console.log(err)
                    }
                    ctx.throw('body parse error', 422)
                }
            }),
            respond(),
            /**
             * 静态文件服务，参数列表
             * root根目录字符串
             * 选项对象；
             *  maxage 浏览器缓存时间
             *  hidden 容许发送隐藏文件
             *  index  默认文件名称
             *  gzip   默认true，提供gzip压缩版本文件
             *  setHeaders 响应的自定义标头
             *
             */
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
            dbKeeper(),
            logger(),
            // routes(),
            router.routes(),
            router.allowedMethods(),
            // 自定义koa中间件，用于演示中间件使用方法
            // async function (ctx, next) {
            //   // 使用通用cookie工具获取请求中携带的缓存数据。get the user cookies using universal-cookie.
            //   // 原生cookies操作方法，ctx.cookies.get()，ctx.cookies.set()。可以处理安全性、域、路径、签名
            //   ctx.request.universalCookies.get('myCat');
            //
            //   // koa-session 中间件：
            //   // session会话信息的使用方法
            //   ctx.session.user = {};
            //   ctx.session = null; // 销毁会话
            //
            //   // koa-2-ioredis 中间件：
            //   // ioredis建立redis数据库连接，然后可以在上下文对象上，使用redis对象对数据库进行存取操作。
            //   // DEBUG=koa2:ioredis
            //   // await ctx.redis.set(key, value);
            //   // const data = await ctx.redis.get(key);
            //   await ctx.redis.set('test', '25345235234');
            //   const data = await ctx.redis.get('test');
            //   console.log('redis ', data)
            //
            //   // koa-bodyparser 中间件：
            //   // 解析的正文将存储在ctx.request.body中
            //   // 如果未解析任何内容，则body将为空对象{}
            //   // ctx.body = ctx.request.body;
            //
            //   // koa-views 中间件：在服务端渲染一个视图，返回给客户端进行展示
            //   // await ctx.render('user', {
            //   //   user: 'John'
            //   // });
            //
            //   await next()
            // }
        ]
    )
}

// app.use(middleware(app, config));
app.use(middleware(app, {}));
// app.use(onerror)

/**  中间件配置处理逻辑  **/
/**  koa-session 中间件添加的事件监听器  **/
// 会话无法从外部存储获取
app.on('session:missed', (err, ctx) => {
    console.log('session:missed', err)
})
// 会话值无效
app.on('session:invalid', (err, ctx) => {
    console.log('session:invalid', err)
})
// 会话值已过期
app.on('session:expired', (err, ctx) => {
    console.log('session:expired', err)
})


// 错误边界处理；对全局应用错误信息进行处理，保证可以接受到全部错误信息，统一处理逻辑，同时便于调试

// const handleError =

app.on('error', (err, ctx) => {
    if (err) {
        console.log('应用错误：', err)
    }
    if (ctx) {
        console.log('错误信息：', JSON.stringify(ctx.onerror))
    }

    // ctx.internalServerError({
    //   code: 0,
    //   success: false,
    //   message: JSON.stringify(ctx.onerror),
    //   result: err
    // })
})

let server = app.listen(config.app.port, () => {
    console.info({event: 'execute'}, `API server listening on ${config.app.host}:${config.app.port}, in ${config.app.env}`)
})

export default app
