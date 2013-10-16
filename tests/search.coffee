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

    before helpers.cleanDB
    before helpers.startApp

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

            describe "When prepare the 'all' request on doctype 'alarm'", (done) =>  
                before (done) =>    
                    @doctypes = ['alarm']                
                    @isAlarmValid = false
                    @isDballRequestReady = false 
                    @dball = []               
                    @dataSystem.areValidDoctypes @doctypes, (isValid, errorMsg) =>
                        @isAlarmValid = isValid
                        if @isAlarmValid
                            @dball = @dataSystem.prepareDballRequests(@doctypes)
                            @isDballRequestReady = @dball.length is 1
                        done()

                it "The alarm doctype should be valid", =>
                    @isAlarmValid.should.be.true      

                it "A dball request should be ready for 'alarm'", =>
                    @isDballRequestReady.should.be.true

            describe "When create the dball request for alarm", (done) =>
                before (done) =>
                    @dball[0] (error, body)->
                        done()     
                
                it "The dball request on 'alarm' must be now registered", =>
                    should.exist @dataSystem.registeredPatterns['alarm']  

            describe "When we request 'all' on alarm", (done) =>
                before (done) =>
                    client.post "request/alarm/dball/", {}, (err, res, body) =>
                        @err = err
                        @res = res
                        @body = body
                        done()

                # it "The response shouldn't be an error", =>
                #     should.not.exist @err
                #     should.exist @res
                #     @res.should.have.property 'statusCode'
                #     @res.statusCode.should.equal 200
                #     should.exist @body
