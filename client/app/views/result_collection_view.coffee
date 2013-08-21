ViewCollection = require '../lib/view_collection'
ResultCollection = require '../collections/result_collection'
ResultView = require './result_view'

module.exports = class ResultCollectionView extends ViewCollection
	
	itemview: ResultView
	collection: new ResultCollection()

	initialize: ->		
		@collectionEl = '#result-list'
		super
		@collection.fetch( {data: $.param(@options)})
		@views = {}
		@listenTo @collection, "reset",   @onReset