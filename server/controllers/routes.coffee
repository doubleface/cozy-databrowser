index = require './index'

module.exports =
    'doctypes':
        get: index.doctypes
    'search':
        get: index.search
    'search/:id':
        del: index.delete
    'doctype_delete_all' :
        del: index.doctype_delete_all
    'initvalues.js':
        get: index.initvalues
