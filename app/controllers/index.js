var utils = require('../utils')
var Movie = require('../models/movie')

module.exports.index = function *(){
    var user = this.session.user
    var movies = yield Movie.fetch()
    this.body = yield utils.render('pages/index', {
        title: "首页",
        movies: movies,
        user: user
    })
}

