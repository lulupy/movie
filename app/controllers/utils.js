var views = require('co-views')
var config = require('../../config')
var render = views(config.baseDir + '/app/views', { map: {html: 'swig'} })

module.exports = {
    render: render
}