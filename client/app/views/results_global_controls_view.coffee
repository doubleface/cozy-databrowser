View = require './../lib/view'
DeleteAllModel = require './../models/delete_all_model'
app = require 'application'
localStore = require './../helpers/oLocalStorageHelper'

module.exports = class ResultsGlobalControlsView extends View

    el: '#results-global-controls'
    currentDoctype: ''
    templateModal: require('./templates/modal_confirm')

    events :
        'mouseover #delete-all' : 'switchStyleOfDeleteButton'
        'mouseout #delete-all' : 'switchStyleOfDeleteButton'
        'click #delete-all' : 'confirmDeleteAll'
        'click .about-doctype' : 'toogleMetaInfos'
        'click .view-switcher' : 'switchToTableView'

    #-------------------------BEGIN VIEW BEHAVIOR-------------------------------
    template: ->
        require './templates/results_global_controls'

    initialize : (opt) ->
        @opt = opt
        $(@el).undelegate '.about-doctype', 'click'
        $(@el).undelegate '.view-switcher', 'click'
        $(@el).undelegate '#delete-all', 'mouseover'
        $(@el).undelegate '#delete-all', 'mouseout'
        $(@el).undelegate '#delete-all', 'click'
        if opt.doctypes?
            @currentDoctype = opt.doctypes[0] || ''
        @render opt

    render: (opt) =>
        templateData = {}
        isList = opt.presentation and (opt.presentation is 'list')
        iconPresentation = if isList then 'icon-th' else 'icon-list-alt'
        templateData['icon_presentation'] = iconPresentation
        templateData['range'] = if opt.range then '(' + opt.range + ')' || ''
        templateData['doctype'] = if opt.doctypes then opt.doctypes[0] else ''
        if opt.displayName and (opt.displayName isnt '')
            templateData['doctype'] = opt.displayName
        templateData['hasMetainfos'] = if opt.hasMetaInfos then true
        isMetaInfoVisible = @isMetaInfoVisible()
        templateData['isVisible'] = isMetaInfoVisible
        if isMetaInfoVisible then $('#results-meta-infos').show()
        super templateData
    #-------------------------BEGIN VIEW BEHAVIOR-------------------------------

    #----------------------BEGIN TABLE/LIST VIEW SWITCHER-----------------------
    switchToTableView:  (event) =>
        viewSwitcher = $(event.currentTarget)
        presentation = 'table'
        if @currentDoctype
            if viewSwitcher.hasClass('icon-th')
                presentation = 'table'
                viewSwitcher.removeClass('icon-th').addClass('icon-list-alt')
            else
                presentation = 'list'
                viewSwitcher.removeClass('icon-list-alt').addClass('icon-th')
            presentationQuery = '&&presentation=' + presentation
            tableRoute = 'search/all/' + @currentDoctype + presentationQuery
            app.router.navigate tableRoute, {replace: true, trigger : true}
    #-----------------------END TABLE/LIST VIEW SWITCHER------------------------


    #--------------------------BEGIN META INFORMATION---------------------------
    isMetaInfoVisible : ->
        return localStore.getBoolean localStore.keys.isMetaInfoVisible

    toogleMetaInfos: (event) ->
        jqObj = $(event.currentTarget)
        if jqObj.hasClass 'white-and-green'
            jqObj.removeClass('white-and-green')
            $('#results-meta-infos').hide()
            localStore.setBoolean localStore.keys.isMetaInfoVisible, false
        else
            jqObj.addClass('white-and-green')
            $('#results-meta-infos').show()
            localStore.setBoolean localStore.keys.isMetaInfoVisible, true
    #---------------------------END META INFORMATION ---------------------------

    #----------------------------BEGIN DELETE ALL-------------------------------
    switchStyleOfDeleteButton: (event) ->
        jqObj = $(event.currentTarget)
        if not jqObj.hasClass 'btn-danger'
            jqObj.addClass 'btn-danger'
            jqObj.children('span').text t('delete all') + ' '
        else
            jqObj.removeClass 'btn-danger'
            jqObj.children('span').empty()

    confirmDeleteAll : (e) ->
        e.preventDefault()
        message = 'Are you ABSOLUTELY sure ? '
        message += 'It could lead to IRREVERSIBLE DAMAGES '
        message += 'to your cozy environment.'
        data =
            title: t 'Confirmation required'
            body: t 'are you absolutely sure'
            confirm: t 'delete permanently'

        $("body").prepend @templateModal(data)
        $("#confirmation-dialog").modal()
        $("#confirmation-dialog").modal("show")
        $("#confirmation-dialog-confirm").unbind 'click'
        $("#confirmation-dialog-confirm").bind "click", =>
            @deleteAll()

    deleteAll: ->
        if @currentDoctype? and @currentDoctype isnt ''
            deleteAllModel = new DeleteAllModel()
            deleteAllModel.fetch
                type: 'DELETE'
                url : deleteAllModel.urlRoot + '?' + $.param
                    doctype : @currentDoctype
                success : (col, data) ->
                    location.reload()
    #-----------------------------END DELETE ALL--------------------------------

