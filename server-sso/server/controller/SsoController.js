import loginServer from '../service/loginService'

class SsoController {
    constructor(){

    }

    async login(ctx, next) {
        const {params, query, querystring, body} = ctx.request

        const {username, password} = body;

        const user = await loginServer.login({username, password}, ctx)

        ctx.session.user = user
        await ctx.send(200, {
            code: 1,
            success: true,
            message: '登陆成功',
            result: {
                user
            }
        })
    }

    async userInfo(ctx, next) {
        await ctx.send(200, {
            code: 1,
            success: true,
            message: '登陆成功',
            result: {
                userInfo: ctx.session.user
            }
        })
    }

    async OAuth2Login(ctx,next){

    }

    async OAuth2Logout(ctx,next){

    }

    async CASAuthentication(ctx, next){

    }

    async CASServiceTicketValidate(ctx, next){

    }

    async CASLogin(ctx,next){

    }

    async CASLogout(ctx,next){

    }

    async CASloginView(ctx,next){

        await ctx.render('../views/cas/login');
    }
}

export default new SsoController();
