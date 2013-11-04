BaseView = require '../lib/base_view'
ResultCollectionView = require '../views/result_collection_view'
ResultsGlobalControlsView = require '../views/results_global_controls_view'
#DtCddlCollectionView = require '../views/dt_cddl_collection_view'
#CheckingDdl = require '../noesis-classes/CheckingDdl'

module.exports = class SearchView extends BaseView

    el: '#content'
    template: require('./templates/search')

    initialize : (options) ->
        that = this
        @options = options
        @resultsGlobalControlsView = new ResultsGlobalControlsView(@options)
        @rcView = new ResultCollectionView(@options)

        #scroll event trigger next page (infinite scroll)
        if @options.range?
            $(window).bind 'scroll', (e, isTriggered) ->
                if !that.rcView.isLoading and !that.rcView.noMoreItems
                    docHeight = $(document).height()
                    if $(window).scrollTop() + $(window).height() is docHeight
                        that.loadMore(isTriggered)

    afterRender : ->
        that = this
        @rcView.render()
        #@dtCddlCollectionView.render()

        #resize event trigger 1 or + pages (infinite scroll)
        $(window).bind 'resize', ->
            that.rcView.loopFirstScroll()

        #add search options
        #doctypes = ['test', 'test 2', 'test 3']
        #optionCddl = new CheckingDdl 'Doctypes : ', doctypes, '#search-options'


    loadMore : (isTriggered)->
        @rcView.loadNextPage isTriggered

    events :
        'click #launch-search' : 'launchSearch'

    # launchSearch : ->
    #     @rcView.search($('#search-field').val())