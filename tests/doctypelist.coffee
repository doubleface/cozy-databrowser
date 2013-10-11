Client = require('request-json').JsonClient
should = require 'should'
app = require '../server'
fixtures = require 'cozy-fixtures'

client = new Client "http://localhost:8888/"

instantiateApp = require '../server'
app = instantiateApp()

# clean all the data in database
cleanDB = (done) ->
    fixtures.resetDatabase
        silent: true
        callback: done

describe "Doctype list management", ->

    before (done) ->
        app.listen 8888, "127.0.0.1", ->
            cleanDB done

    after (done) ->
        app.compound.server.close()
        done()

    describe "When the database is empty", ->

        it "There shouldn't be items in doctypes list", (done) ->
            client.get 'doctypes', (err, res, body) ->
                should.exist res
                res.should.have.property 'statusCode'
                res.statusCode.should.equal 200
                body.length.should.equal 0
                done()

    describe "When we add 2 documents of one doctype (Alarm) and we request the doctypes list", ->

        before (done) ->
            cleanDB ->
                fixtures.load
                    dirPath: './tests/fixtures/'
                    doctypeTarget: 'alarm'
                    silent: true
                    removeBeforeLoad: false
                    callback: done

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

            after (done) -> cleanDB done

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
        before (done) ->
            cleanDB ->
                fixtures.load
                    dirPath: './tests/fixtures/'
                    silent: true
                    callback: done
        after (done) -> cleanDB done

        describe "When we request the doctypes list", (done) =>

            @err = null
            @res = null
            @body = null

            before (done) =>
               client.get 'doctypes', (err, res, body) =>
                    @err = err
                    @res = res
                    @body = body
                    #console.log body
                    done()

            it "The response shouldn't be an error", =>
                should.not.exist @err
                should.exist @res
                @res.should.have.property 'statusCode'
                @res.statusCode.should.equal 200
                should.exist @body

            it "And should have 3 doctypes: metadoctype, alarm and contact", =>
                @body.length.should.equal 3
                @alarm = null
                @metadoctype = null
                @contact = null
                expectedDoctypes = ['alarm', 'metadoctype', 'contact']
                for doctypeInfo in @body
                    if doctypeInfo.name is 'alarm'
                        @alarm = doctypeInfo
                    else if doctypeInfo.name is 'metadoctype'
                        @metadoctype = doctypeInfo
                    else if doctypeInfo.name is 'contact'
                        @contact = doctypeInfo
                    else
                        expectedDoctypes.should.contain doctypeInfo.name

                should.exist @alarm
                should.exist @metadoctype
                should.exist @contact

            it "And alarm should have its meta information", =>
                @alarm.should.have.properties ['name', 'sum', 'app', 'metadoctype']
                @alarm.metadoctype.should.have.properties ['related', 'displayName', 'identificationField', 'fields']
                @alarm.metadoctype.related.should.equal 'Alarm'
                @alarm.metadoctype.displayName.should.equal 'Alarme'
                @alarm.metadoctype.identificationField.should.equal 'description'

            it "And contact shouldn't have its meta information", =>
                @contact.should.not.have.property 'metadoctype'

            it "And metadoctype shouldn't have its meta information", =>
                @metadoctype.should.not.have.property 'metadoctype'
