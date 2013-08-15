#Namespace for noesis contributio
noesis = noesis || {}

#********************************************************
#******************** CLASS MyClass *********************
#********************************************************
#@description :             MyClass define....
#@outside requirement :     npm express.js
#@noesis requirement :      noesis.oNumberHelper, ...
#@patches requirement :     indexOf...
#@constructor :             Use "new" for create an instance of a MyClass
#TIPS :                     With ubuntu sublime, Use alt + F3 on "MyClass" to replace all occurence
class MyClass 
	#------------------ CLASS CONSTANTS ----------------
    #------ CLASS_NAME String contains the literal name of the class. use getCLASS_NAME() to get it
    @CLASS_NAME : "MyClass"
    
    #------ CLASS_COUNT Integer contains the current number of instance of the class. use getCLASS_COUNT() to get it
    @CLASS_COUNT : 0
         
    #------------- CLASS DIRECT PROCESS ----------------

     
    #----------------- OBJECT PARAMETERS ---------------
    constructor : (@sParam) ->
        
        #------ DIRECT
        #setted by coffeescript contructor function 
        
        #------ REQUIRED
        #this.oNumberHelper = noesis.oNumberHelper
        
        #------ SETTED
        this.bParamSetted = false
                
        #------ DECLARED
        this.oParamDeclared    
        
        #------ SUB-CONTRUCTOR
        this.create()
        
        #------ SUB-PROCESS
        @constructor.CLASS_COUNT++
        
    #-------------- OBJECT METHODS ----------------------
    #------CONSTANT GETTERS
    #use coffeescript :: (ex : myClass::CLASS_COUNT)
    
    #------METHODS
    create : -> 
        console.log(@sParam)

#as a server module
if module?
    module.exports = noesis.MyClass
else
    noesis.DataSystem = DataSystem