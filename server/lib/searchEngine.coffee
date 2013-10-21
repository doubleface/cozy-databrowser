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
    constructor : (@dataSystem) ->
        @path = @dataSystem.PATH

    #-------------- OBJECT METHODS ----------------------
    search : (res, doctypes, pageParams) ->
        requests = []
        path =
        requests.push (callback) => #0 -> metadoctypes
            @dataSystem.getView @path.metadoctype.getallbyrelated, callback

        #one request per doctype
        #reqCount = 0
        #for dt in req.query.doctype
        requests.push (callback) => #1 to n -> requests

            doctypeName = doctypes[0].toLowerCase()

            if pageParams['query']?
                searchPath = @path.search + doctypeName
                @dataSystem.getView searchPath, callback, pageParams

            else
                requestPath = @path.request + doctypeName + @path.all
                @dataSystem.getView requestPath, callback, pageParams
            #reqCount++


        ASYNC.parallel requests, (error, results) =>
            documents = []

            if error
                res.send {'no_result' : @dataSystem.ERR_MSG.retrieveData}
                @_logErrorInConsole error

            else

                #for dt in req.query.doctype
                doctypeName = doctypes[0].toLowerCase()
                newFields = @prepareMetadoctypeInfo results[0], doctypeName

                #for result, index in results
                    #if index > 0
                for doc in results[1]
                    if doc.key? and doc.value?
                        myDoctype = doc.value['docType'].toLowerCase()
                        doc.value['idField'] = newFields.idField[myDoctype]
                        doc.value['descField'] = newFields.descField[myDoctype]
                        documents.push doc.value

                res.send(documents)

    prepareMetadoctypeInfo : (metadoctypes, currentDoctype) ->
        newFields =
            idField : [],
            descField : []

        for metadoctype in metadoctypes

            if metadoctype.key?
                identifier = metadoctype.value.identificationField || null
                key = metadoctype.key.toLowerCase() || null

                if identifier? and key is currentDoctype
                    newFields.idField[currentDoctype] = identifier

                    if metadoctype.value.fields?
                        descripter = metadoctype.value.fields
                        newFields.descField[currentDoctype] = descripter
        return newFields


#********************************************************

module.exports = (param) -> return new SearchEngine param