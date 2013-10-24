View = require './../lib/view'

module.exports = class DoctypeNavView extends View

    tagName: 'li'
    className: 'doctype-list-item'

    render: ->
        super
            name : @model.get('name')
            value : @model.get('value')

    template: ->
        require './templates/doctype_nav'

