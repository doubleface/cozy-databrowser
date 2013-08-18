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
    constructor : (@Metadoctype) ->
        
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

    reqDoctypes : (callback, jsonForm, withMeta = false) -> 

        #needed var
        that = this

        #waiting metadoctypes
        if withMeta
            this.getMetadoctypes((metadoctypes) ->
                that.getData that.DS_URL, that.DS_PORT, that.PATH.doctypes, callback, jsonForm, metadoctypes
            )

        #direct call
        else 
            this.getData @DS_URL, @DS_PORT, @PATH.doctypes, callback, jsonForm

    getData : (url, port,  path, callback, jsonForm, metadoctypes)->
        that = this
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

                #display and transform json
                if jsonForm? && typeof jsonForm is "string"  
       
                    for val in body  
                        newObj = {}

                        #encapsulate val                      
                        newObj[jsonForm] = val  

                        #add metadoctype
                        if metadoctypes? 
                            for md in metadoctypes    
                                if (md.related.toLowerCase() is val.toLowerCase())                                                
                                    newObj["metadoctype"] = md

                        jsonRes.push(newObj)

                #display json
                else  
                    jsonRes = body

                #apply callback
                callback false, jsonRes   
    
    getMetadoctypes : (callbackMD) ->
        md = {}
        if @Metadoctype?
            @Metadoctype.request "bydoctypename", (err, metadoctypes) ->                
                if err
                    compound.logger.write "Request Metadoctype#All, cannot be created"
                    compound.logger.write err
                else if metadoctypes?
                    if metadoctypes.length > 0  
                        md = metadoctypes 
                return callbackMD(md) 
        else 
            return callbackMD(md) 
#********************************************************