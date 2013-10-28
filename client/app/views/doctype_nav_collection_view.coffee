ViewCollection = require '../lib/view_collection'
DoctypeCollection = require '../collections/doctype_collection'
DoctypeNavView = require './doctype_nav_view'

module.exports = class DoctypeNavCollectionView extends ViewCollection

    itemview: DoctypeNavView

    initialize: ->
        that = this
        @collection = new DoctypeCollection()
        @collectionEl = '#doctype-nav-collection-view'
        super
        @collection.fetch
            data: $.param({"menu" : true})
            success : (col, data) ->
                that.setMenuBehavior()
        @views = {}
        @listenTo @collection, "reset", @onReset

    setMenuBehavior: ->
        $('#doctype-nav-collection-view a').click ->
            $('#doctype-nav-collection-view li').removeClass 'active'
            openLi = $('#doctype-nav-collection-view li.open')
            parentsLi = $(this).parentsUntil '#doctype-nav-collection-view', 'li'
            parentLi = $(this).parent('li')
            if parentLi.children('.submenu').length is 0
                openLi.addClass 'active'
                parentLi.addClass 'active'

