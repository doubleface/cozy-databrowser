Client = require('request-json').JsonClient
should = require 'should'
fixtures = require 'cozy-fixtures/main'
path = require 'path'

helpers = require './helpers'
helpers.options =
    serverHost: 'localhost'
    serverPort: '8888'
client = new Client "http://#{helpers.options.serverHost}:#{helpers.options.serverPort}/"
clientDS = new Client "http://localhost:9101/"

fixtures.setDefaultValues
    dirPath: path.resolve __dirname, './fixtures/'
    silent: true
    removeBeforeLoad: false # useless because we clean the DB before tests

describe "App initialization", ->

    before helpers.cleanDBWithRequests
    after helpers.cleanDBWithRequests

    describe "When the app starts", ->
        before helpers.cleanDBWithRequests
        before helpers.startApp

        after helpers.stopApp
        after helpers.cleanDBWithRequests

        it "There should be a 'common/getsumsbydoctype' request"
        it "There should be a 'metadoctype/all' request"
        it "There should be a 'application/getpermissions' request"

    describe "When fixtures for 4 doctypes are added", ->

        before (done) -> fixtures.load callback: done
        after helpers.cleanDBWithRequests

        describe "When the app starts", ->

            before helpers.startApp
            after helpers.stopApp

            it "The 'common/getsumsbydoctype' request should send a result according to fixtures"
            it "The 'application/getpermissions' request should send a result according to fixtures"
            it "The 'metadoctype/all' request should contain one item"
            it "There should be a 'dball' request for all doctypes"