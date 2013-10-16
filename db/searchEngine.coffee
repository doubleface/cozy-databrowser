CoreClass = require './../helpers/CoreClass'

#********************************************************
#******************** CLASS SearchEngine ****************
#********************************************************
#@description : used to perform search with the cozy databrowser

class SearchEngine extends CoreClass

    #------------------ CONSTRUCTOR CONSTANTS ----------------
    @CLASS_NAME : "SearchEngine"

    #------------------ PROTOTYPE CONSTANTS ----------------
    #required dependencies
    ASYNC = require 'async' 
   
    #----------------- OBJECT PARAMETERS ---------------
    constructor : (@ds) ->
        
        
    #-------------- OBJECT METHODS ----------------------
    doBasicSearch : (res, tabDoctypes, pageParams) ->         
            requests = []
            requests.push (callback) => #0 -> metadoctypes
                @ds.getView callback, @ds.PATH.metadoctype.getallbyrelated
            
            #one request per doctype
            #reqCount = 0
            #for dt in req.query.doctype
            requests.push (callback) => #1 to n -> requests                

                doctypeName = tabDoctypes[0].toLowerCase()

                if pageParams['query']?
                    searchPath = @ds.PATH.search + doctypeName
                    @ds.getView callback, searchPath, pageParams

                else                    
                    requestPath = @ds.PATH.request + doctypeName
                    @ds.getView callback, requestPath + @ds.PATH.all, pageParams
                #reqCount++
                    

            ASYNC.parallel requests, (error, results) =>
                jsonRes = []

                if error
                    res.send {'no_result' : @ds.ERR_MSG.retrieveData}
                    @_logErrorInConsole error

                else
                    idField = []
                    descField = []

                    #for dt in req.query.doctype
                    for md in results[0]                        
                        if md.key? 
                            
                            doctypeName = tabDoctypes[0].toLowerCase()
                            identifier = md.value.identificationField || null
                            key = md.key.toLowerCase() || null

                            if identifier? and key is doctypeName
                                idField[doctypeName] = identifier
                                if md.value.fields?
                                    descField[doctypeName] = md.value.fields

                    #for result, index in results                       
                        #if index > 0
                    for doc in results[1]
                        if doc.key? and doc.value? 
                            currentDoctype = doc.value['docType'].toLowerCase()
                            doc.value['idField'] = idField[currentDoctype]
                            doc.value['descField'] = descField[currentDoctype]                         
                            jsonRes.push doc.value  

                    res.send(jsonRes)
#********************************************************

module.exports = (param) -> return new SearchEngine param