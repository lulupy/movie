var router = require('koa-router')()
var index = require('./controllers/index')
var movie = require('./controllers/movie')
var user = require('./controllers/user')




router.get('/',index.index)
router.get('/detail/:id', movie.detail)
router.get('/admin/movie/new', movie.new)
router.get('/admin/movie/list', movie.list)


//新加电影提交地址
router.post('/admin/movie/save', movie.save)
router.delete('/admin/movie/delete', movie.del)

//注册

router.post('/user/signup', user.signup)
router.get('/signup', user.showSignup)

//登陆
router.post('/user/signin', user.signin)
router.get('/signin', user.showSignin)

router.get('/user/signout', user.signout)

router.get('/admin/user/list', user.list)


module.exports = router