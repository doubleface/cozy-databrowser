#********************************************************
#******************** CLASS DataSystem ******************
#********************************************************
#@description :             DataSystem define....
#@outside requirement : 	npm 'request-json'
#@noesis requirement :      none
#@patches requirement :     none
#@constructor :             Use "new" for create an instance of a DataSystem
  
class DataSystem 
    #------------------ CONSTRUCTOR CONSTANTS ----------------
    @CLASS_NAME : "DataSystem"
    @CLASS_COUNT : 0

    #------------------ PROTOTYPE CONSTANTS ----------------
    DS_URL : "http://127.0.0.1"
    DS_PORT : 9101
    DI_PORT : 9102
    PATH : {
        data : '/data/'
        doctypes : '/doctypes'
        request : '/request/'
        all : '/dball/'
        search : '/data/search/'
        index : '/data/index/'
        common :
            getsumsbydoctype : '/request/common/getsumsbydoctype/'
        metadoctype :
            getallbyrelated : '/request/metadoctype/getallbyrelated/'  
        application :
            getpermissions : '/request/application/getpermissions/'   
    }

         
    #------------- CLASS DIRECT PROCESS ----------------

     
    #----------------- OBJECT PARAMETERS ---------------
    constructor : () ->
        
        #------ DIRECT
        #setted by coffeescript contructor function 
        
        #------ REQUIRED   
        @jsonClient = require('request-json').JsonClient
        @clientDS = new @jsonClient @DS_URL +  ':'  + @DS_PORT
        @pageCountMatrix = {}
        
        #------ SUB-PROCESS
        #console.log("NEW DS !")
        @constructor.CLASS_COUNT++
        
    #-------------- OBJECT METHODS ----------------------
    #------CONSTANT GETTERS
    #use :: (ex : DataSystem::DS_URL)
    getPATH : () ->
        return @PATH
    
    #------METHODS
    manageRequest : (callback, path, viewFunctions =  {}, pattern = '') ->
        # convert map/reduce to string and replace optional pattern
        for key, func of viewFunctions
            viewFunctions[key] = func.toString()
            if pattern isnt ''
                viewFunctions[key] = viewFunctions[key].replace '__pattern__', pattern        
        
        #create request
        @putData callback, path, viewFunctions

    getView : (callback, path, params = {}) ->
        @postData callback, path, params        

    getDoctypes : (callback) -> 
        @getData callback, @PATH.doctypes

    indexId : (id, aFields) ->        
        @clientDS.post @PATH.index + id, {"fields": aFields}, (error, response, body) ->
            if error
                console.log error
            else if response.statusCode isnt 200
                console.log new Error(body)

    deleteById : (callback, id)->
        @deleteData callback, @PATH.data + id + '/'

    
    putData : (callback, path, params = {})->
        @clientDS.put path, params, (error, response, body) ->

            #return error     
            if error
                console.log error
                callback true

            #return result
            else  
                callback false, body

    getData : (callback, path)->
        @clientDS.get path, (error, response, body) ->         

            #return and log error
            if error
                console.log error
                callback true
            
            #return result
            else  
                callback false, body


    postData : (callback, path, params = {})->
        @clientDS.post path, params, (error, response, body) =>

            #return error     
            if error
                console.log error
                callback true

            #return result
            else  
                if not body.length?
                    body = @formatBody(body)

                callback false, body

    deleteData : (callback, path)->
        @clientDS.del path, (error, response, body) ->         

            #return and log error
            if error
                console.log error
                callback true
            
            #return result
            else  
                callback false, body
    
    # applyModelRequest : (callback, modelName, requestName, requestParams) ->
    #     requestParams = requestParams || {}
    #     jsonRes = {}
    #     error = true        
    #     if @models[modelName]?
    #         @models[modelName].request requestName, requestParams, (err, data) -> 
    #             if data?                    
    #                 if data.length > 0 
    #                     error = false                         
    #                     jsonRes = data
    #             return callback(error, jsonRes) 
    #     else 
    #         return callback(error, jsonRes)

    
    formatBody : (body) ->
        formattedBody = []        
        if body.rows? and body.rows.length > 0
            for row in body.rows
                formattedRow = {}
                if row._id? then formattedRow['id'] = row._id
                if row.docType then formattedRow['key'] = row.docType
                formattedRow['value'] = row
                formattedBody.push formattedRow
        return formattedBody
#********************************************************

module.exports = new DataSystem()