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
    PATH : 
    	doctypes : "/doctypes"

         
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

    reqDoctypes : (callback) -> 
        this.getData @DS_URL, @DS_PORT, @PATH.doctypes, callback

    getData : (url, port, path, callback)->
        client = new @jsonClient url +  ':'  + port
        client.get path, (error, response, body) ->

            #needed var
            jsonRes = []            

            #return and log error
            if error
                console.log error
                callback true
            
            #return result
            else  
                jsonRes = body
                callback false, jsonRes   
    
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