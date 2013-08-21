exports.routes = (map) ->
	#map.get 'index', 'templates#index'   
	map.get 'doctypes', 'templates#doctypes' 
	map.get '', 'template#index'	