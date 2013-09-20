noesis = noesis || {}

#********************************************************
#******************** CLASS CheckingDdl ******************
#********************************************************
#@description :             CheckingDdl define....
#@outside requirement : 	jquery
#@noesis requirement :      none
#@patches requirement :     none
#@constructor :             Use "new" for create an instance of a CheckingDdl
  
class noesis.CheckingDdl
    #------------------ CONSTRUCTOR CONSTANTS ----------------
    @CLASS_NAME : "CheckingDdl"
    @CLASS_COUNT : 0
    CSS_CLASSES = {
        container : "cddl-engine-container",    
        title : "cddl-title",
        list : "cddl-list",
        listItem : "cddl-list-item",
        listItemContent :"cddl-list-item-content",
        listItemCb : "cddl-list-item-checkbox"
    }

    #------------------ PROTOTYPE CONSTANTS ----------------
    #DS_URL : "http://127.0.0.1"
         
    #------------- CLASS DIRECT PROCESS ----------------

     
    #----------------- OBJECT PARAMETERS ---------------
    constructor : (@sTitle, @aStrings, @sIdParent) ->
        
        #------ DIRECT
        #setted by coffeescript contructor function         

        #------ SETTED
        @sEltUniqId = CSS_CLASSES.container + @constructor.CLASS_COUNT;
       
        #------ SUB-PROCESS
        @create()
        @constructor.CLASS_COUNT++
        
    #-------------- OBJECT METHODS ----------------------
    #------CONSTANT GETTERS
    #use :: (ex : CheckingDdl::DS_URL)
    
    #------METHODS
    create : () ->
        that = this

        #prepare elements
        eltContainer = $(document.createElement 'div').addClass(CSS_CLASSES.container).attr('id', @sEltUniqId)
        eltTitle = $(document.createElement 'span').addClass(CSS_CLASSES.title).text(@sTitle)
        @eltList = $(document.createElement 'ul')              

        #prepare list
        for sRow in @aStrings                
            eltListItem = $(document.createElement 'li').addClass(CSS_CLASSES.listItem);
            eltContent = $(document.createElement 'span').addClass(CSS_CLASSES.listItemContent).text(sRow)
            eltCb = $(document.createElement 'input').attr('type', 'checkbox').addClass(CSS_CLASSES.listItemCb)
            eltListItem.append [eltContent, eltCb]
            @eltList.append eltListItem

        #append elements
        eltContainer.append [eltTitle, @eltList] 
        $(@sIdParent).append eltContainer
#********************************************************