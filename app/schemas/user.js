var mongoose = require('mongoose')
var Schema = mongoose.Schema
var bcrypt = require('bcrypt')

var UserSchema = new Schema({
    username: {
        type: String,
        unique: true //表示不能重复

    },
    password: {
        type: String,
        unique: true

    },
    salt: String,
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


UserSchema.pre('save', function(next) {
  var user = this

  if (this.isNew) {
    this.meta.createAt = this.meta.updateAt = Date.now()
  }
  else {
    this.meta.updateAt = Date.now()
  }
  //生成随机盐
  bcrypt.genSalt(10, function(err, salt) {
    if (err) return next(err)

    bcrypt.hash(user.password, salt, function(err, hash) {
      if (err) return next(err)
      user.salt = salt
      user.password = hash
      console.log(user)
      next()
    })
  })
})

module.exports = UserSchema