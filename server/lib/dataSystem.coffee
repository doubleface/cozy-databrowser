CoreClass = require './../helpers/CoreClass'

#********************************************************
#******************** CLASS DataSystem ******************
#********************************************************
#@description : used to communicate with the cozy data-system

class DataSystem extends CoreClass

    #------------------ CONSTRUCTOR CONSTANTS ----------------
    @CLASS_NAME: "DataSystem"

    #------------------ PROTOTYPE CONSTANTS ----------------
    #required dependencies
    JSON_CLIENT: require('request-json').JsonClient
    ASYNC: require 'async'
    ARRAY_HELPER: require './../helpers/oArrayHelper'

    #general pathes
    DS_URL: "http://127.0.0.1"
    DS_PORT: 9101
    DI_PORT: 9102

    #specific paths
    PATH:
        data: '/data/'
        request: '/request/'
        all: '/dball/'
        search: '/data/search/'
        index: '/data/index/'
        doctypes:
            getall: '/doctypes'
            getsums: '/request/doctypes/getsums/'
            getallbyorigin : '/request/doctypes/getallbyorigin/'
        metadoctype:
            getallbyrelated: '/request/metadoctype/getallbyrelated/'
        application:
            getpermissions: '/request/application/getpermissions/'

    #common error messages
    ERR_MSG:
        retrieveData : 'Error : Server error occurred while retrieving data.'
        removeData : 'Error : Server error occurred while removing data.'
        unknownDoctype : 'Error : You try to access to an unknown doctype.'
        unknownParamaters : 'Error : Unknown research parameters'
        unknownId : 'Error : Document ID parameter not found.'


    #----------------- OBJECT PARAMETERS ---------------
    constructor: ->

        #------ SETTED
        @clientDS = new @JSON_CLIENT @DS_URL +  ':'  + @DS_PORT
        @registeredPatterns = {}
        @isSilent = false

        #------ SUB-PROCESS
        #Authentification
        if process.env.NODE_ENV is "production"
            username = process.env.NAME
            password = process.env.TOKEN
            @clientDS.setBasicAuth username, password

    #-------------- OBJECT METHODS ----------------------
    #---- PREPARATION METHODS
    prepareDballRequests: (doctypes = []) ->
        setupRequestsAll = []

        #prepare parameters
        for doctypeName, index in doctypes

            #prepare request (as a closure)
            ((doctypeName)=>
                setupRequestsAll.push (callback) =>
                    doctypeName = doctypeName.toLowerCase()
                    path = @PATH.request + doctypeName  + @PATH.all
                    viewFunctions =
                        map: (doc) ->
                            if doc.docType?
                                if doc.docType.toLowerCase() is '__pattern__'
                                    emit doc._id, doc
                    @manageRequest path, viewFunctions, callback, doctypeName

            )(doctypeName)
        return setupRequestsAll

    #---- REQUEST METHODS
    manageRequest: (path, viewFunctions, callback, pattern = '') ->

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
                unless @silent then @_logErrorInConsole error
                callback error

            else
                if pattern isnt ''
                    @registeredPatterns[pattern] = true
                callback null, body

    getView: (path, callback, params = {}) ->
        @postData path, callback, params

    getDoctypes: (callback) ->
        @getData @PATH.doctypes.getall, callback

    getPermissions : (callback) ->
        @getView @PATH.application.getpermissions, callback

    getDoctypesByOrigin : (callback) ->
        viewCallback = (error, body) ->
            if error?
                callback error
            else
                newArray = []
                allObj = {}
                for couple in body
                    if couple.key?
                        if allObj[couple.key[0]]?
                            allObj[couple.key[0]].push couple.key[1]
                        else
                            allObj[couple.key[0]] = []
                            allObj[couple.key[0]].push couple.key[1]
                for objName, obj of allObj
                    newObj = {}
                    newObj['key'] = objName
                    newObj['value'] = obj
                    newArray.push newObj
                callback null, newArray
        @getView @PATH.doctypes.getallbyorigin, viewCallback, group: true


    getDoctypesByApplication: (callback) ->
        @getPermissions (error, applications) ->
            if error?
                callback error
            else
                doctypes = []
                for app in applications
                    appName = app.key.toLowerCase()
                    doctypeName = []
                    for objName, obj of app.value
                            doctypeName.push objName.toLowerCase()
                    doctypes.push
                        'key' : appName
                        'value' : doctypeName
                callback null, doctypes

    indexId: (id, aFields, callback = null) ->
        fields = {"fields": aFields}
        @clientDS.post @PATH.index + id, fields, (error, response, body) =>

            if error or response.statusCode isnt 200
                error = error || new Error body.error
                unless @silent then @_logErrorInConsole error
                if callback? then callback error

            else
                if callback? then callback null, body

    deleteById: (id, callback) ->
        @deleteData @PATH.data + id + '/', callback


    #---- CRUD HTTTP METHODS
    putData: (path, params, callback) ->
        @clientDS.put path, params, (error, response, body) =>

            if error
                error = error
                unless @silent then @_logErrorInConsole error
                callback error

            else
                callback null, body

    getData: (path, callback) ->
        @clientDS.get path, (error, response, body) =>
            if error or response.statusCode isnt 200
                error = error || new Error body.error
                unless @silent then @_logErrorInConsole error
                callback error

            else
                callback null, body


    postData: (path, callback, params = {}) ->
        @clientDS.post path, params, (error, response, body) =>
            if error or response.statusCode isnt 200
                error = error || new Error body.error
                unless @silent then @_logErrorInConsole error
                callback error

            else
                if not body.length?
                    body = @formatBody body

                callback null, body

    deleteData: (path, callback) ->
        @clientDS.del path, (error, response, body) =>

            if error or response.statusCode isnt 204
                error = error || new Error body.error
                unless @silent then @_logErrorInConsole error
                callback error

            else
                callback null, body

    #---- FORMAT METHODS
    formatBody: (body) ->
        formattedBody = []

        if body.rows? and body.rows.length > 0
            for row in body.rows
                formattedRow = {}
                if row._id? then formattedRow['id'] = row._id
                if row.docType? then formattedRow['key'] = row.docType
                formattedRow['value'] = row
                formattedBody.push formattedRow

        return formattedBody

    #---- VALIDATION METHODS
    areValidDoctypes: (doctypes, callback = null) ->
        @getDoctypes (error, registered) =>
            errorMsg = null
            areValid = true
            bError = false
            if error
                errorMsg = @ERR_MSG.retrieveData
                console.log error
                bError = true
            else

                #compare given doctype and existing doctype for security
                for unregistered in doctypes
                    if not @ARRAY_HELPER.isInArray unregistered, registered
                        bError = true
                        errorMsg = @ERR_MSG.unknownDoctype
                        break

            areValid = not bError
            if callback? then callback areValid, errorMsg

#********************************************************

module.exports = new DataSystem()