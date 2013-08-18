BaseView = require '../lib/base_view'
DoctypeCollectionView = require 'views/doctype_collection_view'

module.exports = class DoctypesView extends BaseView

    el: 'div#wrapper'    
    template: require('./templates/doctypes')

    	