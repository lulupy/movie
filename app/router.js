var router = require('koa-router')()
var index = require('./controllers/index')
var movie = require('./controllers/movie')
var user = require('./controllers/user')




router.get('/',index.index)
router.get('/detail/:id', movie.detail)
router.get('/admin/movie/new', user.signinRequire, user.adminRequire,movie.new)
router.get('/admin/movie/list', user.signinRequire, user.adminRequire,movie.list)


//新加电影提交地址
router.post('/admin/movie/save', user.signinRequire, user.adminRequire,movie.save)
router.delete('/admin/movie/delete', user.signinRequire, user.adminRequire,movie.del)

//注册

router.post('/user/signup', user.signup)
router.get('/signup', user.showSignup)

//登陆
router.post('/user/signin', user.signin)
router.get('/signin', user.showSignin)

router.get('/user/signout', user.signout)

router.get('/admin/user/list', user.signinRequire, user.adminRequire,user.list)


module.exports = router