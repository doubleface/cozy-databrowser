NavView = require 'views/nav_view'
DoctypesView = require 'views/doctypes_view'
DoctypeNavCollectionView = require 'views/doctype_nav_collection_view'
DoctypeCollectionView = require 'views/doctype_collection_view'
SearchView = require 'views/search_view'
ResultCollectionView = require 'views/result_collection_view'


module.exports = class Router extends Backbone.Router

    routes:
        '': 'doctypes'
        'doctypes' : 'doctypes'
        'search' : 'search'
        'search/all/:doctype' : 'search'

    doctypes: ->
        #navView = new NavView()
        doctypeNavCollectionView = new DoctypeNavCollectionView()
        doctypeNavCollectionView.render()
        doctypesView = new DoctypesView()
        doctypesView.render()
        dcView = new DoctypeCollectionView()
        dcView.render()

    search : (doctype) ->
        #navView = new NavView()
        options = {}
        if doctype?
            if not /\|/.test decodeURIComponent(doctype)
                options['doctype'] = [doctype]
            else
                options['doctype'] = decodeURIComponent(doctype).split /\|/
            options['range'] = 'all'
        searchView = new SearchView(options)
        searchView.render()