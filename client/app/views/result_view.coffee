View = require './../lib/view'

module.exports = class ResultView extends View

	tagName: 'div'
	className: 'accordion-group'

	render: ->
		super
			no_result : @model.get("no_result")
			options : @model.attributes
			count : @model.get("count")

	template: ->
		require './templates/result'

	events : {
		'click .accordion-toggle' : 'blurIt'
	}
	blurIt : (e) ->
		$(e.currentTarget).blur()

