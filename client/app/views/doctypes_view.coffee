BaseView = require '../lib/base_view'

module.exports = class DoctypesView extends BaseView

    el: 'body.application'    
    template: require('./templates/doctypes')

    render: ->
    	DoctypeCollection = require('/collections/doctype_collection')
    	dc = new DoctypeCollection
    	dc.fetch({ 	 	
    	 	success:(model, response) ->                                
                for data in response
                    eltDoctypeLi = $(document.createElement('li'))
                    eltDoctypeLi.append($(document.createElement('a')).text(data).attr("href", "/#search"))
                    $('body.application').append(eltDoctypeLi)
    	})
