View = require './../lib/view'

module.exports = class DoctypeNavView extends View

    tagName: 'li'
    className: 'doctype-list-item'

    render: ->
        super
            name: @model.get("name")
            #metadoctype : @model.get("metadoctype")
            #sum : @model.get("sum")
            #app : @model.get("app")

    template: ->
        require './templates/doctype_nav'

