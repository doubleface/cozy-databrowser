Client = require('request-json').JsonClient
should = require 'should'
fixtures = require 'cozy-fixtures'
path = require 'path'

helpers = require './helpers'
helpers.options =
    serverHost: 'localhost'
    serverPort: '8888'
client = new Client "http://#{helpers.options.serverHost}:#{helpers.options.serverPort}/"

fixtures.setDefaultValues
    dirPath: path.resolve __dirname, './fixtures/'
    silent: true
    removeBeforeLoad: false # useless because we clean the DB before tests

describe "Search management", ->

    before helpers.startApp
    before helpers.cleanDB

    after helpers.stopApp
    after helpers.cleanDB

    describe "When the database is empty", ->

        it "doctypes list should be empty", (done) ->
            client.get 'doctypes', (err, res, body) ->
                should.exist res
                res.should.have.property 'statusCode'
                res.statusCode.should.equal 200
                body.length.should.equal 0
                done()

    describe "When we add 2 documents of one doctype (Alarm)", ->

        before helpers.cleanDB
        before (done) -> fixtures.load doctypeTarget: 'alarm', callback: done
        before (done) -> fixtures.load doctypeTarget: 'metadoctype', callback: done
        after helpers.cleanDB

        describe "When dataSystem and searchEngine are created'", (done) =>
            before (done) =>
                @dataSystem = require './../server/db/dataSystem'
                @searchEngine = require('./../server/db/searchEngine')(@dataSystem)
                done()

            it "The alarm 'dball' request shouldn't be registered", =>
                should.not.exist @dataSystem.registeredPatterns['alarm']

            describe "When verify if 'alarm' doctype is valid", (done) =>  
                before (done) =>
                    @isAlarmValid = false
                    @dataSystem.areValidDoctypes ['alarm'], (isValid, errorMsg) =>
                        @isAlarmValid = isValid
                        done()

                it "The alarm doctype should be valid", =>
                    @isAlarmValid.should.be.true                           
          