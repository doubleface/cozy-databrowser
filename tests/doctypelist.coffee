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

describe "Doctype list management", ->

    before helpers.startApp
    before helpers.cleanDB

    after helpers.stopApp
    after helpers.cleanDB

    describe "When the database is empty", ->

        it "There shouldn't be items in doctypes list", (done) ->
            client.get 'doctypes', (err, res, body) ->
                should.exist res
                res.should.have.property 'statusCode'
                res.statusCode.should.equal 200
                body.length.should.equal 0
                done()

    describe "When we add 2 documents of one doctype (Alarm)", ->

        before helpers.cleanDB
        before (done) -> fixtures.load doctypeTarget: 'alarm', callback: done
        after helpers.cleanDB

        describe "When we request the doctypes list", (done) =>

            @err = null
            @res = null
            @body = null

            before (done) =>
               client.get 'doctypes', (err, res, body) =>
                    @err = err
                    @res = res
                    @body = body
                    done()

            it "The response shouldn't be an error", =>
                should.not.exist @err
                should.exist @res
                @res.should.have.property 'statusCode'
                @res.statusCode.should.equal 200
                should.exist @body

            it "And should only have the doctype Alarm in the list", =>
                @body.length.should.equal 1
                element = @body[0]
                element.should.have.properties ['name', 'sum', 'app']
                element.name.should.equal 'alarm'

            it "And this doctype should only have 2 documents", =>
                element = @body[0]
                element.sum.should.equal 2

            it "And no application should use this doctype", =>
                element = @body[0]
                element.app.should.be.an.instanceOf(Array).and.empty

    describe "When we add documents of multiple doctypes with the metadoctype information", ->

        # load all the fixtures
        before helpers.cleanDB
        before (done) -> fixtures.load callback: done
        after helpers.cleanDB

        describe "When we request the doctypes list", (done) =>

            @err = null
            @res = null
            @body = null

            before (done) =>
               client.get 'doctypes', (err, res, body) =>
                    @err = err
                    @res = res
                    @body = body
                    done()

            it "The response shouldn't be an error", =>
                should.not.exist @err
                should.exist @res
                @res.should.have.property 'statusCode'
                @res.statusCode.should.equal 200
                should.exist @body

            it "And should have 4 doctypes: metadoctype, application, alarm and contact", =>
                @body.length.should.equal 4
                @alarm = null
                @metadoctype = null
                @contact = null
                @application = null
                expectedDoctypes = ['alarm', 'metadoctype', 'contact', 'application']
                for doctypeInfo in @body
                    if doctypeInfo.name is 'alarm'
                        @alarm = doctypeInfo
                    else if doctypeInfo.name is 'metadoctype'
                        @metadoctype = doctypeInfo
                    else if doctypeInfo.name is 'contact'
                        @contact = doctypeInfo
                    else if doctypeInfo.name is 'application'
                        @application = doctypeInfo
                    else
                        expectedDoctypes.should.contain doctypeInfo.name

                should.exist @alarm
                should.exist @metadoctype
                should.exist @contact
                should.exist @application

            it "And alarm should be well formed", =>
                @alarm.should.have.properties ['name', 'sum', 'app']

            it "And alarm should have have its meta information", =>
                @alarm.should.have.property 'metadoctype'
                @alarm.metadoctype.should.have.properties ['related', 'displayName', 'identificationField', 'fields']
                @alarm.metadoctype.related.should.equal 'Alarm'
                @alarm.metadoctype.displayName.should.equal 'Alarme'
                @alarm.metadoctype.identificationField.should.equal 'description'

            it "And alarm should have the application 'photos' in its app list", =>
                @alarm.should.have.property 'app'
                @alarm.app.should.have.lengthOf 1
                @alarm.app[0].should.equal 'photos'

            it "And contact should be well formed", =>
                @contact.should.have.properties ['name', 'sum', 'app']

            it "And contact should have the application 'photos' in its apps list", =>
                @contact.should.have.property 'app'
                @contact.app.should.have.lengthOf 1
                @contact.app[0].should.equal 'photos'

            it "And contact shouldn't have its meta information", =>
                @contact.should.not.have.property 'metadoctype'

            it "And metadoctype should be well formed", =>
                @metadoctype.should.have.properties ['name', 'sum', 'app']

            it "And metadoctype shouldn't have its meta information", =>
                @metadoctype.should.not.have.property 'metadoctype'

            it "And application should be well formed", =>
                @application.should.have.properties ['name', 'sum', 'app']

            it "And application shouldn't have its meta information", =>
                @application.should.not.have.property 'metadoctype'
