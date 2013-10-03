#********************************************************
#******************** CLASS SearchEngine ******************
#********************************************************
#@description :             SearchEngine define....
#@outside requirement : 	npm 'async'
#@noesis requirement :      none
#@patches requirement :     none
#@constructor :             Use "new" for create an instance of a SearchEngine
  
class SearchEngine 
    #------------------ CONSTRUCTOR CONSTANTS ----------------
    @CLASS_NAME : "SearchEngine"
    @CLASS_COUNT : 0

    #------------------ PROTOTYPE CONSTANTS ----------------

         
    #------------- CLASS DIRECT PROCESS ----------------

     
    #----------------- OBJECT PARAMETERS ---------------
    constructor : (@ds) ->
        
        #------ DIRECT
        #setted by coffeescript contructor function 
        
        #------ REQUIRED
        @hlpError = require './../noesis-tools/oErrorHelper'
        @async = require 'async' 
        
        #------ SUB-PROCESS
        @hlpError.setErrorManager(@)
        @constructor.CLASS_COUNT++
        
    #-------------- OBJECT METHODS ----------------------
    #------CONSTANT GETTERS
    #use :: (ex : SearchEngine::DS_URL)
    
    #------METHODS
    doBasicSearch : (res, tabDoctypes, pageParams) ->         
            requests = []
            requests.push (callback) => #0 -> metadoctypes
                @ds.getView callback, @ds.getPATH().metadoctype.getallbyrelated

            #one request per doctype
            #reqCount = 0
            #for dt in req.query.doctype
            requests.push (callback) => #1 to n -> requests
                doctypeName = tabDoctypes[0].toLowerCase()
                if pageParams['query']?
                    @ds.getView callback, @ds.getPATH().search + doctypeName, pageParams
                else
                    @ds.getView callback, @ds.getPATH().request + doctypeName + @ds.getPATH().all, pageParams
                #reqCount++
                    

            @async.parallel requests, (error, results) =>
                jsonRes = []
                if error
                    res.send {'no_result' : 'Error : Server error occurred while retrieving data.'}
                    @logErrInConsole error, @_getFunc(), @_getFile(), @_getLine()
                else
                    idField = []
                    descField = []
                    #for dt in req.query.doctype
                    for md in results[0]
                        if md.key? and md.value.identificationField? and md.key.toLowerCase() is tabDoctypes[0].toLowerCase()                         
                            idField[tabDoctypes[0].toLowerCase()] = md.value.identificationField
                            if md.value.fields?
                                descField[tabDoctypes[0].toLowerCase()] = md.value.fields
                    #for result, index in results                       
                        #if index > 0
                    for doc in results[1]
                        if doc.key? and doc.value? 
                            doc.value['idField'] = idField[doc.value['docType'].toLowerCase()]
                            doc.value['descField'] = descField[doc.value['docType'].toLowerCase()]                         
                            jsonRes.push doc.value  
                    res.send(jsonRes)


                    #page count matrix knows how many results must be skipped for each doctypes
                    #ds.pageCountMatrix[newKey] = jsonRes

                    #prepare limit   
                    #limit = if ds.pageCountMatrix[newKey].length? and ds.pageCountMatrix[newKey].length <= nbPerPage then ds.pageCountMatrix[newKey].length else nbPerPage
                    #res.send(ds.pageCountMatrix[newKey].slice(0, limit))                    
            # else if ds.pageCountMatrix[newKey] and ds.pageCountMatrix[newKey].length > nbPerPage
            #     #send json     
            #     limit = if ds.pageCountMatrix[newKey].length? and ds.pageCountMatrix[newKey].length <= nbPerPage*page then ds.pageCountMatrix[newKey].length else nbPerPage*page              
            #     res.send(ds.pageCountMatrix[newKey].slice(nbPerPage*(page-1), limit))

   

module.exports = (param) -> return new SearchEngine param