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

var User = require('./app/models/user')
var utils = require('./app/utils')

mongoose.connect(config.dbUrl)

var app = new Koa()




router.get('/',index)
router.get('/detail/:id', detail)
router.get('/admin/movie', admin.admin)
router.get('/admin/list', admin.list)


//新加电影提交地址
router.post('/admin/control/new', admin.new)
router.delete('/admin/list', admin.delete)

//注册
router.post('/user/signup', function*(){
    var user = this.request.body
    var _user = new User({
        username: user.username,
        password: user.password
    })
    _user.username = user.username
    _user.password = user.password
    try{
        yield _user.save()
        this.redirect('/admin/user/list')
    }
    catch(e){
        console.log('signup fail')
        this.redirect('/')
    }
    
})

router.get('/admin/user/list', function*(){
    var users = yield User.find({})
    this.body = yield utils.render('pages/user_list', {
        title:'用户列表',
        users: users
    })

})

app.use(server('./static'))
//必须在router.routes()之前
app.use(koaBoby({multipart: true}))
app.use(router.routes())




app.listen(config.port)
console.log('listening to '+config.port+'....')