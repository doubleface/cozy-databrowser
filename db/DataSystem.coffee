#********************************************************
#******************** CLASS DataSystem ******************
#********************************************************
#@description :             DataSystem define....
#@outside requirement : 	npm 'request-json'
#@noesis requirement :      none
#@patches requirement :     none
#@constructor :             Use "new" for create an instance of a DataSystem
  
module.exports = class DataSystem 
    #------------------ CONSTRUCTOR CONSTANTS ----------------
    @CLASS_NAME : "DataSystem"
    @CLASS_COUNT : 0

    #------------------ PROTOTYPE CONSTANTS ----------------
    DS_URL : "http://127.0.0.1"
    DS_PORT : 9101
    PATH : {
        doctypes : '/doctypes'
        request : '/request/'
        all : '/all/'
        metadoctype_getallbyrelated : '/request/metadoctype/getallbyrelated/'
        metadoctype_getsumsbydoctype : '/request/metadoctype/getsumsbydoctype/'
    }

         
    #------------- CLASS DIRECT PROCESS ----------------

     
    #----------------- OBJECT PARAMETERS ---------------
    constructor : (@models) ->
        
        #------ DIRECT
        #setted by coffeescript contructor function 
        
        #------ REQUIRED   
        this.jsonClient = require('request-json').JsonClient           
        
        #------ SETTED
        #this.bParamSetted = false
                
        #------ DECLARED
        #this.oParamDeclared    
        
        #------ SUB-CONTRUCTOR
        #this.create()
        
        #------ SUB-PROCESS
        @constructor.CLASS_COUNT++
        
    #-------------- OBJECT METHODS ----------------------
    #------CONSTANT GETTERS
    #use coffeescript :: (ex : DataSystem::CLASS_COUNT)
    
    #------METHODS
    # create : -> 
    #     console.log(@sParam)

    manageRequest : (callback, path, viewFunctions =  {}) ->
        for key, func of viewFunctions
            viewFunctions[key] = func.toString()
        this.putData callback, @DS_URL, @DS_PORT, path, viewFunctions

    getView : (callback, path, params = {}) ->
        this.postData callback, @DS_URL, @DS_PORT, path, params

    getDoctypes : (callback) -> 
        this.getData callback, @DS_URL, @DS_PORT, @PATH.doctypes

    putData : (callback, url, port, path, params = {})->
        client = new @jsonClient url +  ':'  + port
        client.put path, params, (error, response, body) ->

            #return error     
            if error
                console.log error
                callback true

            #return result
            else  
                callback false, body

    getData : (callback, url, port, path)->
        client = new @jsonClient url +  ':'  + port
        client.get path, (error, response, body) ->         

            #return and log error
            if error
                console.log error
                callback true
            
            #return result
            else  
                callback false, body  

    postData : (callback, url, port, path, params = {})->
        client = new @jsonClient url +  ':'  + port
        client.post path, params, (error, response, body) ->

            #return error     
            if error
                console.log error
                callback true

            #return result
            else  
                callback false, body
    
    applyModelRequest : (callback, modelName, requestName, requestParams) ->
        requestParams = requestParams || {}
        jsonRes = {}
        error = true        
        if @models[modelName]?
            @models[modelName].request requestName, requestParams, (err, data) -> 
                if data?                    
                    if data.length > 0 
                        error = false                         
                        jsonRes = data
                return callback(error, jsonRes) 
        else 
            return callback(error, jsonRes)
#********************************************************