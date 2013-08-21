BaseView = require '../lib/base_view'

module.exports = class SearchView extends BaseView

	el: '#content'    
	template: require('./templates/search')    