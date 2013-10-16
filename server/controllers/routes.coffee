index = require './index'

module.exports =
    'doctypes':
        get: index.doctypes
    'search':
        get: index.search
    'search/:id':
        del: index.delete
