module.exports = class ResultCollection extends Backbone.Collection	
	model: require '../models/result_model' 	
	url: () ->
		return 'search?page=' + @page + '&nbperpage=' + @nbPerPage
	page : 1
	nbPerPage : 4