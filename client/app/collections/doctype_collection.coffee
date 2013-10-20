module.exports = class DoctypeCollection extends Backbone.Collection
    model: require '../models/doctype_model'
    url: 'doctypes'