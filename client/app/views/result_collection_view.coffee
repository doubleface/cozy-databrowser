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
		}
	loadNextPage : (callback) ->
		that = this
		@collection.page++
		@isLoading = true
		@collection.fetch {
			data: $.param(@options)
			remove : false
			success : (data) ->
				that.isLoading = false	
				that.noMoreItems = that.nbOfItem is data.length			
				that.nbOfItem = data.length
				if callback?
					callback()
		}