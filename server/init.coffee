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

    #----prepare requests
    setupRequests = []

    #sums
    setupRequests.push (callback) ->
        pathSum = dataSystem.PATH.doctypes.getsums
        getSum = viewFunctions.doctypes.getSums
        dataSystem.manageRequest pathSum, getSum, callback

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
