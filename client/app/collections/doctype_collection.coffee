module.exports = class DoctypesCollection extends Backbone.Collection
	model: require '../models/doctype_model'
	url: 'doctypes'