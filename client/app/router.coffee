DoctypesView = require 'views/doctypes_view'
DoctypeCollectionView = require 'views/doctype_collection_view'
SearchView = require 'views/search_view'
ResultCollectionView = require 'views/result_collection_view'

module.exports = class Router extends Backbone.Router

    routes:
        '': 'doctypes'
        'doctypes' : 'doctypes'
        'search' : 'search'

    redirectToDoctypes: ->
        this.navigate("/doctypes", true)

    doctypes: ->
        doctypesView = new DoctypesView()
        doctypesView.render()	
        dcView = new DoctypeCollectionView()
        dcView.render()

    search: ->
        searchView = new SearchView()
        searchView.render()
        rcView = new ResultCollectionView()
        rcView.render()