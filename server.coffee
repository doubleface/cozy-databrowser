#!/usr/bin/env coffee
app = module.exports = (params) ->
    params = params || {}
    # specify current dir as default root of server
    params.root = params.root || __dirname
    return require('compound').createServer(params)

if not module.parent
    port = process.env.PORT || 9250
    host = process.env.HOST || "127.0.0.1"
    server = app()
    server.listen port, host, ->
        console.log(
            "Compound server listening on %s:%d within %s environment",
            host, port, server.set('env'))

    #---------begin noesis tests
    noesis = 
        DataSystem : require('./db/DataSystem')

    myDataSystem = new noesis.DataSystem
    myDataSystem.getDoctypes()
    #---------end noesis tests