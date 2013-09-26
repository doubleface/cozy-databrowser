BaseView = require '../lib/base_view'

module.exports = class DtCddlCollectionView extends ViewCollection

    itemview: DtCddlView
    collection: new DoctypeCollection()

    initialize: ->
        @collectionEl = '#dt-cddl-list'
        super
        @collection.fetch()     
        @views = {}
        @listenTo @collection, "reset",   @onReset
