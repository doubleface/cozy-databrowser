exports.routes = (map) ->
	map.get 'doctypes', 'index#doctypes'
	map.get 'search', 'index#search'
	map.del 'search/:id', 'index#delete'
