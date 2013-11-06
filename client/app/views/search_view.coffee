BaseView = require '../lib/base_view'
ResultCollectionView = require '../views/result_collection_view'
ResultsGlobalControlsView = require '../views/results_global_controls_view'
MetaInfosModel = require './../models/meta_infos_model'
ResultsMetaInfosView = require '../views/results_meta_infos_view'

module.exports = class SearchView extends BaseView

    el: '#results-list'
    template: require('./templates/search')

    initialize : (options) ->
        @options = options
        @resultsGlobalControlsView = new ResultsGlobalControlsView(@options)
        metaInfosModel = new MetaInfosModel()
        metaInfosModel.fetch
            data: $.param
                doctype : @options.doctype[0]
            success : (col, data) ->
                resultsMetaInfosView = new ResultsMetaInfosView()
                resultsMetaInfosView.render(data)

        @resultCollectionView = new ResultCollectionView(@options)

        #scroll event trigger next page (infinite scroll)
        if @options.range?
            $(window).bind 'scroll', (e, isTriggered) =>
                if !@resultCollectionView.isLoading and !@resultCollectionView.noMoreItems
                    docHeight = $(document).height()
                    if $(window).scrollTop() + $(window).height() is docHeight
                        @loadMore(isTriggered)

    afterRender : ->
        @resultCollectionView.render()

        #resize event trigger 1 or + pages (infinite scroll)
        $(window).bind 'resize', =>
            @resultCollectionView.loopFirstScroll()

    loadMore : (isTriggered)->
        @resultCollectionView.loadNextPage isTriggered

    events :
        'click #launch-search' : 'launchSearch'

    # launchSearch : ->
    #     @resultCollectionView.search($('#search-field').val())