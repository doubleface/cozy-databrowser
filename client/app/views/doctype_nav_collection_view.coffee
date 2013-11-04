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
            parentLi = $(this).parent('li')
            hasSubmenu = parentLi.children('.submenu').length > 0
            openLi = $('#doctype-nav-collection-view li.open')
            parentsLi = $(this).parentsUntil '#doctype-nav-collection-view', 'li'

            if not hasSubmenu
                $('#doctype-nav-collection-view li').removeClass 'active'
                parentsLi.addClass 'active'
                parentLi.addClass 'active'

