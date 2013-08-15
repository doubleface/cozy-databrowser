BaseView = require '../lib/base_view'

module.exports = class DoctypesView extends BaseView

    el: 'body.application'
    template: require('./templates/doctypes')

    #afterRender: ->
        #console.log "write more code here !"