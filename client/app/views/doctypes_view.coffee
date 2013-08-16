BaseView = require '../lib/base_view'
DoctypeCollectionView = require 'views/doctype_collection_view'

module.exports = class DoctypesView extends BaseView

    el: 'body.application'    
    template: require('./templates/doctypes')

    	