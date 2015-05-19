module.exports =

    initialize: ->
        # Used in inter-app communication
        #SocketListener = require '../lib/socket_listener'

        # Routing management
        Router = require 'router'
        @router = new Router()

        @locale = window.locale
        delete window.locale

        @polyglot = new Polyglot()
        try
            locales = require 'locales/'+ @locale
        catch e
            locales = require 'locales/en'

        @polyglot.extend locales
        window.t = @polyglot.t.bind @polyglot

        # binds the responsive menu button
        $('#menu-toggler').on 'click', (e) ->
            e.preventDefault()
            $('#sidebar').toggleClass('display')
            $(this).toggleClass('display')

        Backbone.history.start()