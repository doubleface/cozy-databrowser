View = require './../lib/view'

module.exports = class ResultsMetaInfosView extends View

    el: '#results-meta-infos'

    template: ->
        require './templates/results_meta_infos'

    # initialize : (model) ->
    #     @render model

    # render: (model) ->
    #     super
    #         name: model.name


