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

    before helpers.cleanDBWithRequest
    before (done) -> fixtures.load callback: done
    before helpers.startApp
    after helpers.stopApp
    after helpers.cleanDBWithRequest

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

                before (done) =>

                    @pathSumAlarm = '/request/tests/getalarmsum/'
                    viewFunctions =
                        map: (doc) ->
                            if doc.docType? and doc.docType.toLowerCase() is 'alarm'
                                emit doc.docType, 1
                        reduce: (keys, values, rereduce) ->
                            return sum(values)
                    for key, func of viewFunctions
                        viewFunctions[key] = func.toString()

                    @dataSystem.putData @pathSumAlarm, viewFunctions, (err, body) =>
                        @errPut = err
                        @bodyPut = body
                        @dataSystem.postData @pathSumAlarm, (errAlarmSum, bodyAlarmSum) =>
                            @errAlarmSum = errAlarmSum
                            @bodyAlarmSum = bodyAlarmSum
                            done()

                before (done) =>
                    path = @dataSystem.PATH.data + @bodyPost[1].id + '/'
                    @dataSystem.deleteData path, (err, body) =>
                        @errDel = err
                        @dataSystem.postData @pathSumAlarm, (errAlarmSum, bodyAlarmSum) =>
                            @errAlarmSum2 = errAlarmSum
                            @bodyAlarmSum2 = bodyAlarmSum
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

                it "The PUT action shouldn't return an error", =>
                    should.not.exist @errPut

                it "The PUT action should return a well formed body", =>
                    should.exist @bodyPut
                    @bodyPut.success.should.be.true

                it "After the PUT action, new request must be usable and return sum of alarms", =>
                    should.not.exist @errAlarmSum
                    @bodyAlarmSum[0].value.should.be.equal 2

                it "The DELETE action shouldn't return an error", =>
                    should.not.exist @errDel

                it "After the DELETE action, sum of alarm must be 1", =>
                    should.not.exist @errAlarmSum2
                    @bodyAlarmSum2[0].value.should.be.equal 1

            describe "When we try to use instance request methods", =>

                before (done) =>

                    path = @dataSystem.PATH.application.getpermissions
                    @dataSystem.getView path, (err, body) =>
                        @errView = err
                        @bodyView = body
                        done()

                before (done) =>

                    @dataSystem.getDoctypes (err, body) =>
                        @errDoctypes = err
                        @bodyDoctypes = body
                        done()

                before (done) =>

                    @dataSystem.indexId @bodyPost[0].id, ['description'], (err, body) =>
                        @errIndex = err
                        @bodyIndex = body
                        done()

                before (done) =>

                    @dataSystem.deleteById @bodyPost[0].id, (err, body) =>
                        @errDelId = err
                        @dataSystem.postData @pathSumAlarm, (errAlarmSum, bodyAlarmSum) =>
                            @errAlarmSum3 = errAlarmSum
                            @bodyAlarmSum3 = bodyAlarmSum
                            done()

                before (done) =>
                    @pathSumMetadoctype = '/request/tests/getmetadoctypesum/'
                    viewFunctions =
                        map: (doc) ->
                            if doc.docType? and doc.docType.toLowerCase() is 'metadoctype'
                                emit doc.docType, 1
                        reduce: (keys, values, rereduce) ->
                            return sum(values)

                    @dataSystem.manageRequest @pathSumMetadoctype, viewFunctions, (err, body) =>
                        @errManageReq = err
                        @bodyManageReq = body
                        @dataSystem.getView @pathSumMetadoctype, (errMDSum, bodyMDSum) =>
                            @errMDSum = errMDSum
                            @bodyMDSum = bodyMDSum
                            done()

                it "The GET VIEW method shouldn't return an error", =>
                    should.not.exist @errView

                it "The GET VIEW method should return a well formed body", =>
                    should.exist @bodyView
                    @bodyView[0].should.have.keys 'id', 'key', 'value'

                it "The GET DOCTYPES method shouldn't return an error", =>
                    should.not.exist @errDoctypes

                it "The GET DOCTYPES method should return a well formed body", =>
                    should.exist @bodyDoctypes
                    @bodyDoctypes.should.have.type 'object'

                it "The INDEX ID method shouldn't return an error", =>
                    should.not.exist @errIndex

                it "The INDEX ID method should return a well formed body", =>
                    should.exist @bodyIndex
                    @bodyIndex.success.should.be.true

                it "The DELETE BY ID method shouldn't return an error", =>
                    should.not.exist @errDeleteId

                it "After DELETE BY ID method, sum of alarm must be 0", =>
                    should.not.exist @errAlarmSum3
                    @bodyAlarmSum3.should.have.lengthOf 0

                it "The MANAGE REQUEST method shouldn't return an error", =>
                    should.not.exist @errManageReq

                it "The MANAGE REQUEST method should return a well formed body", =>
                    should.exist @bodyManageReq
                    @bodyManageReq.success.should.be.true

                it "After the MANAGE REQUEST action, new request must be usable and return sum of metadoctypes", =>
                    should.not.exist @errMDSum
                    @bodyMDSum[0].value.should.be.equal 1







