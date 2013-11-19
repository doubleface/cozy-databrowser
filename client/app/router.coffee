#Required backbone classes
DoctypeNavCollectionView = require 'views/doctype_nav_collection_view'
SearchView = require 'views/search_view'

#Define Router class
module.exports = class Router extends Backbone.Router

    routes:
        '': 'search'
        'search' : 'search'
        'search/all/:doctype' : 'search'

    initialize: ->

        #Initialize the left menu 'doctype nav'
        doctypeNavCollectionView = new DoctypeNavCollectionView()
        doctypeNavCollectionView.render()

    search : (doctypePattern) ->
        options = {}

        if doctypePattern?

            #Add doctypePattern as an array
            if not /\|/.test decodeURIComponent(doctypePattern)
                options['doctypes'] = [doctypePattern]
            else
                options['doctypes'] = decodeURIComponent(doctypePattern).split /\|/

            #Add the range 'all'
            options['range'] = 'all'

        #Create Search view (with option) and render
        searchView = new SearchView(options)
        searchView.render()