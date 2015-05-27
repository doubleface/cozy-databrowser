#Required backbone classes
BaseView = require '../lib/base_view'
ResultCollectionView = require '../views/result_collection_view'

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

    applyStoredPresentation : ->
        key = @options.doctypes[0].toLowerCase()
        key += localStore.keys.separation + localStore.keys.isListPresentation
        if localStore.getBoolean key
            @options['presentation'] = 'list'
        else
            @options['presentation'] = 'table'
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
