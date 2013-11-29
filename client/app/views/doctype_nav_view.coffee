View = require './../lib/view'

module.exports = class DoctypeNavView extends View

    tagName: 'li'
    className: 'doctype-list-item'

    render: ->
        super
            category : @model.get('name')
            value : @model.get('value')
            icons :
                all : 'icon-list'
                applications : 'icon-download-alt'
                sources : 'icon-map-marker'

    template: ->
        require './templates/doctype_nav'


    # getActive: ->
    #     console.log @model.get('name')

