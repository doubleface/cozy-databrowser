DoctypeCollection = require '../collections/doctype_collection'

module.exports = class DoctypeNavCollectionView extends Backbone.View

    collection : new DoctypeCollection()
    el : '#doctype-nav-collection-view'

    initialize: ->
        @collection.fetch
            data: $.param
                'menu' : true
        @listenTo @collection, "sync", @onSync
        @listenTo Backbone, "change:section", @onChangeSection
        return @

    onSync: ->
        html = ""
        @collection.each (model) ->
            json = model.toJSON()
            html+= """
            <li>
                <a href="#search/all/#{json.doctype}">
                    <span class="menu-text firstLetterUp">#{json.doctype} (#{json.sum})</span>
                </a>
            </li>

            """
        @$el.append html
        @onChangeSection @section

    render: ->

    onChangeSection: (section) ->
        @$('li').each -> $(@).removeClass 'active'
        @$("a[href='#" + section + "']").closest('li').addClass 'active'
        @section = section

