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

    before helpers.cleanDBWithRequest
    before helpers.startApp

    after helpers.stopApp
    after helpers.cleanDBWithRequest

    describe "When we add 2 documents of one doctype (Alarm)", ->

        before helpers.cleanDB
        before (done) -> fixtures.load doctypeTarget: 'alarm', callback: done
        before (done) -> fixtures.load doctypeTarget: 'metadoctype', callback: done
        after helpers.cleanDB

        describe "When dataSystem and searchEngine are created'", ->
            before (done) =>
                @dataSystem = require './../server/lib/dataSystem'
                @searchEngine = require('./../server/lib/searchEngine')(@dataSystem)
                done()

            it "The alarm 'dball' request shouldn't be registered", =>
                should.not.exist @dataSystem.registeredPatterns['alarm']

            describe "When prepare the 'all' request on doctype 'alarm'", =>
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

            describe "When create the dball request for alarm", =>
                before (done) =>
                    @dball[0] (err, body) =>
                        @errOnDball = err
                        done()

                it "The dball request on 'alarm' must be now registered", =>
                    should.not.exist @errOnDball
                    should.exist @dataSystem.registeredPatterns['alarm']

            describe "When we request 'all' on alarm", =>
                before (done) =>
                    pathAlarm = @dataSystem.PATH.request + 'alarm' + @dataSystem.PATH.all
                    @dataSystem.getView pathAlarm, (err, body) =>
                        @errOnAlarm = err
                        @bodyAlarm = body
                        done()

                it "The response shouldn't be an error", =>
                    should.not.exist @errOnAlarm
                    should.exist @bodyAlarm

                it "The response should contains 2 results", =>
                    @bodyAlarm.should.have.lengthOf 2

                it "The response should be well formed", =>
                    @bodyAlarm[0].should.have.keys 'id', 'key', 'value'
                    @bodyAlarm[1].should.have.keys 'id', 'key', 'value'

                it "Each element of the response should be well formed", =>
                    for alarm in @bodyAlarm
                        alarm.id.should.have.type 'string'
                        alarm.key.should.have.type 'string'
                        alarm.value.should.have.type 'object'

            describe "When we request 'metadoctypes by related'", =>
                before (done) =>
                    pathMD = @dataSystem.PATH.metadoctype.getallbyrelated
                    @dataSystem.getView pathMD, (err, body) =>
                        @errOnMetadoctype = err
                        @bodyMetadoctype = body
                        done()

                it "The response shouldn't be an error", =>
                    should.not.exist @errOnMetadoctype
                    should.exist @bodyMetadoctype

                it "The response should contains 1 results", =>
                    @bodyMetadoctype.should.have.lengthOf 1

                it "The response should be well formed", =>
                    @bodyMetadoctype[0].should.have.keys 'id', 'key', 'value'

                it "Each element of the response should be well formed", =>
                    @bodyMetadoctype[0].id.should.have.type 'string'
                    @bodyMetadoctype[0].key.should.have.type 'string'
                    @bodyMetadoctype[0].value.should.have.type 'object'

                it "The metadoctype must be related to 'Alarm'", =>
                    @bodyMetadoctype[0].value.related.should.equal 'Alarm'

            describe "When we add the metadoctype to alarm", =>
                before (done) =>
                    @newFields = @searchEngine.prepareMetadoctypeInfo @bodyMetadoctype, 'alarm'
                    for alarm in @bodyAlarm
                        alarm.value['idField'] = @newFields.idField['alarm']
                        alarm.value['descField'] = @newFields.descField['alarm']
                    done()

                it "New idenfication/description fields for 'alarm' should exist", =>
                    should.exist @newFields.idField['alarm']
                    should.exist @newFields.descField['alarm']

                it "New fields should be well formed", =>
                    @bodyAlarm[1].value['idField'].should.have.type 'string'
                    @bodyAlarm[1].value['descField'].should.have.type 'object'



