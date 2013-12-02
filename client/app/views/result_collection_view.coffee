ViewCollection = require '../lib/view_collection'
ResultCollection = require '../collections/result_collection'
ResultView = require './result_list_view'
TableResultView = require './result_table_view'

module.exports = class ResultCollectionView extends ViewCollection

    itemview: TableResultView
    collectionEl :'#result-view-as-table'
    isLoading : false
    noMoreItems : false

    initialize: (options) ->
        @options = options
        @collection = new ResultCollection()
        if @options.presentation?
            switch @options.presentation
                when 'list'
                    @itemview = ResultView
                    @collectionEl ='#basic-accordion'
                when 'table'
                    @itemview = TableResultView
                    @collectionEl = '#result-view-as-table'
                else
                    @itemview = TableResultView
                    @collectionEl = '#result-view-as-table'

        super
        if @options.doctypes?
            if @options.presentation is 'table'
                @collection.nbPerPage = 0
                $('#results-list').undelegate 'th .icon-eye-close', 'click'
                $('#results-list').undelegate 'button.show-col', 'click'
            @collection.fetch
                data: $.param(@options)
                success : (col, data) =>
                    $('.loading-image').remove()
                    #native size of the window can trigger next pages and scroll
                    if @options.range? and @options.doctypes?
                        if data.length is @collection.nbPerPage
                            @loopFirstScroll()
                            $('.load-more-result').show()

                        else
                            @noMoreItems = true
                            $('.load-more-result').hide()
                    if @options.presentation is 'table'
                        $('#result-view-as-table').dataTable
                            "aoColumnDefs": [
                                {
                                    bSortable: false
                                    aTargets: [ -1 ]
                                }
                            ]
                            "oColVis":
                                "iOverlayFade": 200
                            "sDom": 'CRt'

                error : =>
                    $('.loading-image').remove()
                    @noMoreItems = true
                    @displayLoadingError()


    render: ->
        $('.introduction').hide()
        if @options? and @options.doctypes?
            loader = '<div class="loading-image">'
            loader += '<img src="images/ajax-loader.gif" />'
            loader += '</div>'
            $('#all-result').append(loader)
        view.$el.detach() for id, view of @views
        super

    search : (content) ->
        @options['query'] = content
        @collection.fetch
            data: $.param(@options)

    loadNextPage : (isTriggered, callback) ->
        @options['deleted'] = @deleted
        if !@noMoreItems
            @isLoading = true
            @collection.page++
            if !isTriggered
                $('.load-more-result i, .load-more-result span').hide()
                $('.load-more-result').spin 'tiny'
            @collection.fetch
                data: $.param(@options)
                remove : false
                success : (col, data) =>
                    if data.length?
                        if !isTriggered
                            $('.load-more-result .spinner').hide()
                            $('.load-more-result i').show()
                            $('.load-more-result span').show()
                        isDone = data.length < @collection.nbPerPage
                        @noMoreItems = isDone
                        if @noMoreItems
                            $('.load-more-result').hide()
                        @isLoading = false
                        if callback?
                            callback()
                    else
                        @noMoreItems = true
                error: ->
                    @noMoreItems = true
                    @displayLoadingError()

    loopFirstScroll: ->
        if !@isLoading and !@noMoreItems
            firstScroll = $(document).height() is $(window).height()
            if (firstScroll)
                @loadNextPage true, =>
                    @loopFirstScroll()

    displayLoadingError: ->
        $('.load-more-result').css {'color' : '#AF4434'}
        $('.load-more-result i').hide()
        errorMsg = 'An error occurs during the loading process'
        $('.load-more-result span').text errorMsg
        $('.load-more-result').show()