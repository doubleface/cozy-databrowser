module.exports = (compound) ->

    All = compound.models.All
    Metadoctype = compound.models.Metadoctype

    DataSystem = require('./../../db/DataSystem')
    ds = new DataSystem(compound.models)
    async = require('async')


    # all = (doc) ->
    #     emit doc.title, doc

    # Metadoctype.defineRequest "all", all, (err) ->
    #     if err
    #         compound.logger.write "Request Metadoctype#All, cannot be created"
    #         compound.logger.write err


    getAllByRelated = {
        map : (doc) ->
            if doc.docType is 'Metadoctype'
                emit doc.related, doc 
    }

    getSumsByDoctype = {
        map : (doc) ->
            if doc.docType?                
                emit doc.docType, 1         
        reduce : (keys, values, rereduce) ->
            # result = { 'docType' : '', 'sum': 0 }
            # for elt, index in values
            #     if !isNaN(elt)
            #         result.docType = keys[index][0] || ''
            #         result.sum += elt || 0            
            return sum(values)      
    }

    setupRequests = [] 
    setupRequests.push (callback) -> 
        ds.manageRequest(callback, DataSystem::PATH.metadoctype_getallbyrelated, getAllByRelated)
    setupRequests.push (callback) -> 
        ds.manageRequest(callback, DataSystem::PATH.metadoctype_getsumsbydoctype, getSumsByDoctype)

    #agregate callback 
    async.parallel setupRequests, (error, results) ->
        if error
            console.log error

    requests = []
    requests.push (callback) -> #0 -> doctypes
        ds.getDoctypes(callback)
    async.parallel requests, (error, results) ->
        if error
            console.log error
        else 
            setupRequestsAll = []
            for dt in results[0]
                mapAll =  {
                    map : (doc) ->
                        if doc.docType?
                            if doc.docType.toLowerCase() is dt.toLowerCase()
                                emit doc.id, doc 
                }
                pathAll = DataSystem::PATH.request + dt + DataSystem::PATH.all           
                setupRequestsAll.push (callback) -> 
                    ds.manageRequest(callback, pathAll, mapAll)
            if setupRequestsAll.length > 0
                async.parallel setupRequestsAll, (error, results) ->
                    if error
                        console.log error
                    #else 
                        #console.log(results.length + 'requests all added')


            
    # All.defineFullRequest "getSumsByDoctype", getSumsByDoctype, (err) ->
    #     if err
    #         compound.logger.write "Request All#getSumsByDoctype, cannot be created"
    #         compound.logger.write err

    
    # Metadoctype.defineRequest "getAllByRelated", getAllByRelated, (err) ->
    #     if err
    #         compound.logger.write "Request Metadoctype#getAllByRelated, cannot be created"
    #         compound.logger.write err

    # Metadoctype.request "bydoctypename", null, (err) ->
    #     if err
    #         compound.logger.write "Request Metadoctype#bydoctypename, cannot be created"
    #         compound.logger.write err

# var sums = {};
# function (doc) {
#   sums[doc.docType.toLowerCase()] = sums[doc.docType.toLowerCase()] || 0;
#   sums[doc.docType.toLowerCase()]++;

#   if (doc.docType === "Metadoctype") {
#     filter = function (doc) {
#       return emit (doc.related.toLowerCase(), [doc, sums[doc.related.toLowerCase()]]);
#     };
#     filter(doc);
#   }
# }