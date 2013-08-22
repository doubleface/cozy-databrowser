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

            #needed var
            setupRequestsAll = []
            globalCount = 0
            pathAll = []
            patternAll = [] 
            mapAll =  [] 

            #prepare parameters
            for dt, index in results[0]
                pathAll[index] = DataSystem::PATH.request + dt.toLowerCase() + DataSystem::PATH.all           
                patternAll[index] = dt.toLowerCase() 
                mapAll[index] =  {
                    map : (doc) ->
                        if doc.docType?
                            if doc.docType.toLowerCase() is '__pattern__'
                                emit doc._id, doc 
                }

                #prepare request        
                setupRequestsAll.push (callback) ->                     
                    ds.manageRequest(callback, pathAll[globalCount], mapAll[globalCount], patternAll[globalCount])
                    globalCount++

            #agregate callback
            if setupRequestsAll.length > 0
                async.parallel setupRequestsAll, (error, results) ->
                    if error
                        console.log error               