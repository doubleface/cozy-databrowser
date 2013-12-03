View = require './../lib/view'
DeleteAllModel = require './../models/delete_all_model'
app = require 'application'
localStore = require './../helpers/oLocalStorageHelper'

module.exports = class ResultsGlobalControlsView extends View

    el: '#results-global-controls'
    templateModal: require('./templates/modal_confirm')
    currentDoctype: ''

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

        #---- Clean and ensure that all methods are re-delegate to new controls
        $(@el).undelegate '.about-doctype', 'click'
        $(@el).undelegate '.view-switcher', 'click'
        $(@el).undelegate '#delete-all', 'mouseover'
        $(@el).undelegate '#delete-all', 'mouseout'
        $(@el).undelegate '#delete-all', 'click'

        #---- set current doctypes (waiting multiple doctype)
        if @opt.doctypes?
            @currentDoctype = @opt.doctypes[0] || ''

        #render view with options
        @render @opt

    render: (opt) =>

        #----Prepare template datas
        templateData = {}

        #--icon associate to presentation
        isList = opt.presentation and (opt.presentation is 'list')
        iconPresentation = if isList then 'icon-th' else 'icon-list-alt'
        templateData['icon_presentation'] = iconPresentation

        #--general infos for 'currently exploring'
        templateData['range'] = if opt.range then '(' + opt.range + ')' || ''
        templateData['doctype'] = if opt.doctypes then opt.doctypes[0] else ''
        if opt.displayName and (opt.displayName isnt '')
            templateData['doctype'] = opt.displayName

        #--visibility of metainfos
        templateData['hasMetainfos'] = if opt.hasMetaInfos then true
        isMetaInfoVisible = @isMetaInfoVisible()
        templateData['isVisible'] = isMetaInfoVisible
        if isMetaInfoVisible then $('#results-meta-infos').show()

        #----apply ancestor method
        super templateData
    #--------------------------END VIEW BEHAVIOR--------------------------------

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
            @storePresentation presentation
            presentationQuery = '&&presentation=' + presentation
            tableRoute = 'search/all/' + @currentDoctype + presentationQuery
            app.router.navigate tableRoute,
                replace: true
                trigger : true

    prepareStoragePresentationKey: ->
        key = @currentDoctype.toLowerCase()
        key += localStore.keys.separation + localStore.keys.isListPresentation
        return key
    isListPresentation: ->
        key = @prepareStoragePresentationKey()
        return localStore.getBoolean key

    storePresentation: (presentation) ->
        isList = if presentation isnt 'table' then true else false
        key = @prepareStoragePresentationKey()
        localStore.setBoolean key, isList
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
        data =
            title: t 'confirmation required'
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
                    app.router.navigate 'search',
                        replace: true
                        trigger : true
                    location.reload()
    #-----------------------------END DELETE ALL--------------------------------

