
const User = require('../models/user')
const jwt = require('jsonwebtoken')
const {scret} = require('../config')

//控制器处理方法
class UserCtrl {
    async getUser(ctx){
        ctx.body = await User.find()
    }
    async updateUser(ctx){
        let id = ctx.params.id;
        let user = await User.findByIdAndUpdate(id,ctx.request.body);
        if(!user){
            ctx.throw(404,'用户不存在')
        }
        ctx.body = user
    }
    async deleteUser(ctx){
        
        let user = await User.findByIdAndRemove({_id:ctx.params.id});

        if(!user){
            ctx.throw(404,'用户不存在')
        }
        ctx.body  = 204;
    }
    async addUser(ctx){
        ctx.verifyParams({
            name:{type:'string',required:true},
            name:{type:'string',required:true}
        })
        let {name} = ctx.request.body;
        //查询注册用户唯一性
        let repeatUser = await User.findOne({name});
        if(repeatUser){
            ctx.throw(409,`${name}已经注册`);
        }
        let newUser = await new User(ctx.request.body).save();
        //restful最佳实践，返回新增的数据
        ctx.body = newUser;
    }
    //权限鉴别，该中间件实现对后续接口的保护作用
    async checkOwner(ctx,next){
        console.log('checkOwner',ctx.state.user)
        console.log('paramsId',ctx.params.id)
        console.log('userId',ctx.state.user._id)
        if(ctx.params.id !== ctx.state.user._id){ctx.throw(403,'你没有权限')}
        await next()
    }
    async login(ctx){
        //验证参数 直接验证传过来的参数
        ctx.verifyParams({
            name:{type:'string',required:true},
            password:{type:'string',required:true}
        })

        let user = await User.findOne(ctx.request.body)
        if(!user){
            ctx.throw(401,'用户名或密码错误');
        }
        let {_id,name} = user;
        let token = jwt.sign({_id,name},scret,{expiresIn:'1d'})

        ctx.body = {token}

    }
}

module.exports = new UserCtrl()