#Namespace for noesis contribution
noesis = noesis || {}


#********************************************************
#******************** CLASS DataSystem *********************
#********************************************************
#@description :             DataSystem define....
#@outside requirement : 	npm 'request-json'
#@noesis requirement :      none
#@patches requirement :     none
#@constructor :             Use "new" for create an instance of a DataSystem
#TIPS :                     With ubuntu sublime, Use alt + F3 on "DataSystem" to replace all occurence
class DataSystem 
	#------------------ CONTRUCTOR CONSTANTS ----------------
    @CLASS_NAME : "DataSystem"
    @CLASS_COUNT : 0

    #------------------ PROTOTYPE CONSTANTS ----------------
    DS_URL : "http://127.0.0.1"
    DS_PORT : 9101
    PATH : 
    	doctypes : "/doctypes"
         
    #------------- CLASS DIRECT PROCESS ----------------

     
    #----------------- OBJECT PARAMETERS ---------------
    constructor : (@sParam) ->
        
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

    reqDoctypes : (response) -> 
        this.getData @DS_URL, @DS_PORT, "get", @PATH.doctypes, response

    getData : (url, port, method, path, response)->
    	client = new @jsonClient url +  ':'  + port
    	client[method] path, (err, res, body) ->
    	 	response.send body        
#********************************************************


#As a server or client module ?
if module?	
    module.exports = DataSystem
else
	noesis.DataSystem = DataSystem