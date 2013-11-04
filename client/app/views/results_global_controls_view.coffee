View = require './../lib/view'

module.exports = class ResultsGlobalControlsView extends View

    el: '.results-global-controls'

    template: ->
        require './templates/results_global_controls'

    initialize : (opt) ->
        @render opt

    render: (opt) =>
        console.log opt
        super
            range : opt.range
            doctype : opt.doctype
            max : "x"
