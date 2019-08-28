
const Koa = require('koa');
const Router = require('koa-router')
const app = new Koa();
const router = new Router();
//路由模块
const  userRouter = new Router({
    prefix:'/users'
})
//模拟多中间件用法 用户鉴权

const auth = async (ctx,next) => {
    if(ctx.url !== '/auth'){
        //没有权限访问
        ctx.throw(401)
    }
    await next()
}
auth

router.get('/authtest',auth,ctx => {
    ctx.body = 'auth page';
})

userRouter.get('/',ctx=>{
    ctx.body = '<h1>get user model</h1>'
})
userRouter.post('/',ctx=>{
    ctx.body = 'post user model'
})

app.use(router.routes())
app.use(userRouter.routes())
app.use(userRouter.allowedMethods())

app.listen(3000)






