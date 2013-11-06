View = require './../lib/view'

module.exports = class ResultsGlobalControlsView extends View

    el: '#results-global-controls'

    events :
        'mouseover .remove-result' : 'convertButtonToDanger'
        'mouseout .remove-result' : 'convertButtonToClassic'

    convertButtonToDanger: (event) ->
        jqObj = $(event.currentTarget)
        jqObj.addClass 'btn-danger'
        jqObj.children('span').text('Delete all ')

    convertButtonToClassic: (event) ->
        jqObj = $(event.currentTarget)
        jqObj.removeClass 'btn-danger'
        jqObj.children('span').empty()

    template: ->
        require './templates/results_global_controls'

    initialize : (opt) ->
        @render opt

    render: (opt) =>
        super
            range : opt.range
            doctype : opt.doctype
            max : "x"
