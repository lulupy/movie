### 开发框架

###### 后台
- koa
- koa-router
- co-views
- swig
- mongoose

###### 前端
- jquery
- bootstrap

###### 工作流
- gulp
- bower
- npm 

### 实战开始
1. 需求分析
    看一下有几个界面，有什么交互，做到心中有数
2. 项目依赖初始化
    安装依赖模块
3. 入口文件编码
4. 创建视图
5. 测试前端流程
6. 样式开发，伪造模版数据
7. 设计数据库模型
8. 开发后端逻辑
9. 配置依赖文件，网站开发结束


### 安装依赖
npm init 创建package.json


npm install koa --save
npm install koa-router --save
npm install co-views --save
npm install swig --save
npm install mongoose --save

### 测试前端流程

- localhost:3000/ 主页
- localhost:3000/detail/1 详情页
- localhost:3000/admin/movie 后台管理页
- localhost:3000/admin/list 后台管理列表页


### 数据建模
#### mongoose

- schema 模式（数据结构）
- model 模型
- documents 文档

##### schema 定义
```
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
```

```
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
```
##### model 定义
```
var mongoose = require('mongoose')
var MovieSchema = require('../schemas/movie')

var Movie = mongoose.model('Movie', MovieSchema)
```

##### document的增加 （也就是数据的增加）
```
var _movie = new({
    doctor: 'xxx',
    title: 'xxx',
    language: 'xxx',
    country: 'xxx',
    summary: 'xxx',
    flash: 'xxx',
    poster: 'xxx',
    year: 2016,
})

//save()返回的是一个promise,所以在co函数中可以使用yield写法
_movie.save().then(function(err, res){
    doSomething(res)
})

_movei = yield _movie.save()
doSomething
```

##### 查找
- 查找一个
```
Movie.findOne({_id: 1}).then(function(err, res){
    doSomething()
})
```
- 查找多个
```
Movie.find({}).then(function(err, res){
    doSomething()
})
```

##### 修改
```
//找到要修改的
var movie = yield Movie.findOne({_id: 1})

movie.title = 'xxx2'
movie.save()
```

#####  删除
```
var movie = yield Movie.findOne({_id: 1})

movie.remove()
```

### 用户登录
#### 用户模型及密码处理

##### UserSchema
```
var UserSchema = new Schema({
    username: {
        type: String,
        unique: true //表示不能重复

    },
    password: {
        type: String,
        unique: true

    },
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
```

##### 密码的处理
我们存储的密码应该是加盐的密码哈希后的值

- 什么是哈希
    一种不可逆的算法 比如md5
   123456 > 7C4A8D09CA3762AF61E59520943DC26494F8941B
   
   可以通过123456哈希后得到后面的字符串，但是不能根据后面的字符串
   得到明文的12345

   为什么不能使用明文密码：
    -  如果你明文密码被拿到, 很到的可能你的其他账号也是使用的相同密码
        比如说你的qq，支付宝等，那后果就很严重


- 什么加盐
    密码哈希后，依然有被破解的可能，比如说暴力破解，
    比如说通过一个常见密码字典，将没有密码哈希后，与现有密码对比

    理论上这样的密码都可以被破解，密码的长度及复杂度决定了破解的时间
    可能是一万年

    加盐就是在你原始明文密码的基础上，再加些字符串，然后哈希，
    增加密码复杂度， 这个过程就叫做加盐

```
UserSchema.pre('save', function(next) {

  //生成随机盐
  bcrypt.genSalt(10, function(err, salt) {
    if (err) return next(err)
    //哈希
    bcrypt.hash(user.password, salt, function(err, hash) {
      if (err) return next(err)
      user.salt = salt
      user.password = hash
      console.log(user)
      next()
    })
  })
})
```

##### 登录
```
var _user = yield User.findOne({username: user.username})
var isMatch = yield _user.comparePassword(user.password)


//Model实例方法
UserSchema.methods = {
  comparePassword: function(password){
    var that = this;
    return new Promise(function(resolve, reject){
      bcrypt.hash(password, that.salt, function(err, hash){
        if(err){ reject(err) }
        var isMatch  = (hash===that.password)
        resolve(isMatch)
      })
    })
  }
}
```

##### 保持用户状态
- 当我们比对了用户名和密码之后，我们应该记录用户的登陆状态
- 因为http是无状态的协议, 我们必须加入一些信息来确定我们的身份
- 可以使用cookie和session

什么是cookie
Cookie是服务器保存在浏览器的一小段文本信息，每个Cookie的大小一般不能超过4KB。浏览器每次向服务器发出请求，就会自动附上这段信息。可以在http头里看到这个信息

http response 头中 设置set-cookie 也可以改变cookie

什么是session
session是服务端的概念,如果使用了session,当一次请求传到服务器端
会去找http头中的cookie中是不是有session_id(也可以是其他的key), 
如果没有就生成,下次再次请求的时候就带有session_id, 就可以找到对应的
session, session中可以存储相关的信息，比如说用户登录信息,
一个session_id 对应一个session, 也就是一个浏览器对应一个session,
这样就可以区分用户


### 权限管理
新加一个role字段表示用户的角色
可以是字符串类型
```
//admin 管理员
//superadmin 超级管理员
//noraml 普通用户
role: String
```

也可以数字类型
0 normal user 
1 verfied user 通过认证的用户,比如说邮箱验证什么的 
3 professonal user 资料写的比较完备的用户
'> 10' admin
'>50' superadmin 开发时,可以有这个用户,可以不用存入数据库

也可以是其他的方式


   
