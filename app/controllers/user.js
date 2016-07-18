var User = require('../models/user')
var utils = require('../utils')


module.exports.signinRequire = function*(next){
    console.log('signinRequire')
    var user = this.session.user
    if(!user){
        return  this.redirect('/signup')
    }
    yield next
}

module.exports.adminRequire = function*(next){
    console.log('adminRequire')
    var user = this.session.user
    if(user.role<=10){
        console.log(1)
        return  this.redirect('/signup')
    }
    console.log(2)
    yield next
}

module.exports.signup =  function*(){
    var user = this.request.body
    var _user = new User({
        username: user.username,
        password: user.password
    })
    _user.username = user.username
    _user.password = user.password
    try{
        yield _user.save()
        console.log('signup success')
        this.redirect('/')
    }
    catch(e){
        console.log('signup fail')
        this.redirect('/')
    }
    
}

module.exports.showSignin = function*(){
    this.body = yield utils.render('pages/signin', {
    title: '登录页面'
  })
}
module.exports.showSignup = function*(){
   this.body = yield utils.render('pages/signup', {
    title: '注册页面'
  })
}

module.exports.signin = function*(){
    var user = this.request.body
    try{
        var _user = yield User.findOne({username: user.username})

    }
    catch(e){
        console.log(e)
    }
    if(!_user){
        this.redirect('/signup')
        
    }
    else{
        var isMatch = yield _user.comparePassword(user.password)
        if(isMatch){
            console.log('signin success')
            this.session.user = _user
            this.redirect('/')
        }else{
            this.redirect('/signin')
        }    
    }
    
    
}

module.exports.signout = function*(){
    this.session.user = null
    this.redirect('/')
}


module.exports.list = function*(){
    var users = yield User.find({})
    this.body = yield utils.render('pages/user_list', {
        title:'用户列表',
        users: users
    })

}
