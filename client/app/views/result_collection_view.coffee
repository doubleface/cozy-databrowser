ViewCollection = require '../lib/view_collection'
ResultCollection = require '../collections/result_collection'
ResultView = require './result_view'

module.exports = class ResultCollectionView extends ViewCollection
    
    itemview: ResultView    
    collectionEl :'#basic-accordion'
    isLoading : false
    noMoreItems : false
    
    initialize: ->  
        that = this
        @collection = new ResultCollection()            
        super
        if @options.doctype?
            @collection.fetch {
                data: $.param(@options)
                success : (col, data) ->
                    $('.loading-image').remove()
                    #native size of the window could trigger next pages (infinite scroll)
                    if that.options.range? and that.options.doctype?        
                        if data.length is that.collection.nbPerPage
                            that.loopFirstScroll()
                            $('.load-more-result').show()
                            
                        else                        
                            that.noMoreItems = true
                            $('.load-more-result').hide()
                error : () ->
                    $('.loading-image').remove()
                    that.displayLoadingError()
            }

    render: ->
        if @options.doctype?
            $('#all-result').append('<div class="loading-image"><img src="images/ajax-loader.gif" /></div>')   
        view.$el.detach() for id, view of @views
        super

    search : (content) ->
        that = this
        @options['query'] = content
        @collection.fetch {
            data: $.param(@options)
        }

    loadNextPage : (isTriggered, callback) ->               
        that = this
        @options['deleted'] = @deleted
        if !@noMoreItems            
            @isLoading = true
            @collection.page++          
            if !isTriggered
                $('.load-more-result i, .load-more-result span').hide()
                $('.load-more-result').spin 'tiny'
            @collection.fetch {
                data: $.param(@options)
                remove : false
                success : (col, data) ->
                    if !isTriggered
                        $('.load-more-result .spinner').hide()
                        $('.load-more-result i, .load-more-result span').show()                 
                    that.noMoreItems = data.length < that.collection.nbPerPage
                    if that.noMoreItems 
                        $('.load-more-result').hide()
                    that.isLoading = false
                    if callback?
                        callback()                      
                error : () ->
                    that.displayLoadingError()
            }
    loopFirstScroll : ()->
        that = this
        if !@isLoading and !@noMoreItems            
            firstScroll = $(document).height() is $(window).height()            
            if (firstScroll)
                @loadNextPage true, () ->
                    that.loopFirstScroll()

    displayLoadingError : () ->
        $('.load-more-result').css({'color' : '#AF4434'})
        $('.load-more-result i').hide()
        $('.load-more-result span').text('An error occurs during the loading process')
        $('.load-more-result').show()