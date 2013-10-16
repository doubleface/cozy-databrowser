Client = require('request-json').JsonClient
should = require 'should'
app = require '../server'
fixtures = require 'cozy-fixtures'
path = require 'path'

client = new Client "http://localhost:8888/"

instantiateApp = require '../server'
app = instantiateApp()

fixtures.setDefaultValues
    dirPath: path.resolve __dirname, './fixtures/'
    silent: true
    removeBeforeLoad: false # useless because we clean the DB before tests

# clean all the data in database
cleanDB = (done) -> fixtures.resetDatabase callback: done

describe "Doctype list management", ->

    before (done) -> app.listen 8888, "127.0.0.1", done
    before cleanDB

    after (done) ->
        app.compound.server.close()
        done()
    after cleanDB

    describe "When the database is empty", ->

        it "There shouldn't be items in doctypes list", (done) ->
            client.get 'doctypes', (err, res, body) ->
                should.exist res
                res.should.have.property 'statusCode'
                res.statusCode.should.equal 200
                body.length.should.equal 0
                done()

    describe "When we add 2 documents of one doctype (Alarm)", ->

        before cleanDB
        before (done) -> fixtures.load doctypeTarget: 'alarm', callback: done
        before (done) -> fixtures.load doctypeTarget: 'metadoctype', callback: done
        after cleanDB

        describe "When dataSystem and searchEngine are created'", (done) =>
            before (done) =>
                @dataSystem = require './../db/dataSystem'
                @searchEngine = require('./../db/searchEngine')(@dataSystem)
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
          