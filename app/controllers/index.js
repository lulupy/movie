var utils = require('./utils')
var Movie = require('../models/movie')

function *index(){
    var movies = yield Movie.fetch()
    this.body = yield utils.render('pages/index', {
        title: "首页",
        movies: movies
    })
}

module.exports = index