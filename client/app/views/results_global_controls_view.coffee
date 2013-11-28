View = require './../lib/view'
DeleteAllModel = require './../models/delete_all_model'
app = require 'application'

module.exports = class ResultsGlobalControlsView extends View

    el: '#results-global-controls'
    currentDoctype: ''
    templateModal: require('./templates/modal_confirm')

    events :
        'mouseover #delete-all' : 'switchStyleOfDeleteButton'
        'mouseout #delete-all' : 'switchStyleOfDeleteButton'
        'click #delete-all' : 'confirmDeleteAll'
        'click .about-doctype' : 'showMetaInfos'
        'click .view-switcher' : 'switchToTableView'

    switchToTableView:  (event) =>
        $('#results-list').undelegate 'th .icon-eye-close', 'click'
        $('#results-list').undelegate 'button.show-col', 'click'
        viewSwitcher = $(event.currentTarget)
        presentation = 'list'
        if @currentDoctype
            if viewSwitcher.hasClass('icon-th')
                presentation = 'table'
                viewSwitcher.removeClass('icon-th').addClass('icon-list-alt')
            else
                presentation = 'list'
                viewSwitcher.removeClass('icon-list-alt').addClass('icon-th')
            tableRoute =  'search/all/' + @currentDoctype + '&&presentation=' + presentation
            app.router.navigate tableRoute, {replace: true, trigger : true}

    showMetaInfos: (event) ->
        jqObj = $(event.currentTarget)
        if jqObj.hasClass 'white-and-green'
            jqObj.removeClass('white-and-green')
            $('#results-meta-infos').hide()
        else
            jqObj.addClass('white-and-green')
            $('#results-meta-infos').show()

    switchStyleOfDeleteButton: (event) ->
        jqObj = $(event.currentTarget)
        if not jqObj.hasClass 'btn-danger'
            jqObj.addClass 'btn-danger'
            jqObj.children('span').text('Delete all ')
        else
            jqObj.removeClass 'btn-danger'
            jqObj.children('span').empty()


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
        templateData['icon_presentation'] = if opt.presentation and (opt.presentation is 'table') then 'icon-list-alt' else 'icon-th'
        templateData['range'] = if opt.range then '(' + opt.range + ')' || ''
        templateData['doctype'] = if opt.doctypes then opt.doctypes[0] else ''
        if opt.displayName and (opt.displayName isnt '')
            templateData['doctype'] = opt.displayName
        templateData['hasMetainfos'] = if opt.hasMetaInfos then true
        jqMetaInfos = $('#results-meta-infos')
        templateData['isVisible'] = if jqMetaInfos.is ':visible' then true



        super templateData

    confirmDeleteAll : (e) ->
        e.preventDefault()
        message = 'Are you ABSOLUTELY sure ? '
        message += 'It could lead to IRREVERSIBLE DAMAGES to your cozy environment.'
        data =
            title: 'Confirmation required'
            body: message
            confirm: 'delete permanently'

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