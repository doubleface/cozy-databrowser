View = require './../lib/view'

module.exports = class ResultsMetaInfosView extends View

    el: '#results-meta-infos'

    events :
        'click #close-about-doctype': 'showMetaInfos'

    showMetaInfos: (event) ->
        jqObj = $('.about-doctype')
        jqObj.removeClass('white-and-green')
        $('#results-meta-infos').hide()

    template: ->
        require './templates/results_meta_infos'


