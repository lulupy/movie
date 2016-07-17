var mongoose = require('mongoose')
var Schema = mongoose.Schema

var MovieSchema = new Schema({
    doctor: String,
    title: String,
    language: String,
    country: String,
    summary: String,
    flash: String,
    poster: String,
    year: Number,
    //在录入这个数据或更新一个数据的时间的记录
    meta: {
        createAt: {
            type: Date,
            default: Date.now()
        },
        updateAt: {
            type: Date,
            default: Date.now()
        }
            

    }
})

//每次在存储数据的时候都会来调用这个方法
MovieSchema.pre('save', function (next) {
    if(this.isNew){//判断这个数据是否是新加的
        this.meta.createAt = this.meta.updateAt = new Date()
    }
    else{
        this.meta.updateAt = new Date()
    }

    //回调函数，必须调用
    next()
})

//给model实例添加静态方法
MovieSchema.statics = {
    fetch: function(){
        //既然这里是model的静态方法，那这里的this指代的是Model
        var that = this
        return new Promise(function(resolve, reject){
            that
              .find({})
              .sort('meta.updateAt')
              .exec(function(err, res){
                 if(err){
                    reject(err)
                 }
                 resolve(res)
              })
        })
        
    },
    findById: function(id){
        var that = this
        return new Promise(function(resolve, reject){
            that
              .findOne({_id: id})
              .sort('meta.updateAt')
              .exec(function(err, res){
                 if(err){
                    reject(err)
                 }
                 resolve(res)
              })
        })

    }
}


module.exports = MovieSchema