#********************************************************
#******************** CLASS DataSystem ******************
#********************************************************
#@description :             DataSystem define....
#@outside requirement : 	npm 'request-json'
#@noesis requirement :      oErrorHelper
#@patches requirement :     none
#@constructor :             Use "new" for create an instance of a DataSystem
CoreClass = require './CoreClass'
class DataSystem extends CoreClass
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


    #----------------- OBJECT PARAMETERS ---------------
    constructor: ->

        #------ REQUIRED
        @hlpError = require './../noesis-tools/oErrorHelper'
        @jsonClient = require('request-json').JsonClient
        @clientDS = new @jsonClient @DS_URL +  ':'  + @DS_PORT
        @registeredPatterns = {}

        #------ SUB-PROCESS
        #Authentification
        if process.env.NODE_ENV is "production"
            username = process.env.NAME
            password = process.env.TOKEN
            @clientDS.setBasicAuth username, password

    #-------------- OBJECT METHODS ----------------------
    prepareDballRequests: (patterns = []) ->
        setupRequestsAll = []        

        #prepare parameters
        for pattern, index in patterns            
               
            #prepare request (as a closure)
            ((pattern)=>
                setupRequestsAll.push (callback) => 
                    soberPattern = pattern.toLowerCase()
                    path = @PATH.request + soberPattern  + @PATH.all              
                    viewFunctions =
                        map: (doc) ->
                            if doc.docType?
                                if doc.docType.toLowerCase() is '__pattern__'
                                    emit doc._id, doc
                    @manageRequest callback, path, viewFunctions, soberPattern

            )(pattern)
        return setupRequestsAll

    manageRequest: (callback, path, viewFunctions =  {}, pattern = '') ->
        
        # convert map/reduce to string and replace optional pattern
        for key, func of viewFunctions
            funcAsString = func.toString()
            if pattern isnt ''
                viewFunctions[key] = funcAsString.replace '__pattern__', pattern
            else
                viewFunctions[key] = funcAsString 

        #create request
        @clientDS.put path, viewFunctions, (error, response, body) =>

            if error
                @_logErrorInConsole error
                callback true

            else
                if pattern isnt ''
                    @registeredPatterns[pattern] = true
                callback false, body

    getView: (callback, path, params = {}) ->
        @postData callback, path, params

    getDoctypes: (callback) ->
        @getData callback, @PATH.doctypes

    indexId: (id, aFields) ->
        @clientDS.post @PATH.index + id, {"fields": aFields}, (error, response, body) =>
            if error
                @_logErrorInConsole error
            else if response.statusCode isnt 200
                @_logErrorInConsole new Error(body)

    deleteById: (id, callback) ->
        @deleteData @PATH.data + id + '/', callback


    putData: (callback, path, params = {}) ->
        @clientDS.put path, params, (error, response, body) =>

            #return error
            if error
                @_logErrorInConsole error
                callback true

            #return result
            else
                callback false, body

    getData: (callback, path) ->
        @clientDS.get path, (error, response, body) =>

            #return and log error
            if error
                @_logErrorInConsole error
                callback true

            #return result
            else
                callback false, body


    postData: (callback, path, params = {}) ->
        @clientDS.post path, params, (error, response, body) =>

            #return error
            if error
                @_logErrorInConsole error
                callback true

            #return result
            else
                if not body.length?
                    body = @formatBody(body)

                callback false, body

    deleteData: (path, callback) ->
        @clientDS.del path, (error, response, body) =>
            if error
                @_logErrorInConsole error
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