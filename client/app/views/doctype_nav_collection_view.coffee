ViewCollection = require '../lib/view_collection'
DoctypeCollection = require '../collections/doctype_collection'
DoctypeNavView = require './doctype_nav_view'

module.exports = class DoctypeNavCollectionView extends ViewCollection

    itemview: DoctypeNavView
    collection : new DoctypeCollection()
    collectionEl : '#doctype-nav-collection-view'
    el : '#doctype-nav-collection-view'

    initialize: ->
        @bindMenuResponsive()
        @collection.fetch
            data: $.param
                'menu' : true
        @views = {}
        @listenTo @collection, "reset", @onReset
        super

    bindMenuResponsive: ->
        $('#menu-toggler').on 'click', ->
            $('#sidebar').toggleClass('display')
            $(this).toggleClass('display')
            return false
        $(window).resize =>

