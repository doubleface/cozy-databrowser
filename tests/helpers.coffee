fixtures = require 'cozy-fixtures'

helpers = {}

# server management
helpers.options = {}
helpers.app = null

helpers.startApp = (done) ->
    americano = require 'americano'
    init = require '../server/init'

    host = helpers.options.serverHost || "127.0.0.1"
    port = helpers.options.serverPort || 9250

    init =>
        americano.start name: 'databrowser', host: host, port: port, (app, server) =>
            @app = app
            @app.server = server
            done()

helpers.stopApp = (done) ->
    @app.server.close ->
        # those instances are shared and require cache must be cleaned so
        # we can isolate tests cases
        delete require.cache[require.resolve('../server/lib/dataSystem')]
        delete require.cache[require.resolve('../server/lib/searchEngine')]
        done()

# database helper
helpers.cleanDB = (done) -> fixtures.resetDatabase callback: done
helpers.cleanDBWithRequests = (done) ->
    fixtures.resetDatabase designsToRemove: true, callback: done


module.exports = helpers