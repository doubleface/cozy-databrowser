View = require './../lib/view'

module.exports = class ResultView extends View

	tagName: 'div'
	className: 'accordion-group'

	render: ->
		that = this
		super
			results : that.manageResultsForView @model.attributes, @model.get("count")

	manageResultsForView: (attr, count) ->
		results = {}

		#case no results
		if attr.no_result?
			$('#all-result .accordion').empty()
			results['no_result'] = true
			return results

		#prepare results
		else

			#no_result
			results['no_result'] = false	

			#count		
			results['count'] = count			

			#heading
			results['heading'] = {
				'field' : if attr.idField? then attr.idField else 'id'
				'data' : if attr.idField? then attr[attr.idField] else attr._id
			}	

			#fields
			results['fields'] = []
			iCounter = 0

			for field of attr

				if field isnt 'idField' and field isnt 'count' and field isnt 'descField'
					
					#prepare new fields
					results['fields'][iCounter] = {
						'cdbFieldDescription' : ""
						'cdbFieldName' : field
						'cdbFieldData' : ""
						'cdbLabelClass' : "label-secondary"
					}

					#add description and name				
					if attr.descField? and attr.descField[field]?
						if attr.descField[field].description?
							results['fields'][iCounter]['cdbFieldDescription'] = attr.descField[field].description
						
						if attr.descField[field].displayName? and attr.descField[field].displayName isnt ""
							results['fields'][iCounter]['cdbFieldName'] = attr.descField[field].displayName
							if field is results['heading']['field']
								results['heading']['field'] = attr.descField[field].displayName

					#add data according to typeof		
					#field isn't an object	: display text
					if typeof attr[field] is 'string' or typeof attr[field] is 'number' or typeof attr[field] is 'boolean'
						results['fields'][iCounter]['cdbFieldData'] = attr[field]

					#field is an object : display list
					else if attr[field]? and typeof attr[field] is 'object'	
						results['fields'][iCounter]['cdbFieldData'] = '<ul class="sober-list">'						 
						for obj of attr[field]
							if typeof attr[field][obj] is 'string' or typeof attr[field][obj] is 'number' or typeof attr[field][obj] is 'boolean'
								results['fields'][iCounter]['cdbFieldData'] += '<li>' + obj + ' : <i>' + attr[field][obj] + '</i></li>'
							else if attr[field][obj]? and typeof attr[field][obj] is 'object'
								results['fields'][iCounter]['cdbFieldData'] += '<li>' + obj + ' : <i>' + $.stringify(attr[field][obj]) + '</i></li>'
							else
								results['fields'][iCounter]['cdbFieldData'] += '<li><i>empty</i></li>'
								results['fields'][iCounter]['cdbLabelClass'] = 'label-danger'
						results['fields'][iCounter]['cdbFieldData'] += '</ul>'
					else
						results['fields'][iCounter]['cdbFieldData'] = '<i>empty</i>'
						results['fields'][iCounter]['cdbLabelClass'] = 'label-danger'
						
				iCounter++
	
			return results


	template: ->
		require './templates/result'

	templateModal: require('./templates/modal_confirm')

	events : {
		'click .accordion-toggle' : 'blurIt'
		'mouseenter .label' : 'showFieldDescription'
		'mouseleave .label' : 'showFieldDescription'
		'click .remove-result' : 'confirmRemoveResult'
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

	confirmRemoveResult : (e) ->
		that = this
		e.preventDefault()
	
		data =
			title: 'Confirmation required'
			body: 'Are you sure ? This can\'t be undone, and will erase definitly the data from the database.'
			confirm: 'delete permanently'

		$("body").prepend @templateModal(data)
		$("#confirmation-dialog").modal()
		$("#confirmation-dialog").modal("show")
		$("#confirmation-dialog-confirm").bind "click", ()->
			that.removeResult()
	
	removeResult : () ->

		#set id for the native backbone delete action
		@model.set('id', @model.get('_id'))

		#remove
		@model.destroy {
			data : 'id=' + @model.get('id')				
		}
		$(window).resize()