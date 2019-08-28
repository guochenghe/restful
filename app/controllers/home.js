
const path = require('path')

//控制器处理方法
class HomeCtrl {
    upload(ctx){
        let file = ctx.request.files.file;
        let basename = path.basename(file.path)
        ctx.body = {url:`${ctx.origin}/uploads/${basename}`}
    }
}

module.exports = new HomeCtrl()