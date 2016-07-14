var Koa = require('koa')
var router = require('koa-router')()
var views = require('co-views')

var app = new Koa()
var render = views(__dirname + '/views', { map: {html: 'swig'} })

var PORT = 3000

router.get('/',index)
router.get('/movie/:id', detail)
router.get('/admin/movie', admin)
router.get('/admin/list', list)


app.use(router.routes())
app.listen(PORT)
console.log('listening to '+PORT+'....')

function *index(){
    this.body = yield render('index', {title: "首页"})
}

function *detail(){
    this.body = yield render('detail', {title: "详情页"})
}

function *admin(){
    this.body = yield render('admin', {title: "后台录入页"})
}

function *list(){
    this.body = yield render('list', {title: "列表"})
}