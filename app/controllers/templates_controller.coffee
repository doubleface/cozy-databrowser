load 'application'

#instanciate DataSystem
DataSystem = require './db/DataSystem'
ds = new DataSystem compound.models
oObjectHelper = require './noesis-tools/oObjectHelper'
async = require 'async'

#doctypes
action 'doctypes', ->

    #index several id for test
    #ds.indexId "39bade34f76d6b32234c3974c8004ca9", ["description"]
    #ds.indexId "39bade34f76d6b32234c3974c80059f0", ["description"]

    #prepare request
    requests = []
    requests.push (callback) -> #0 -> doctypes
        ds.getDoctypes(callback)
    requests.push (callback) -> #1 -> metadoctypes
        ds.getView(callback, DataSystem::PATH.metadoctype.getallbyrelated)
        #ds.applyModelRequest(callback, 'Metadoctype', 'getAllByRelated')
    requests.push (callback) -> #2 -> sums
        ds.getView(callback, DataSystem::PATH.common.getsumsbydoctype, {group : true})
        #ds.applyModelRequest(callback, 'All', 'getSumsByDoctype', {group : true})
    requests.push (callback) -> #3 -> permissions
        ds.getView(callback, DataSystem::PATH.application.getpermissions)

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
    if req.query? and req.query.range?
        if req.query.docType?

            #prepare params
            pageParams = {}            

            #skip deleted lines
            if parseInt(req.query.page, 10)? and parseInt(req.query.nbperpage, 10)?

                #nbDeleted = if req.query.deleted? then parseInt(req.query.deleted, 10) else 0
                page = parseInt(req.query.page, 10)

                #page count matrix knows how many results must be skipped for each doctypes
                if page is 1 and req.query.docType.length > 1
                    newKey = req.query.docType.join('_')
                    console.log newKey
                    ds.pageCountMatrix[newKey] = []
                console.log(ds.pageCountMatrix)

                nbPerPage = parseInt(req.query.nbperpage, 10)
                pageParams['limit'] = nbPerPage
                if page > 1 #and nbDeleted > 0
                    pageParams['skip'] = (nbPerPage * (page - 1)) #- nbDeleted

            #add query for plain text search
            if req.query.query? and req.query.query isnt ""
                pageParams['query'] = req.query.query

            requests = []
            requests.push (callback) -> #0 -> metadoctypes
                ds.getView callback, DataSystem::PATH.metadoctype.getallbyrelated


            reqCount = 0
            for dt in req.query.docType
                requests.push (callback) -> #1 to n -> requests
                    if pageParams['query']?
                        ds.getView callback, DataSystem::PATH.search + req.query.docType[reqCount], pageParams
                    else
                        ds.getView callback, DataSystem::PATH.request + req.query.docType[reqCount] + DataSystem::PATH.all, pageParams
                    reqCount++
                

            async.parallel requests, (error, results) ->
                jsonRes = []
                if error
                    res.send('no_result', 'No result : Server error occurred while retrieving data.')
                    console.log error
                else
                    idField = null
                    descField = null
                    # for md in results[0]
                    #   if md.key? and md.value.identificationField? and md.key.toLowerCase() is req.query.docType[0].toLowerCase()                         
                    #       idField = md.value.identificationField
                    #       if md.value.fields[0]?
                    #           descField = md.value.fields[0]
                    for result, index in results                        
                        if index > 0
                            for doc in result
                                # console.log doc
                                # console.log '-----------'
                                if doc.key? and doc.value? 
                                    doc.value['idField'] = idField
                                    doc.value['descField'] = descField                          
                                    jsonRes.push doc.value                      
                    
                    #send json                  
                    res.send(jsonRes)
    else
        res.send([{ 'no_result' : 'No result for now.' }])

#delete
action 'delete', ->
    if req.params.id?
        requests = []
        requests.push (callback) -> #0 -> delete
                ds.deleteById callback, req.params.id
        async.parallel requests, (error, results) ->
                jsonRes = []
                if error
                    res.send('error', 'Server error occurred while trying to remove data.')
                    console.log error
                else
                    res.send(results[0])
        res.send req.query.id
