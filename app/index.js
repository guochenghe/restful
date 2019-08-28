const path = require('path')
const Koa = require('koa');
const koaBody = require('koa-body')
const koaStatic = require('koa-static')
const error = require('koa-json-error');
const parameter = require('koa-parameter')
const mongoose = require('mongoose');
const app = new Koa();
const routing = require('./routes')
const {connectStr} = require('./config')


mongoose.connect(connectStr,{useNewUrlParser: true},()=>{
    console.log('mongodb 连接成功')
})
mongoose.connection.on('error',console.error)

//全局报错处理
//可以捕获控制器里面抛出的错误处理 对404 不能捕获
/**
app.use(async (ctx,next)=>{
    try {
        await next()
    } catch (err) {
        ctx.status = err.status || err.statusCode || 500;
        ctx.body = {
            errorMsg:err.message
        }
        console.log('error info',err)
    }
})
 */
//静态文件设置 接受一个本地直接访问的文件夹 localhost:3000/uploads 直接过滤public 文件夹
app.use(koaStatic(path.join(__dirname,'public')))
//2** 4** 5** 错误捕获
app.use(error({
    //该参数用来格式化返回的错误信息
    //堆栈信息生产环境暴露出来比较危险
    postFormat:(e,{stack,...rest})=>process.env.NODE_ENV === 'development'?{stack,...rest}:{...rest}
}))

console.log(path.join(__dirname,'/public/upload'))
//参数解析 文件上传
app.use(koaBody({
    //是否支持文件上传
    multipart:true,
    formidable:{
        keepExtensions:true,
        uploadDir:path.join(__dirname,'/public/uploads')
    }
}))
//参数校验 
//传入app实例，会在全局上下文生成一个校验方法  ctx.verifyParams
app.use(parameter(app));
//路由--自定义读写路由
routing(app);

app.listen(3000,()=>{console.log('3000 端口监听成功')})














