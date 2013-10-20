ViewCollection = require '../lib/view_collection'
DtCddlView = require './dt_cddl_view'
DoctypeCollection = require '../collections/doctype_collection'

module.exports = class DtCddlCollectionView extends ViewCollection

    itemview: DtCddlView
    collection: new DoctypeCollection()

    initialize: ->
        @collectionEl = '#dt-cddl-list'
        super
        @collection.fetch()
        @views = {}
        @listenTo @collection, "reset", @onReset
