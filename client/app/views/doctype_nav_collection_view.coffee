ViewCollection = require '../lib/view_collection'
DoctypeCollection = require '../collections/doctype_collection'
DoctypeNavView = require './doctype_nav_view'

module.exports = class DoctypeNavCollectionView extends ViewCollection

    itemview: DoctypeNavView
    collection: new DoctypeCollection()

    initialize: ->
        console.log 'test'
        @collectionEl = '#doctype-nav-collection-view'
        console.log $(@collectionEl).length
        super
        @collection.fetch()
        @views = {}
        @listenTo @collection, "reset", @onReset