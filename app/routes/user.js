
const jwt = require('jsonwebtoken')
//登陆验证jwt
//const jwt = require('koa-jwt')
const Router = require('koa-router')
//设置公共路由前缀
const  router = new Router({prefix:'/users'})
//设置模块对应控制器
const {getUser,addUser,updateUser,deleteUser,login,checkOwner} = require('../controllers/user');

const {scret} = require('../config')

//接口权限验证中间件

const auth = async (ctx,next)=>{
    let {authorization = ''} = ctx.request.header;
    console.log(ctx.request)
    let token = authorization.replace('Bearer ','');
    
    try {
        let user = jwt.verify(token,scret);
        console.log('auth user',user)
        //为了接下来的中间件能拿user信息
        ctx.state.user = user;
    } catch (error) {
        ctx.throw(401)
    }
    await next();
}

// console.log(jwt({scret}))
//const auth = jwt({scret})

router.get('/',getUser)
router.post('/',addUser)
router.patch('/:id',auth,checkOwner,updateUser)
router.delete('/:id',deleteUser)
router.post('/login',login)

module.exports = router;