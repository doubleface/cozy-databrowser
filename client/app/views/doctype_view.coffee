View = require './../lib/view'

module.exports = class DoctypeView extends View

    tagName: 'tr'
    className: 'doctype-list-item'

    render: ->
        super
            name: @model.get("name")

    template: ->
        require './templates/doctype'