View = require './../lib/view'
localStore = require './../helpers/oLocalStorageHelper'

module.exports = class ResultsMetaInfosView extends View

    el: '#results-meta-infos'

    events :
        'click #close-about-doctype': 'hideMetaInfos'

    #-------------------------BEGIN VIEW BEHAVIOR-------------------------------
    template: ->
        require './templates/results_meta_infos'
    #--------------------------END VIEW BEHAVIOR--------------------------------


    #--------------------------BEGIN META INFORMATION---------------------------
    hideMetaInfos: (event) ->

        #---Hide element
        jqObj = $('.about-doctype')
        jqObj.removeClass('white-and-green')
        $('#results-meta-infos').hide()

        #----Local store hidden status
        localStore.setBoolean localStore.keys.isMetaInfoVisible, false
    #---------------------------END META INFORMATION ---------------------------




