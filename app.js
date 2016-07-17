var Koa = require('koa')
var router = require('koa-router')()
var views = require('co-views')
var server = require('koa-static')
var mongoose = require('mongoose')
var koaBoby = require('koa-body')
var config = require('./config')
var index = require('./app/controllers/index')
var admin = require('./app/controllers/admin')
var detail = require('./app/controllers/detail')




mongoose.connect(config.dbUrl)

var app = new Koa()




router.get('/',index)
router.get('/detail/:id', detail)
router.get('/admin/movie', admin.admin)
router.get('/admin/list', admin.list)


//新加电影提交地址
router.post('/admin/control/new', admin.new)

app.use(server('./static'))
//必须在router.routes()之前
app.use(koaBoby({multipart: true}))
app.use(router.routes())




app.listen(config.port)
console.log('listening to '+config.port+'....')