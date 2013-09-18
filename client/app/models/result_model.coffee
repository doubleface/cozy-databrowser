module.exports = class ResultModel extends Backbone.Model
	rootUrl: "search"

	methodUrl : {
		'delete': 'delete'
	}	

	sync : (method, model, options) -> 
		if model.methodUrl and model.methodUrl[method.toLowerCase()]
			options = options || {}
			options.url = model.methodUrl[method.toLowerCase()]
			options.type = 'get'			
		Backbone.sync method, model, options