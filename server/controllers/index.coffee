#instanciate DataBrowser classes (DataSystem, SearchEngine)
dataSystem = require '../lib/dataSystem'
searchEngine = require('../lib/searchEngine')(dataSystem)

#add NPM helpers
async = require 'async'

module.exports.initvalues = (req, res, next) ->
    async.parallel [
        (cb) -> dataSystem.getLocale cb
    ], (err, results) ->
        return next err if err
        locale = results

        imports = """
            window.locale = #{JSON.stringify(locale)}
        """

        res.type 'application/javascript'
        res.send imports


module.exports.doctype_delete_all = (req, res) ->
    if req.query and req.query.doctype?
        doctypeName = req.query.doctype.toLowerCase()
        dataSystem.deleteAllByDoctype doctypeName, (error, body) ->
            if error
                res.send(error)
            else
                res.send(true)
    else
        res.send 'Doctype needed'


module.exports.doctype_meta_infos = (req, res) ->
    if req.query and req.query.doctype?
        doctypeName = req.query.doctype
        requests = []
        requests.push (callback) -> #0 -> get all the metadoctypes
            targetUrl = dataSystem.PATH.metadoctype.getallbyrelated
            dataSystem.getView targetUrl, callback

        requests.push (callback) -> #1 -> get the permissions
            targetUrl = dataSystem.PATH.application.getpermissions
            dataSystem.getView targetUrl, callback

        async.parallel requests, (error, results) ->
            if error?
                res.send 500, dataSystem.ERR_MSG.retrieveData
            else
                metadoctypesByDoctype = results[0]
                permissionsByDoctype = results[1]
                metaInfos =
                    name : doctypeName
                    applications : []
                    displayName : ''

                for metadoctype in metadoctypesByDoctype
                    key = metadoctype.key.toLowerCase()
                    value = metadoctype.value
                    if key is doctypeName.toLowerCase()
                        metaInfos['metadoctype'] = value
                        metaInfos['displayName'] = value.displayName || ''

                #add permissions
                for permissions in permissionsByDoctype

                    #ensure permissions keys are in lowercase
                    permissionKeys = Object.keys permissions.value
                    permissionKeys = permissionKeys.map (single) ->
                        return single.toLowerCase()

                    if doctypeName in permissionKeys
                        metaInfos['applications'].push permissions.key

                res.send metaInfos
    else
        res.send 'nothing'

#doctypes
module.exports.doctypes = (req, res) ->

      #------PREPARE REQUESTS
    menuRequests = []
    menuRequests.push (callback) -> #0 -> all
        dataSystem.getDoctypes callback

    menuRequests.push (callback) -> #1 -> sums
        targetUrl = dataSystem.PATH.doctypes.getsums
        dataSystem.getView targetUrl, callback, group: true

    menuRequests.push (callback) -> #2 -> metadoctypes
        targetUrl = dataSystem.PATH.metadoctype.getallbyrelated
        dataSystem.getView targetUrl, callback

    async.parallel menuRequests, (error, results) ->
        if error?
            res.send 500, dataSystem.ERR_MSG.retrieveData
        else
            doctypes = []
            sums = {}
            displayNames = {}

            #compact sums
            for sum in results[1]
                sums[sum.key.toLowerCase()] = sum.value
            #compact displayNames
            for metadoctype in results[2]
                if metadoctype.value.displayName?
                    key = metadoctype.key.toLowerCase()
                    displayName = metadoctype.value.displayName
                    displayNames[key] = displayName


            #prepare categories
            if results[0].length? and results[0].length > 0
                doctypes.push
                    name : 'all'
                    value : results[0]

            #add sums
            for category, index in doctypes
                for data, index in category.value
                    if (typeof data) is 'string'
                        dataLow = data.toLowerCase()
                        category.value[index] =
                            doctype: data
                            sum: sums[dataLow] || 0
                            displayName: displayNames[dataLow] || ""
                    else
                        for subdata, index in data.value
                            subdataLow = subdata.toLowerCase()
                            data.value[index] =
                                doctype : subdata
                                sum : sums[subdataLow] || 0
                                displayName: displayNames[subdataLow] || ""

            res.send doctypes

#search
module.exports.search = (req, res) ->
    if req.query?

        doctypes = req.query.doctypes || null
        range = req.query.range || null
        deleted = req.query.deleted || null

        if doctypes? and range?

            #----PEPARE PARAMS
            params = {}

            if req.query.page? and req.query.nbperpage?
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
