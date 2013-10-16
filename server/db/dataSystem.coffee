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
    ARRAY_HELPER: require './../helpers/oArrayHelper'

    #general pathes
    DS_URL: "http://127.0.0.1"
    DS_PORT: 9101
    DI_PORT: 9102

    #specific pathes
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

    #common error messages
    ERR_MSG:
        retrieveData : 'Error : Server error occurred while retrieving data.'
        removeData : 'Error : Server error occurred while trying to remove data.'
        unknownDoctype : 'Error : You try to access to an unknown doctype.'
        unknownParamaters : 'Error : Unknown research parameters'        
        unknownId : 'Error : Document ID parameter not found.'


    #----------------- OBJECT PARAMETERS ---------------
    constructor: ->       
        
        #------ SETTED
        @clientDS = new @JSON_CLIENT @DS_URL +  ':'  + @DS_PORT
        @registeredPatterns = {}

        #------ SUB-PROCESS
        #Authentification
        if process.env.NODE_ENV is "production"
            username = process.env.NAME
            password = process.env.TOKEN
            @clientDS.setBasicAuth username, password

    #-------------- OBJECT METHODS ----------------------
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

    manageRequest: (path, viewFunctions, callback, pattern = '') ->
        
        # convert map/reduce to string and replace optional pattern
        for key, func of viewFunctions
            funcAsString = func.toString()
            if pattern isnt ''
                viewFunctions[key] = funcAsString.replace '__pattern__', pattern
            else
                viewFunctions[key] = funcAsString 
        console.log(path)

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
        fields = {"fields": aFields}
        @clientDS.post @PATH.index + id, fields, (error, response, body) =>

            if error
                @_logErrorInConsole error, true

            else if response.statusCode isnt 200
                @_logErrorInConsole new Error(body), true

    deleteById: (id, callback) ->
        @deleteData @PATH.data + id + '/', callback


    putData: (callback, path, params = {}) ->
        @clientDS.put path, params, (error, response, body) =>

            if error
                @_logErrorInConsole error
                callback true

            else
                callback false, body

    getData: (callback, path) ->
        @clientDS.get path, (error, response, body) =>

            if error
                @_logErrorInConsole error
                callback true

            else
                callback false, body


    postData: (callback, path, params = {}) ->
        @clientDS.post path, params, (error, response, body) =>

            if error
                @_logErrorInConsole error
                callback true

            else
                if not body.length?
                    body = @formatBody body

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

    areValidDoctypes: (doctypes, callback = null) ->
        @getDoctypes (error, registered) =>
            errorMsg = null
            areValid = true
            bError = false
            if error
                errorMsg = @ERR_MSG.retrieveData
                console.log error
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