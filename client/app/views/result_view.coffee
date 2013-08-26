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
		'mouseenter .label' : 'showFieldDescription'
		'mouseleave .label' : 'showFieldDescription'
	}
	blurIt : (e) ->
		$(e.currentTarget).blur()

	showFieldDescription : (e) ->
		jqObj = $(e.currentTarget)
		if jqObj.attr("data-title") isnt ""
			if e.type is 'mouseenter'
				
				left = jqObj.offset().left - $('#basic-accordion.accordion').offset().left - 5
				top = jqObj.offset().top - $('#basic-accordion.accordion').offset().top - 7
				$('.info-box .field-title').css({'padding-left' : jqObj.width() + 18})
				$('.info-box .field-description').empty().html(jqObj.attr("data-title"))		
				$('.info-box').css({'z-index' : '5', 'left' : left , 'top' : top})
				$('.accordion .label').css({'z-index' : 'inherit'})
				jqObj.css({'z-index' : '10'})
				$('.info-box').stop().fadeTo(200, 1);
			else
				$('.info-box').stop().fadeTo(200, 0);

