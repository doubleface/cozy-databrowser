exports.routes = (map) ->
	map.get 'doctypes', 'templates#doctypes'
	map.get 'search', 'templates#search'
	map.del 'search/:id', 'templates#delete'
