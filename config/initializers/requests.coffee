module.exports = (compound) ->

    #----require dependencies
    dataSystem = require './../../db/dataSystem'
    async = require 'async'

    #----prepare view functions
    viewFunctions = 
        common : 
            getSumsByDoctype : 
                map : (doc) ->
                    if doc.docType?
                        emit doc.docType, 1
                reduce : (keys, values, rereduce) ->   
                    return sum(values)
        metadoctype : 
            getAllByRelated : 
                map : (doc) ->
                    if doc.docType.toLowerCase() is 'metadoctype'
                        emit doc.related, doc
        application : 
            getPermissions : 
                map : (doc) ->
                    if doc.docType.toLowerCase() is 'application'
                        emit doc.name, doc.permissions

    #----prepare requests
    setupRequests = [] 

    #sums
    setupRequests.push (callback) -> 
        pathSum = dataSystem.PATH.common.getsumsbydoctype
        getSum = viewFunctions.common.getSumsByDoctype
        dataSystem.manageRequest pathSum, getSum, callback

    #all
    setupRequests.push (callback) -> 
        pathAll = dataSystem.PATH.metadoctype.getallbyrelated
        getAll = viewFunctions.metadoctype.getAllByRelated
        dataSystem.manageRequest pathAll, getAll, callback

    #permissions
    setupRequests.push (callback) -> 
        pathPermissions = dataSystem.PATH.application.getpermissions
        getPermissions = viewFunctions.application.getPermissions
        dataSystem.manageRequest pathPermissions, getPermissions, callback

    #----agregate callback 
    async.parallel setupRequests, (error, results) ->
        if error
            console.log error

    requests = []
    requests.push (callback) -> #0 -> doctypes
        dataSystem.getDoctypes callback

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