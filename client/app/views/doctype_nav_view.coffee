DoctypeCollection = require '../collections/doctype_collection'

module.exports = class DoctypeNavCollectionView extends Backbone.View

    collection : new DoctypeCollection()
    el : '#doctype-nav-collection-view'

    events:
        "click li": "onClick"

    initialize: ->
        @collection.fetch
            data: $.param
                'menu' : true
        @listenTo @collection, "sync", @onSync
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

    render: ->

    onClick: (e) ->
        @$('li').each -> $(@).removeClass 'active'
        $(e.currentTarget).addClass 'active'

