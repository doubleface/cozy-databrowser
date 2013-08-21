exports.routes = (map) ->
	map.get '', 'template#index'	  
	map.get 'doctypes', 'templates#doctypes' 
	map.get 'search', 'templates#search' 
	