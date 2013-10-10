#------------------ BEGIN REQUIRE ------------------
#instanciate Databrowser classes (datasystem, searchengine)
dataSystem = require './db/dataSystem'
searchEngine = require('./db/searchEngine')(dataSystem)

#instanciate Noesis helpers
oObjectHelper = require './noesis-tools/oObjectHelper'

#add Cozy helpers
async = require 'async'
#-------------------- END REQUIRE ------------------


#------------------ BEGIN ACTIONS ------------------
#doctypes
action 'doctypes', ->

    #index several id for test
    #dataSystem.indexId "39bade34f76d6b32234c3974c8004ca9", ["description"]
    #dataSystem.indexId "39bade34f76d6b32234c3974c80059f0", ["description"]

    #prepare request
    requests = []
    requests.push (callback) -> #0 -> doctypes
        dataSystem.getDoctypes(callback)
    requests.push (callback) -> #1 -> metadoctypes
        dataSystem.getView(callback, dataSystem.getPATH().metadoctype.getallbyrelated)
        #dataSystem.applyModelRequest(callback, 'Metadoctype', 'getAllByRelated')
    requests.push (callback) -> #2 -> sums
        dataSystem.getView(callback, dataSystem.getPATH().common.getsumsbydoctype, {group : true})
        #dataSystem.applyModelRequest(callback, 'All', 'getSumsByDoctype', {group : true})
    requests.push (callback) -> #3 -> permissions
        dataSystem.getView(callback, dataSystem.getPATH().application.getpermissions)

    #agregate callback
    async.parallel requests, (error, results) ->
        jsonRes = []
        if error
            res.send(500, 'Server error occurred while retrieving data')
            console.log error
        else
            for name in results[0]

                #prepare json object
                newObj = {
                    'name' : name
                    'sum' : 0
                    'app' : []
                }

                #add metadoctypes
                for metadoctype in results[1]
                    if metadoctype.key? && metadoctype.key.toLowerCase() is name.toLowerCase()
                        newObj['metadoctype'] = metadoctype.value

                #add sums
                for info in results[2]
                    if info.key? and info.key.toLowerCase() is name.toLowerCase()
                        newObj['sum'] = info.value

                #add permissions
                for permissions in results[3]
                    permissions = oObjectHelper.convertIndexesToLowerCase permissions
                    if permissions.value? and permissions.value[name]?
                        newObj['app'].push(permissions.key)
                jsonRes.push(newObj)

            #send json
            res.send(jsonRes)

#search
action 'search', ->
    if req.query?

        tabDoctypes = req.query.doctype || null

        if tabDoctypes? and req.query.range? and req.query.page? and req.query.nbperpage?

            #----PEPARE PARAMS
            pageParams = {}

            #page params
            page = parseInt(req.query.page, 10)
            nbPerPage = parseInt(req.query.nbperpage, 10)

            #skip & limit + deleted lines params
            nbDeleted = if req.query.deleted? then parseInt(req.query.deleted, 10) else 0
            pageParams['limit'] = nbPerPage
            if page > 1
                pageParams['skip'] = (nbPerPage * (page - 1)) - nbDeleted

            #query param
            if req.query.query? and req.query.query isnt ""
                pageParams['query'] = req.query.query


            #prepare multiple page process
            # newKey = req.query.doctype.join('_')
            # if not dataSystem.pageCountMatrix[newKey]?
            #     dataSystem.pageCountMatrix[newKey] = []


            #----VERIFY DOCTYPE 'ALL' REQUESTS
            tabUnregistered = []
            for dt in tabDoctypes
                if not dataSystem.registeredPatterns[dt.toLowerCase()]?
                    tabUnregistered.push dt.toLowerCase()

            if tabUnregistered.length > 0

                #verify if doctype exist
                requests = []
                requests.push (callback) -> #0 -> doctypes
                    dataSystem.getDoctypes(callback)
                async.parallel requests, (error, results) ->
                    if error
                        res.send {'no_result' : 'Error : Server error occurred while retrieving data.'}
                        console.log error
                    else

                        #compare submitted doctype and existing doctype for more security
                        bError = false
                        tabRegisteredDoctypes = results[0]
                        for dtUnreg in tabUnregistered
                            bUnknowDoctype = true
                            for dtReg, index in tabRegisteredDoctypes
                                if not bError
                                    if dtUnreg.toLowerCase() is dtReg.toLowerCase()
                                        bUnknowDoctype = false
                                    if bUnknowDoctype and index is tabRegisteredDoctypes.length-1
                                        res.send {'no_result': 'Error : You try to access to an unknown doctype.'}
                                        bError = true


                        if not bError
                            #prepare request 'all' for each doctypes
                            setupRequestsAll = dataSystem.prepareDballRequests(tabUnregistered)

                            #agregate callbacks
                            if setupRequestsAll.length > 0
                                async.parallel setupRequestsAll, (error, results) ->
                                    if error
                                        console.log error
                                        res.send {'no_result' : 'Error : Server error occurred while retrieving data.'}
                                    else
                                        searchEngine.doBasicSearch(res, tabDoctypes, pageParams)
                            else
                                res.send {'no_result' : 'Error : Server error occurred while retrieving data.'}

            else
                searchEngine.doBasicSearch(res, tabDoctypes, pageParams)


        else
            res.send {'no_result' : 'Error : Unknown research parameters'}

#delete
action 'delete', ->
    if req.params.id?
        requests = []
        requests.push (callback) -> #0 -> delete
                dataSystem.deleteById callback, req.params.id
        async.parallel requests, (error, results) ->
            if error
                res.send('error', 'Server error occurred while trying to remove data.')
                console.log error
            else
                res.send req.query.id
#-------------------- END ACTIONS ------------------