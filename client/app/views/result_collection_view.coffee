ViewCollection = require '../lib/view_collection'
ResultCollection = require '../collections/result_collection'
ResultView = require './result_list_view'
TableResultView = require './result_table_view'

module.exports = class ResultCollectionView extends ViewCollection

    itemview: TableResultView
    collectionEl :'#result-view-as-table'
    isLoading : false
    noMoreItems : false
    firstRender: true

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

            @isLoading = true
            @collection.fetch
                reset: true
                data: $.param(@options)
                success : (col, data) =>
                    @isLoading = false
                    $('.loading-image').remove()
                    #native size of the window can trigger next pages and scroll
                    if @options.range? and @options.doctypes?
                        if data.length is @collection.nbPerPage
                            @loopFirstScroll()
                            $('.load-more-result').show()

                        else
                            @noMoreItems = true
                            $('.load-more-result').hide()

                error : =>
                    @isLoading = false
                    $('.loading-image').remove()
                    @noMoreItems = true
                    @displayLoadingError()

    onReset: ->
        # console.log "reset", @itemViewOptions().fields
        @oldFields = @collection.fields()
        @buildTable false
        super

    render: ->
        # console.log "render"
        $('.introduction').hide()
        if @options.presentation is 'table'
            if @firstRender
                @buildTable true
                @firstRender = false
            else
                @buildTable false

        # view.$el.detach() for id, view of @views
        @afterRender()
        if @isLoading
            $('#all-result').append """
                <div class="loading-image">
                    <img src="images/ajax-loader.gif" />
                </div>"""

    appendView: (view) ->
        # console.log "appendView", view.$el.find('td').length, @itemViewOptions().fields.length
        if @options.presentation is 'table'
            $('#result-view-as-table').dataTable().fnAddTr(view.$el[0])
        else
            super

    itemViewOptions: ->
        fields: _.without @oldFields, 'count'

    search : (content) ->
        @options['query'] = content
        @collection.fetch
            data: $.param(@options)

    loadNextPage : (isTriggered, callback) ->
        console.log "nextPage"
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

                        # force re-render if new fields have appeared
                        if @oldFields.length isnt
                          _.without(@collection.fields(), 'count').length
                            console.log "DIFF FIELDS"
                            console.log @oldFields
                            console.log @collection.fields()
                            @render()

                        if callback?
                            callback()
                    else
                        @noMoreItems = true
                error: ->
                    @isLoading = false
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


    makeTHead: () ->
        $('#result-view-as-table').find('thead').remove()
        htmlThead = '<thead><tr>'
        for fieldName in @itemViewOptions().fields
            htmlThead += "<th class=\"cozy_#{fieldName}\">#{fieldName}</th>"
        htmlThead += '<th class="cozy_action">Action</th>'
        htmlThead += '</tr></thead>'
        $('#result-view-as-table').prepend htmlThead

    buildTable: (firstRender) ->
        # console.log "buildTable", firstRender
        if not firstRender
            table = $('#result-view-as-table').dataTable()
            table.fnDestroy()

        @makeTHead()

        storedPath = 'DataTables_'+ window.location.hash
        $('#result-view-as-table').dataTable
            "bRetrieve": not firstRender
            "bPaginate": false
            "aoColumnDefs": [
                {
                    bSortable: false,
                    aTargets: [ 'cozy_docType', 'cozy_action' ]
                },
                {
                    bVisible: false,
                    aTargets: ['cozy__id', 'cozy_docType']
                }
            ]
            "oColVis":
                "iOverlayFade": 200
                buttonText: t 'button toggle visibility'
            "sDom": 'CRt'
            "bStateSave": true
            "fnStateSave": (oSettings, oData) ->
                stringifiedData = JSON.stringify(oData)
                localStorage.setItem storedPath, stringifiedData

            "fnStateLoad": (oSettings) ->
                loadedData = localStorage.getItem(storedPath)
                return JSON.parse loadedData