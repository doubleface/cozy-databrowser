noesis = noesis || {}

#********************************************************
#******************** CLASS CheckingDdl ******************
#********************************************************
#@description :             CheckingDdl define....
#@outside requirement : 	none
#@noesis requirement :      none
#@patches requirement :     none
#@constructor :             Use "new" for create an instance of a CheckingDdl
  
class noesis.CheckingDdl
    #------------------ CONSTRUCTOR CONSTANTS ----------------
    @CLASS_NAME : "CheckingDdl"
    @CLASS_COUNT : 0

    #------------------ PROTOTYPE CONSTANTS ----------------
    #DS_URL : "http://127.0.0.1"
         
    #------------- CLASS DIRECT PROCESS ----------------

     
    #----------------- OBJECT PARAMETERS ---------------
    constructor : (@aStrings) ->
        
        #------ DIRECT
        #setted by coffeescript contructor function 
        
        #------ REQUIRED   
        this.jsonClient = require('request-json').JsonClient 
        
        #------ SUB-PROCESS
        @constructor.CLASS_COUNT++
        
    #-------------- OBJECT METHODS ----------------------
    #------CONSTANT GETTERS
    #use :: (ex : CheckingDdl::DS_URL)
    
    #------METHODS
    create : () ->
        that = this  
#********************************************************