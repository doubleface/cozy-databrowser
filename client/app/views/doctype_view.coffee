View = require './../lib/view'

module.exports = class DoctypeView extends View

    tagName: 'tr'
    className: 'doctype-list-item'

    render: ->
        super
            name: @model.get("name")
            metadoctype : @model.get("metadoctype")
            sum : @model.get("sum")

    template: ->
        require './templates/doctype'

    events : {
    	'click .more-info' : 'showDescription'
    }

    showDescription: () ->
        console.log('showDescription')
        #console.log(event)
        #jqObj.closest("." + @className).after('<tr><td colspan="3">test</td></tr>')