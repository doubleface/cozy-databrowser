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

describe "Datasystem management", ->

    before helpers.cleanDB
    before helpers.startApp
    before (done) -> fixtures.load callback: done
    after helpers.stopApp
    after helpers.cleanDB

    describe "When we instanciate DataSystem", =>
        before (done) =>
            @CoreClass = require './../server/helpers/CoreClass'
            @dataSystem = require './../server/lib/dataSystem'
            done()

        it "The CoreClass should exists as a function", =>
            should.exist @CoreClass
            @CoreClass.should.have.type 'function'

        it "The datasystem should exists as an object", =>
            should.exist @dataSystem
            @dataSystem.should.have.type 'object'

        describe "When we try to access to constructor constants", =>

            it "CLASS_NAME should exist as a string", =>
                should.exist @dataSystem.constructor.CLASS_NAME
                @dataSystem.constructor.CLASS_NAME.should.have.type 'string'

        describe "When we try to access to prototype constants", =>

            it "The npm dependency request-json must be load as JSON_CLIENT", =>
                should.exist @dataSystem.JSON_CLIENT
                @dataSystem.JSON_CLIENT.should.have.type 'function'

            it "The local dependency oArrayHelper must be load as ARRAY_HELPER", =>
                should.exist @dataSystem.ARRAY_HELPER
                @dataSystem.ARRAY_HELPER.should.have.type 'object'

            it "Paths constants should be : DS_URL, DS_PORT, DI_PORT", =>
                @dataSystem.should.have.properties 'DS_URL', 'DS_PORT', 'DI_PORT'

            it "Other constants should be : PATH, ERR_MSG", =>
                @dataSystem.should.have.properties 'PATH', 'ERR_MSG'

        describe "When we try to access to instance attributes", =>

            it "The request-json client 'clientDS' should be construct", =>
                should.exist @dataSystem.clientDS
                @dataSystem.clientDS.should.have.type 'object'

            it "The pattern dball paths registery 'registeredPatterns' should be construct", =>
                should.exist @dataSystem.registeredPatterns
                @dataSystem.registeredPatterns.should.have.type 'object'

        describe "When we try to use instance methods", =>

            describe "When we try to use instance CRUD HTTP methods", =>

                before (done) =>

                    path = @dataSystem.PATH.request + 'alarm' + @dataSystem.PATH.all
                    @dataSystem.postData path, (err, body) =>
                        @errPost = err
                        @bodyPost = body
                        done()

                before (done) =>

                    path = @dataSystem.PATH.doctypes
                    @dataSystem.getData path, (err, body) =>
                        @errGet = err
                        @bodyGet = body
                        done()

                it "The POST action shouldn't return an error", =>
                    should.not.exist @errPost

                it "The POST action should return a well formed body", =>
                    should.exist @bodyPost
                    for alarm in @bodyPost
                        alarm.should.have.keys 'id', 'key', 'value'

                it "The GET action shouldn't return an error", =>
                    should.not.exist @errGet

                it "The GET action should return a well formed body", =>
                    should.exist @bodyGet
                    @bodyGet.should.have.type 'object'

                # it "The PUT action shouldn't return an error", =>
                #     should.not.exist @errPost

                # it "The PUT action should return a well formed body", =>
                #     should.exist @bodyPost
                #     for alarm in @bodyPost
                #         alarm.should.have.keys 'id', 'key', 'value'

                # it "The DELETE action shouldn't return an error", =>
                #     should.not.exist @errPost

                # it "The DELETE action should return a well formed body", =>
                #     should.exist @bodyPost
                #     for alarm in @bodyPost
                #         alarm.should.have.keys 'id', 'key', 'value'







