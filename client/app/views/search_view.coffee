BaseView = require '../lib/base_view'
ResultCollectionView = require '../views/result_collection_view'
ResultsGlobalControlsView = require '../views/results_global_controls_view'
MetaInfosModel = require './../models/meta_infos_model'
ResultsMetaInfosView = require '../views/results_meta_infos_view'

module.exports = class SearchView extends BaseView

    el: '#results-list'
    template: require('./templates/search')
    hasDoctype : false

    initialize : (options) ->
        @options = options
        @resultsGlobalControlsView = new ResultsGlobalControlsView(@options)
        if @options.doctype and @options.doctype.length > 0
            metaInfosModel = new MetaInfosModel()
            $('#results-meta-infos').empty()
            @hasDoctype = true
            metaInfosModel.fetch
                data: $.param
                    doctype : @options.doctype[0]
                success : (col, data) ->
                    if data and data.name and (data.application or data.metadoctype)
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
        else
            @hasDoctype = false


    afterRender : ->
        if @hasDoctype
            @resultCollectionView.render()

            #resize event trigger 1 or + pages (infinite scroll)
            $(window).bind 'resize', =>
                $('#btn-scroll-up').show()
                @resultCollectionView.loopFirstScroll()


    loadMore : (isTriggered)->
        @resultCollectionView.loadNextPage isTriggered

    events :
        'click #launch-search' : 'launchSearch'

    # launchSearch : ->
    #     @resultCollectionView.search($('#search-field').val())