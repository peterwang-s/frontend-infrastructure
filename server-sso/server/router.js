import Router from "koa-router";

/**  core 应用核心自定义模块，路由  **/

// import routes from './router';
import Ssoctl from './controller/SsoController';
import compose from "koa-compose";

const router = new Router();

/**  SsoRouter 单点登陆相关路由  **/
const SsoRouter = new Router();

SsoRouter.get('/cas/login', Ssoctl.CASloginView)
SsoRouter.post('/cas/login', Ssoctl.CASLogin)


router.get('/test', async (ctx, next) => {
    ctx.body = {
        success: true,
        data: {
            test: 'test'
        }
    }
})

router.use('/sso', SsoRouter.routes(), SsoRouter.allowedMethods())

// export default function routes() {
//     return compose(
//         [
//             router.routes(),
//             router.allowedMethods()
//         ]
//     )
// }

export default router


