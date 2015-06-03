#Required backbone classes
BaseView = require '../lib/base_view'
ResultCollectionView = require '../views/result_collection_view'
DeleteAllModel = require '../models/delete_all_model'

#Define SearchView class
module.exports = class SearchView extends BaseView

    el: '#results-list'
    template: require('./templates/search')
    templateModal: require('./templates/modal_confirm')
    hasDoctype : false
    events :
        'click #btn-scroll-up' : 'hideThis'
        'mouseover #delete-all' : 'switchStyleOfDeleteButton'
        'mouseout #delete-all' : 'switchStyleOfDeleteButton'
        'click #delete-all' : 'confirmDeleteAll'

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

    #-------------------------BEGIN VIEW BEHAVIOR-------------------------------
    initialize : (options) =>
        @options = options
        @hasDoctype = @options.doctypes and @options.doctypes.length > 0
        @bindSearch()

        if @hasDoctype
            @currentDoctype = @options.doctypes[0]

            #Add the results
            @resultCollectionView = new ResultCollectionView @options

            #scroll event trigger next page (infinite scroll)
            if @options.range?
                $(window).bind 'scroll', (e, isTriggered) =>
                    docHeight = $(document).height()
                    noMoreItems = @resultCollectionView.noMoreItems
                    if not @resultCollectionView.isLoading and not noMoreItems
                        winHeight = $(window).scrollTop() + $(window).height()
                        if winHeight is docHeight
                            @loadMore isTriggered
                    if $(window).scrollTop() > 0
                        $('#btn-scroll-up').show()
                    else
                        $('#btn-scroll-up').hide()
        @render()

    afterRender : ->
        if @hasDoctype
            @resultCollectionView.render()

            #resize event trigger 1 or + pages (infinite scroll)
            $(window).bind 'resize', =>
                @resultCollectionView.loopFirstScroll()
            @bindSearch()
    #--------------------------END VIEW BEHAVIOR--------------------------------

    #-----------------------BEGIN SCROLL TO TOP BUTTON--------------------------
    hideThis : (event) ->
        jqObj = $(event.currentTarget)
        jqObj.hide()
    #------------------------END SCROLL TO TOP BUTTON---------------------------


    #-----------------------------BEGIN COLLECTION------------------------------
    loadMore : (isTriggered)->
        @resultCollectionView.loadNextPage isTriggered

    #------------------------------END COLLECTION-------------------------------


    #-------------------------------BEGIN SEARCH--------------------------------
    bindSearch: ->
        searchElt = $('#launch-search')
        searchField = $('#search-field')
        searchElt.unbind 'click'
        searchField.unbind 'keypress'
        searchElt.click =>
            @resultCollectionView.search(searchField.val())
        searchField.attr 'placeholder', t 'search-placeholder'
        searchField.keypress (event) ->
            if event.which is 13
                event.preventDefault()
                searchElt.click()
    #--------------------------------END SEARCH---------------------------------
