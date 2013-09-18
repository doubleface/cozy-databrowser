exports.routes = (map) ->
	map.get 'doctypes', 'templates#doctypes' 
	map.get 'search', 'templates#search' 
	map.delete 'search/:id', 'templates#delete' 
	