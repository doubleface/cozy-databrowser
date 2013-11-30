View = require './../lib/view'
localStore = require './../helpers/oLocalStorageHelper'

module.exports = class ResultsMetaInfosView extends View

    el: '#results-meta-infos'

    events :
        'click #close-about-doctype': 'hideMetaInfos'

    hideMetaInfos: (event) ->
        jqObj = $('.about-doctype')
        jqObj.removeClass('white-and-green')
        $('#results-meta-infos').hide()
        localStore.setBoolean localStore.keys.isMetaInfoVisible, false

    template: ->
        require './templates/results_meta_infos'


