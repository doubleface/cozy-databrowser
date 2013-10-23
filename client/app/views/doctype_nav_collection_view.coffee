ViewCollection = require '../lib/view_collection'
DoctypeCollection = require '../collections/doctype_collection'
DoctypeNavView = require './doctype_nav_view'

module.exports = class DoctypeNavCollectionView extends ViewCollection

    itemview: DoctypeNavView
    collection: new DoctypeCollection()

    initialize: ->

        @collectionEl = '#doctype-nav-collection-view'
        super
        @collection.fetch {
            data: $.param({"menu" : true})
        }
        @views = {}
        @listenTo @collection, "reset", @onReset