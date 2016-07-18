var _ = require('underscore')

var router = require('koa-router')()
var Movie = require('../models/movie')
var utils = require('../utils')


//detail 
module.exports.detail = function *(){
    //this.params 获取url上的参数
    var id = this.params.id
    // var movie = yield Movie.findById(id)
    var movie = yield Movie.findOne({_id: id}).exec()//exec 返回一个promise
    this.body = yield utils.render('pages/detail', {
        title: 'imooc '+ movie.title,
        movie: movie
    })
}


//admin new page
module.exports.new = function *(){
    this.body = yield utils.render('pages/admin', {title: "后台录入页"})
}

//admin save
module.exports.save = function *(){
  //使用了koa-body,this.request.body为表单提交解析后的一个对象
  var movieObj = this.request.body
  var _movie
  var _id =  movieObj._id
  if(_id===''){
    _movie = new Movie({
      title: movieObj.title,
      doctor: movieObj.doctor,
      country: movieObj.country,
      language: movieObj.language,
      year: movieObj.year,
      summary: movieObj.summary,
      poster: movieObj.poster 
    })
  }
  else{
    _movie = yield Movie.findOne(_id)
  }

  try{
    yield _movie.save()
  }catch(e){
    console.log(e)
  }
  this.redirect('/detail/'+ _movie._id)
  this.status = 301
}

module.exports.list = function *(){
    var movies = yield Movie.fetch()
    this.body = yield utils.render('pages/list', {
        title: "列表",
        movies: movies
    })
}

module.exports.del = function *(){


  var id = this.request.query.id
  var _movie = yield Movie.findById(id)
  try{
    yield _movie.remove()
    this.body = 1
  } 
  catch(e){
    console.log(e)
    this.body = 0
  }
}