var _ = require('underscore')

var router = require('koa-router')()
var Movie = require('../models/movie')
var utils = require('./utils')
function *admin(){
    
    this.body = yield utils.render('pages/admin', {title: "后台录入页"})

}


function *list(){
    var movies = yield Movie.fetch()
    this.body = yield utils.render('pages/list', {
        title: "列表",
        movies: movies
    })
}
function *_new(next){
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
  console.log(_movie, 111111)
  try{
    yield _movie.save()
  }catch(e){
    console.log(e)
  }
  this.redirect('/detail/'+ _movie._id)
  this.status = 301

}

function *_delete(){
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
module.exports = {
    admin: admin,
    list: list,
    new: _new,
    delete: _delete
}