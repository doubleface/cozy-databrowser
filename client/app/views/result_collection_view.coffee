ViewCollection = require '../lib/view_collection'
ResultCollection = require '../collections/result_collection'
ResultView = require './result_view'

module.exports = class ResultCollectionView extends ViewCollection
	
	itemview: ResultView	
	collectionEl :'#basic-accordion'
	isLoading : false
	noMoreItems : false
	nbOfItem : 0
	
	initialize: ->	
		that = this
		@collection = new ResultCollection()
		super		
		@collection.fetch {
			data: $.param(@options)
			success : (data) ->
				that.nbOfItem = data.length

				#native size of the window could trigger next pages (infinite scroll)
				that.loopFirstScroll()
		}
	loadNextPage : (isTriggered, callback) ->
		that = this
		@collection.page++
		@isLoading = true
		if !isTriggered
			$.msgGrowl ({
				type: 'loading'
				title: 'Loading more results...'
				text: 'If you want to see more results, you may scroll to the bottom.'
			});

		@collection.fetch {
			data: $.param(@options)
			remove : false
			success : (data) ->
				that.isLoading = false	
				that.noMoreItems = that.nbOfItem is data.length			
				that.nbOfItem = data.length
				if that.noMoreItems 
					$('.load-more-result').hide()
				if that.noMoreItems and !isTriggered
					$.msgGrowl ({
						type: 'info'
						title: 'No more items to load.'
						text: 'The current list display all data of the search.'
						lifetime : 3000
					});				
				else if !isTriggered
					$.msgGrowl ({
						type: 'success'
						title: 'Content loaded.'
						text: 'If you want to see more results, you may scroll to the bottom.'
					});
				if callback?
					callback()
		}
	loopFirstScroll : ()->
		that = this
		if !@isLoading and !@noMoreItems			
			firstScroll = $(document).height() is $(window).height()
			if (firstScroll)
				@loadNextPage true, () ->
					that.loopFirstScroll()