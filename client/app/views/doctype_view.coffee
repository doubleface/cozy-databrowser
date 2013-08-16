View = require './../lib/view'

module.exports = class DoctypeView extends View

    tagName: 'li'
    className: 'doctype-list-item'

    render: ->
        super
            name: @model.get("name")

    template: ->
        require './templates/doctype'