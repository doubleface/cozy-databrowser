#********************************************************
#******************** CLASS DataSystem ******************
#********************************************************
#@description :             DataSystem define....
#@outside requirement : 	npm 'request-json'
#@noesis requirement :      oErrorHelper
#@patches requirement :     none
#@constructor :             Use "new" for create an instance of a DataSystem

class DataSystem
    #------------------ CONSTRUCTOR CONSTANTS ----------------
    @CLASS_NAME: "DataSystem"
    @CLASS_COUNT: 0

    #------------------ PROTOTYPE CONSTANTS ----------------
    DS_URL: "http://127.0.0.1"
    DS_PORT: 9101
    DI_PORT: 9102
    PATH:
        data: '/data/'
        doctypes: '/doctypes'
        request: '/request/'
        all: '/dball/'
        search: '/data/search/'
        index: '/data/index/'
        common:
            getsumsbydoctype: '/request/common/getsumsbydoctype/'
        metadoctype:
            getallbyrelated: '/request/metadoctype/getallbyrelated/'
        application:
            getpermissions: '/request/application/getpermissions/'

    ERR_MSG:
        retrieveData : 'Error : Server error occurred while retrieving data.'
        removeData : 'Error : Server error occurred while trying to remove data.'
        unknownDoctype : 'Error : You try to access to an unknown doctype.'
        unknownParamaters : 'Error : Unknown research parameters'        
        unknownId : 'Error : Document ID parameter not found.'


    #------------- CLASS DIRECT PROCESS ----------------


    #----------------- OBJECT PARAMETERS ---------------
    constructor: ->

        #------ DIRECT
        #setted by coffeescript contructor function

        #------ REQUIRED
        @hlpError = require './../noesis-tools/oErrorHelper'
        @jsonClient = require('request-json').JsonClient
        @clientDS = new @jsonClient @DS_URL +  ':'  + @DS_PORT
        #@pageCountMatrix = {}
        @registeredPatterns = {}

        #------ SUB-PROCESS
        #Authentification
        if process.env.NODE_ENV is "production"
            username = process.env.NAME
            password = process.env.TOKEN
            @clientDS.setBasicAuth username, password

        #Error manager
        @hlpError.setErrorManager(@)

        #Class
        @constructor.CLASS_COUNT++

    #-------------- OBJECT METHODS ----------------------
    prepareDballRequests: (tabPatterns) ->
        setupRequestsAll = []
        globalCount = 0
        pathAll = []
        patternAll = []
        mapAll =  []

        #prepare parameters
        for pattern, index in tabPatterns
            pathAll[index] = @PATH.request + pattern.toLowerCase() + @PATH.all
            patternAll[index] = pattern.toLowerCase()
            mapAll[index] =
                map: (doc) ->
                    if doc.docType?
                        if doc.docType.toLowerCase() is '__pattern__'
                            emit doc._id, doc
            #prepare request
            setupRequestsAll.push (callback) =>
                @manageRequest(callback, pathAll[globalCount], mapAll[globalCount], patternAll[globalCount])
                globalCount++
        return setupRequestsAll

    manageRequest: (callback, path, viewFunctions =  {}, pattern = '') ->
        # convert map/reduce to string and replace optional pattern
        for key, func of viewFunctions
            viewFunctions[key] = func.toString()
            if pattern isnt ''
                viewFunctions[key] = viewFunctions[key].replace '__pattern__', pattern

        #create request
                #create request
        @clientDS.put path, viewFunctions, (error, response, body) =>

            #return error
            if error
                @logErrInConsole error, @_getFunc(), @_getFile(), @_getLine()
                callback true

            #return result
            else
                if pattern isnt ''
                    @registeredPatterns[pattern] = true
                callback false, body

    getView: (callback, path, params = {}) ->
        @postData callback, path, params

    getDoctypes: (callback) ->
        @getData callback, @PATH.doctypes

    indexId: (id, aFields) ->
        that = this
        @clientDS.post @PATH.index + id, {"fields": aFields}, (error, response, body) =>
            if error
                @logErrInConsole error, @_getFunc(), @_getFile(), @_getLine()
            else if response.statusCode isnt 200
                @logErrInConsole new Error(body), @_getFunc(), @_getFile(), @_getLine()

    deleteById: (id, callback) ->
        @deleteData @PATH.data + id + '/', callback


    putData: (callback, path, params = {}) ->
        @clientDS.put path, params, (error, response, body) =>

            #return error
            if error
                @logErrInConsole error, @_getFunc(), @_getFile(), @_getLine()
                callback true

            #return result
            else
                callback false, body

    getData: (callback, path) ->
        @clientDS.get path, (error, response, body) =>

            #return and log error
            if error
                @logErrInConsole error, @_getFunc(), @_getFile(), @_getLine()
                callback true

            #return result
            else
                callback false, body


    postData: (callback, path, params = {}) ->
        @clientDS.post path, params, (error, response, body) =>

            #return error
            if error
                @logErrInConsole error, @_getFunc(), @_getFile(), @_getLine()
                callback true

            #return result
            else
                if not body.length?
                    body = @formatBody(body)

                callback false, body

    deleteData: (path, callback) ->
        @clientDS.del path, (error, response, body) =>
            if error
                @logErrInConsole error, @_getFunc(), @_getFile(), @_getLine()
                callback error, body
            else
                callback error, body

    formatBody: (body) ->
        formattedBody = []
        if body.rows? and body.rows.length > 0
            for row in body.rows
                formattedRow = {}
                if row._id? then formattedRow['id'] = row._id
                if row.docType then formattedRow['key'] = row.docType
                formattedRow['value'] = row
                formattedBody.push formattedRow
        return formattedBody

module.exports = new DataSystem()