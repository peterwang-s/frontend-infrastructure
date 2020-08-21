import validator from 'validator'

class TestController {

  async testMessage(ctx) {
    const {query} = ctx.request
    const errorMeesge = query.errorMeesge && validator.trim(query.errorMeesge)
    await ctx.send(200, {
      errorMeesge
    })
  }

  async render(ctx) {
    await ctx.render('./page/test', {})
  }

  async cacheQueue(ctx) {
    const {body} = ctx.request
    const message = body.message && validator.trim(body.message)
    const idx = Date.now()
    await ctx.redis.set(idx, message);
    const result = await ctx.redis.get(idx) ;
    await ctx.send(200, {
      result
    })
  }

  async clearCacheQueue(ctx) {
    const result = await ctx.redis.clear();
    await ctx.send(200, {
      result
    })
  }
}

export default new TestController();
