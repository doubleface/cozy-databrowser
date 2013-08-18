ViewCollection = require '../lib/view_collection'
DoctypeCollection = require '../collections/doctype_collection'
DoctypeView = require './doctype_view'

module.exports = class DoctypeCollectionView extends ViewCollection
	
	itemview: DoctypeView
	collection: new DoctypeCollection()

	initialize: ->
		@collectionEl = '#doctypes-list'
		super
		@collection.fetch()		
		@views = {}
		@listenTo @collection, "reset",   @onReset