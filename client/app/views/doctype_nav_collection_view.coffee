ViewCollection = require '../lib/view_collection'
DoctypeCollection = require '../collections/doctype_collection'
DoctypeNavView = require './doctype_nav_view'

module.exports = class DoctypeNavCollectionView extends ViewCollection

    itemview: DoctypeNavView

    initialize: ->
        @collection = new DoctypeCollection()
        @collectionEl = '#doctype-nav-collection-view'
        super
        @collection.fetch
            reset : true
            data: $.param({"menu" : true})
        @views = {}
        @listenTo @collection, "reset", @onReset

