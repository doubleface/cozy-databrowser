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
        doctypesView = new DoctypesView()
        doctypesView.render()	
        dcView = new DoctypeCollectionView()
        dcView.render()

    search: (doctype) ->
        searchView = new SearchView()
        searchView.render()
        rcView = new ResultCollectionView({'arg' :'1'})
        rcView.render()