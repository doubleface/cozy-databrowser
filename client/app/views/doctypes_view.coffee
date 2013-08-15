BaseView = require '../lib/base_view'

module.exports = class DoctypesView extends BaseView

    el: 'body.application'    
    template: require('./templates/doctypes')

    render: ->
    	DoctypesCollection = require('/collections/doctype_collection')
    	dc = new DoctypesCollection
    	console.log(dc)
    	dc.fetch(
    	 	{ body : "body" }
    	 	success:(model,response) ->
    	 		console.log(response)
            
        	error:(model,response) ->
    	)

    	#get json for doctypes 	
    	# $.ajax({
    	# 	url : doctypes::url
    	# })
    	# .done((data) -> 
    	# 	nodeList = []

    	# 	#prepare nodelist of doctype links
    	# 	for doctype in data
    	# 		eltDoctypeLi = $(document.createElement('li'))
    	# 		eltDoctypeLi.append($(document.createElement('a')).text(doctype).attr("href", "/#search"))
    	# 		nodeList.push(eltDoctypeLi)	

    	# 	#append nodelist
    	# 	if nodeList.length > 0
    	# 		$('.container').append($(document.createElement('ul')).append(nodeList))
    	# )
