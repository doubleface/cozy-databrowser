module.exports = class DoctypeCollection extends Backbone.Collection
	model: require '../models/doctype_model'
	url: '/doctypes'
	#tagName: 'li'
	#template: _.template($('#doctypes-list').html())
	
	#initialize: ->
    	#_.bindAll(@, 'render')

    #render: ->
    	#@.$el.html @template(@model.toJSON())
    	#@