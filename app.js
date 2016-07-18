var Koa = require('koa')

var views = require('co-views')
var server = require('koa-static')
var mongoose = require('mongoose')
var koaBoby = require('koa-body')
var session = require('koa-session')
var config = require('./config')

var router = require('./app/router')

mongoose.connect(config.dbUrl)

var app = new Koa()







//设置一个签名 Cookie 的密钥, 为了防止cookie被串改
app.keys = ["secret"]
app.use(session({
    maxAge: 1000 * 10,//过期时间
    key: "secret"
},app))
app.use(server('./static'))
//必须在router.routes()之前
app.use(koaBoby({multipart: true}))

app.use(router.routes())




app.listen(config.port)
console.log('listening to '+config.port+'....')