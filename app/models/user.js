
const mongoose = require('mongoose')

//DeprecationWarning: Mongoose: `findOneAndUpdate()` and `findOneAndDelete()` without the `useFindAndModify` option set to false are deprecated.
mongoose.set('useFindAndModify', false);

const {Schema,model} = mongoose;

const userSchema = new Schema({
    name:{type:String,required:true},
    password:{type:String,required:true,select:false}
})

module.exports = model('User',userSchema)