AppView = require 'views/app_view'
DoctypesView = require 'views/doctypes_view'
DoctypeCollectionView = require 'views/doctype_collection_view'

module.exports = class Router extends Backbone.Router

    routes:
        '': 'main'
        'doctypes' : 'doctypes'

    main: ->
        mainView = new AppView()
        mainView.render()

    doctypes: ->
		doctypesView = new DoctypesView()
		doctypesView.render()	
		dcView = new DoctypeCollectionView()
		dcView.render()