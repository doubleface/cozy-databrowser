#Required backbone classes
BaseView = require '../lib/base_view'
ResultCollectionView = require '../views/result_collection_view'
ResultsGlobalControlsView = require '../views/results_global_controls_view'
MetaInfosModel = require './../models/meta_infos_model'
ResultsMetaInfosView = require '../views/results_meta_infos_view'

#Required helpers objects
localStore = require './../helpers/oLocalStorageHelper'

#Define SearchView class
module.exports = class SearchView extends BaseView

    el: '#results-list'
    template: require('./templates/search')
    hasDoctype : false
    events :
        'click #btn-scroll-up' : 'hideThis'

    #-------------------------BEGIN VIEW BEHAVIOR-------------------------------
    initialize : (options) =>
        @options = options
        @hasDoctype = @options.doctypes and @options.doctypes.length > 0
        @hasPresentation = @options.presentation?
        @bindSearch()

        if @hasDoctype

            #apply stored presentation
            if not @hasPresentation
                @applyStoredPresentation()


            #Add the results
            @resultCollectionView = new ResultCollectionView @options

            #Prepare meta-informations
            metaInfosModel = new MetaInfosModel()
            $('#results-meta-infos').empty()

            metaInfosModel.fetch
                data: $.param
                    doctype : @options.doctypes[0]
                success : (col, data) =>

                    #Add the meta information panel
                    @applyMetaInformation data

                    #Add the top bar Global Controls
                    @applyGlobalControls()


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

    afterRender : ->
        if @hasDoctype
            @resultCollectionView.render()

            #resize event trigger 1 or + pages (infinite scroll)
            $(window).bind 'resize', =>
                @resultCollectionView.loopFirstScroll()
            @bindSearch()
    #--------------------------END VIEW BEHAVIOR--------------------------------


    #--------------------------BEGIN META INFORMATION---------------------------
    applyMetaInformation: (data) ->
        if data and data.name and(data.application or data.metadoctype)

            #Add the container Meta Infos
            resultsMetaInfosView = new ResultsMetaInfosView()
            resultsMetaInfosView.render data
            @options['hasMetaInfos'] = true
            @options['displayName'] = data.displayName
            @options['resultsCollection'] = @resultCollectionView
    #---------------------------END META INFORMATION ---------------------------


    #--------------------------BEGIN META INFORMATION---------------------------
    applyGlobalControls: ->
        @resultsGlobalControlsView = new ResultsGlobalControlsView @options
    #---------------------------END META INFORMATION ---------------------------


    #-----------------------BEGIN SCROLL TO TOP BUTTON--------------------------
    hideThis : (event) ->
        jqObj = $(event.currentTarget)
        jqObj.hide()
    #------------------------END SCROLL TO TOP BUTTON---------------------------


    #-----------------------------BEGIN COLLECTION------------------------------
    loadMore : (isTriggered)->
        @resultCollectionView.loadNextPage isTriggered

    applyStoredPresentation : ->
        key = @options.doctypes[0].toLowerCase()
        key += localStore.keys.separation + localStore.keys.isListPresentation
        if localStore.getBoolean key
            @options['presentation'] = 'list'
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
        searchField.keypress (event) =>
            if event.which is 13
                event.preventDefault()
                searchElt.click()
    #--------------------------------END SEARCH---------------------------------
