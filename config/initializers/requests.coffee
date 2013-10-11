module.exports = (compound) ->

    dataSystem = require './../../db/dataSystem'
    async = require 'async'

    #prepare view functions
    vFunc = {
        common : {
            getSumsByDoctype : {
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
        }
        metadoctype : {
            getAllByRelated : {
                map : (doc) ->
                    if doc.docType.toLowerCase() is 'metadoctype'
                        emit doc.related, doc
            }
        }
        application : {
            getPermissions : {
                map : (doc) ->
                    if doc.docType.toLowerCase() is 'application'
                        emit doc.name, doc.permissions
            }
        }
    }

    setupRequests = [] 
    setupRequests.push (callback) -> 
        dataSystem.manageRequest callback, dataSystem.PATH.common.getsumsbydoctype, vFunc.common.getSumsByDoctype
    setupRequests.push (callback) -> 
        dataSystem.manageRequest callback, dataSystem.PATH.metadoctype.getallbyrelated, vFunc.metadoctype.getAllByRelated
    setupRequests.push (callback) -> 
        dataSystem.manageRequest callback, dataSystem.PATH.application.getpermissions, vFunc.application.getPermissions

    #agregate callback 
    async.parallel setupRequests, (error, results) ->
        if error
            console.log error

    requests = []
    requests.push (callback) -> #0 -> doctypes
        dataSystem.getDoctypes(callback)
    async.parallel requests, (error, results) ->
        if error
            console.log error
        else  
            
            #prepare request 'all' for each doctypes       
            setupRequestsAll = dataSystem.prepareDballRequests(results[0])

            #agregate callbacks
            if setupRequestsAll.length > 0
                async.parallel setupRequestsAll, (error, results) ->
                    if error
                        console.log error
                    # else 
                    #     console.log dataSystem.registeredPatterns      