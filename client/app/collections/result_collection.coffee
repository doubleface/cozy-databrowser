module.exports = class ResultCollection extends Backbone.Collection
	model: require '../models/result_model'
	url: 'search'