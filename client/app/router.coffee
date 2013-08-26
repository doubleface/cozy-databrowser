NavView = require 'views/nav_view'
DoctypesView = require 'views/doctypes_view'
DoctypeCollectionView = require 'views/doctype_collection_view'
SearchView = require 'views/search_view'
ResultCollectionView = require 'views/result_collection_view'

module.exports = class Router extends Backbone.Router
    
    routes:
        '': 'doctypes'
        'doctypes' : 'doctypes'
        'search' : 'search'
        'search/all/:doctype' : 'search'

    redirectToDoctypes: ->
        this.navigate("/doctypes", true)

    doctypes: ->
        navView = new NavView()
        doctypesView = new DoctypesView()
        doctypesView.render()	
        dcView = new DoctypeCollectionView()
        dcView.render()

    search : (doctype) ->
        navView = new NavView()
        options = {}
        if doctype?
            options['range'] = 'all'
            options['docType'] = doctype
        searchView = new SearchView(options)
        searchView.render()        