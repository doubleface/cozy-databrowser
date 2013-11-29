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

    search : (query) ->
        options = {}
        options['presentation'] = 'table'

        if query?
            splittedQuery = query.split('&&')
            doctypePattern = splittedQuery[0]

            #Add doctypePattern as an array
            if not /\|/.test decodeURIComponent(doctypePattern)
                options['doctypes'] = [doctypePattern]
            else
                options['doctypes'] = decodeURIComponent(doctypePattern).split /\|/

            #Add the range 'all'
            options['range'] = 'all'

            if splittedQuery.length > 1
                parsedQuery = @parseQueryString splittedQuery[1]
                if parsedQuery.presentation?
                    options['presentation'] = parsedQuery.presentation


        #Create Search view (with option) and render
        searchView = new SearchView(options)
        searchView.render()

    parseQueryString: (queryString) ->
        params = {}
        if queryString
            _.each _.map(decodeURI(queryString).split(/&/g), (el, i) ->
                aux = el.split("=")
                o = {}
                if aux.length >= 1
                    val = 'undefined'
                    val = aux[1]  if aux.length is 2
                    o[aux[0]] = val
                return o
            ), (o) ->
              _.extend params, o

        return params
