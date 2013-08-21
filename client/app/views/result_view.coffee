View = require './../lib/view'

module.exports = class ResultView extends View

    tagName: 'div'
    className: 'result-list-item'

    render: ->
        super
        	no_result : @model.get("no_result")
        	value : @model.get("value")

    template: ->
        require './templates/result'
