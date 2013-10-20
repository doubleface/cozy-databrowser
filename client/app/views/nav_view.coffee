BaseView = require '../lib/base_view'

module.exports = class NavView extends BaseView

    el: 'body.application'
    titles :
        '' : '#doctypes'
        'doctypes' : '#doctypes'
        'search' : '#search'
        'searchAllByDoctype' : '#search'

    initialize: ->
        Backbone.history.on('route', (source, path) ->
            @render(path)
        , @)

    render : (path) ->
        that = this
        $('.nav > li').each ->
            $(this).removeClass('active')
            $(this).children('a').blur()
            if $(this).children('a').attr('href') is that.titles[path]
                $(this).addClass('active')

