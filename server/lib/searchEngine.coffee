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

        doctypeName = doctypes[0].toLowerCase()

        callback = (error, results) =>
            documents = []

            if error
                res.send {'no_result' : @dataSystem.ERR_MSG.retrieveData}
                @_logErrorInConsole error
            else
                doctypeName = doctypes[0].toLowerCase()

                for doc in results
                    if doc.key? and doc.value?
<<<<<<< HEAD
                        doctype = doc.value['docType'].toLowerCase()
                        doc.value['idField'] = []
                        doc.value['descField'] = []
                        doc.value['displayName'] = []
=======
                        doctype = doc.value.docType.toLowerCase()
                        doc.value.idField = newFields.idField[doctype]
                        doc.value.descField = newFields.descField[doctype]
                        displayedName = newFields.displayName[doctype]
                        doc.value.displayName = displayedName
                        if doc.value.password?
                            doc.value.password = '***************'
>>>>>>> master
                        documents.push doc.value

                res.send(documents)

        if pageParams['query']?
            path = @path.search + doctypeName
        else
            path = @path.request + doctypeName + @path.all

        @dataSystem.getView path, callback, pageParams

#********************************************************

module.exports = (param) -> return new SearchEngine param
