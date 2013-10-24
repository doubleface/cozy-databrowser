module.exports = (initCallback) ->

    #----require dependencies
    dataSystem = require './lib/dataSystem'
    async = require 'async'

    #----prepare view functions
    viewFunctions =
        doctypes:
            getSums:
                map: (doc) ->
                    if doc.docType?
                        emit doc.docType, 1
                reduce: (keys, values, rereduce) ->
                    return sum(values)
            getAllByOrigin:
                map: (doc) ->
                    if doc.origin? and doc.docType?
                        emit [doc.origin, doc.docType], null
                reduce: (keys, values, rereduce) ->
                    return null
                    # registeredValues = {}
                    # uniqueValues = []
                    # values.forEach (val) ->
                    #     if val? and typeof(val) is 'object'
                    #         val.forEach (subVal) ->
                    #             if not registeredValues[subVal]
                    #                 registeredValues[subVal] = true
                    #                 uniqueValues.push subVal
                    #     else if typeof(val) is 'string'
                    #         if not registeredValues[val]
                    #             registeredValues[val] = true
                    #             uniqueValues.push val
                    # return uniqueValues
        metadoctype:
            getAllByRelated:
                map: (doc) ->
                    if doc.docType.toLowerCase() is 'metadoctype'
                        emit doc.related, doc
        application:
            getPermissions:
                map: (doc) ->
                    if doc.docType.toLowerCase() is 'application'
                        emit doc.name, doc.permissions

    #----prepare requests
    setupRequests = []

    #sums
    setupRequests.push (callback) ->
        pathSum = dataSystem.PATH.doctypes.getsums
        getSum = viewFunctions.doctypes.getSums
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

    #origins
    setupRequests.push (callback) ->
        pathOrigins = dataSystem.PATH.doctypes.getallbyorigin
        getOrigins = viewFunctions.doctypes.getAllByOrigin
        dataSystem.manageRequest pathOrigins, getOrigins, callback

    #----agregate callback
    async.parallel setupRequests, (error, results) ->
        console.log error if error?

        dataSystem.getDoctypes (error, results) ->

            if error?
                console.log error
                initCallback()

            else
                #prepare request 'all' for each doctypes
                setupRequestsAll = dataSystem.prepareDballRequests results

                #agregate callbacks
                if setupRequestsAll.length > 0
                    async.parallel setupRequestsAll, (error, results) ->
                        console.log error if error

                        initCallback()
                else
                    initCallback()