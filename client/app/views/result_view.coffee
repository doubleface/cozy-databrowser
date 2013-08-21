View = require './../lib/view'

module.exports = class ResultView extends View

    tagName: 'div'
    className: 'result-list-item'

    render: ->
        super
            test: @model.get("test")

    template: ->
        require './templates/result'
