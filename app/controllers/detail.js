var utils = require('../utils')
var Movie = require('../models/movie')

function *detail(){
    //this.params 获取url上的参数
    var id = this.params.id
    // var movie = yield Movie.findById(id)
    var movie = yield Movie.findOne({_id: id}).exec()//exec 返回一个promise
    this.body = yield utils.render('pages/detail', {
        title: 'imooc '+ movie.title,
        movie: movie
    })
}

module.exports = detail