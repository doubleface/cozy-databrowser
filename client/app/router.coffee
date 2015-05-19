#Required backbone classes
DoctypeNavView = require 'views/doctype_nav_view'
SearchView = require 'views/search_view'

#Define Router class
module.exports = class Router extends Backbone.Router

    routes:
        '': 'search'
        'search' : 'search'
        'search/all/:doctype' : 'search'

    initialize: ->

        #Initialize the left menu 'doctype nav'
        new DoctypeNavView()

    search : (query) ->
        options = {}
        if query?
            options['range'] = 'all'
            options['doctypes'] = [query]
            Backbone.trigger 'change:section', Backbone.history.fragment

        searchView = new SearchView options
        searchView.render()