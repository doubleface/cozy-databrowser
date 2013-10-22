#instanciate DataBrowser classes (DataSystem, SearchEngine)
dataSystem = require '../lib/dataSystem'
searchEngine = require('../lib/searchEngine')(dataSystem)

#add NPM helpers
async = require 'async'

#doctypes
module.exports.doctypes = (req, res) ->

    #------INDEX SEVERAL ID FOR TEST
    # path = dataSystem.PATH.request + 'alarm' + dataSystem.PATH.all
    # dataSystem.postData path, (err, body) ->
    #     if not err?
    #         for alarm in body
    #             console.log alarm.id
    #             dataSystem.indexId alarm.id, ['description', 'trigg']

    dataSystem.getDoctypesByApplication (error, doctypes) ->
        console.log error
        console.log doctypes

    dataSystem.getDoctypesByOrigin (error, doctypes) ->
        console.log error
        console.log doctypes

    #------PREPARE REQUESTS
    requests = []
    requests.push (callback) -> #0 -> get the doctypes list
        dataSystem.getDoctypes callback

    requests.push (callback) -> #1 -> get all the metadoctypes
        targetUrl = dataSystem.PATH.metadoctype.getallbyrelated
        dataSystem.getView targetUrl, callback

    requests.push (callback) -> #2 -> get the numbers of docs per doctype
        targetUrl = dataSystem.PATH.common.getsumsbydoctype
        dataSystem.getView targetUrl, callback, group: true

    requests.push (callback) -> #3 -> get the permissions
        targetUrl = dataSystem.PATH.application.getpermissions
        dataSystem.getView targetUrl, callback


    #------AGREGATE CALLBACKS
    async.parallel requests, (error, results) ->
        if error?
            res.send 500, @dataSystem.ERR_MSG.retrieveData

        else
            doctypeList = []
            doctypes = results[0]
            metadoctypesByDoctype = results[1]
            sumsByDoctype = results[2]
            permissionsByDoctype = results[3]

            for doctypeName in doctypes

                doctypeName = doctypeName.toLowerCase()

                # initialize json object
                agregate =
                    name: doctypeName
                    sum: 0
                    app: []

                #add metadoctypes
                for metadoctype in metadoctypesByDoctype
                    if metadoctype.key?.toLowerCase() is doctypeName
                        agregate['metadoctype'] = metadoctype.value

                #add sums
                for sum in sumsByDoctype
                    if sum.key?.toLowerCase() is doctypeName
                        agregate['sum'] = sum.value

                #add permissions
                #console.log permissionsByDoctype
                for permissions in permissionsByDoctype
                    #ensure permissions keys are in lowercase
                    permissionKeys = Object.keys permissions.value
                    permissionKeys = permissionKeys.map (single) ->
                        return single.toLowerCase()

                    if doctypeName in permissionKeys
                        agregate['app'].push permissions.key

                doctypeList.push agregate

            #send json
            res.send doctypeList
#search
module.exports.search = (req, res) ->
    if req.query?

        doctypes = req.query.doctype || null
        range = req.query.range || null
        deleted = req.query.deleted || null

        if doctypes? and range? and req.query.page? and req.query.nbperpage?

            #----PEPARE PARAMS
            params = {}

            #page params
            page = parseInt(req.query.page, 10)
            nbPerPage = parseInt(req.query.nbperpage, 10)

            #skip & limit + deleted lines params
            nbDeleted = if deleted? then parseInt(deleted, 10) else 0
            params['limit'] = nbPerPage
            if page > 1
                params['skip'] = (nbPerPage * (page - 1)) - nbDeleted

            #query param
            if req.query.query? and req.query.query isnt ""
                params['query'] = req.query.query

            #----VERIFY DOCTYPE 'ALL' REQUESTS
            unregistered = []
            for dt in doctypes
                if not dataSystem.registeredPatterns[dt.toLowerCase()]?
                    unregistered.push dt.toLowerCase()

            if unregistered.length > 0

                #verify if doctype exist
                dataSystem.areValidDoctypes unregistered, (isValid, errorMsg) ->
                    if not isValid or errorMsg?
                        res.send {'no_result' : errorMsg }
                    else
                         #prepare request 'all' for each doctypes
                        setDbAll = dataSystem.prepareDballRequests unregistered

                        #agregate callbacks
                        errorRetrieve = dataSystem.ERR_MSG.retrieveData
                        if setDbAll.length > 0
                            async.parallel setDbAll, (error, results) ->
                                if error?
                                    console.log error
                                    res.send {'no_result' : errorRetrieve}
                                else
                                    searchEngine.search res, doctypes, params
                        else
                            res.send {'no_result' : errorRetrieve}

            else
                searchEngine.search res, doctypes, params


        else
            res.send {'no_result' : dataSystem.ERR_MSG.unknownParameters}

#delete
module.exports.delete = (req, res) ->
    if req.params.id?
        dataSystem.deleteById req.params.id, (error) ->
            if error?
                res.send 500, dataSystem.ERR_MSG.removeData
            else
                res.send 204, req.query.id
    else
        res.send 400, dataSystem.ERR_MSG.unknownId
