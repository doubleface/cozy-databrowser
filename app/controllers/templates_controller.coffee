load 'application'

#instanciate DataSystem

ds = require './db/ds'
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
        ds.getView(callback, ds.getPATH().metadoctype.getallbyrelated)
        #ds.applyModelRequest(callback, 'Metadoctype', 'getAllByRelated')
    requests.push (callback) -> #2 -> sums
        ds.getView(callback, ds.getPATH().common.getsumsbydoctype, {group : true})
        #ds.applyModelRequest(callback, 'All', 'getSumsByDoctype', {group : true})
    requests.push (callback) -> #3 -> permissions
        ds.getView(callback, ds.getPATH().application.getpermissions)

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
        if req.query.doctype? and req.query.range? and req.query.page? and req.query.nbperpage?

            #prepare params
            pageParams = {}            

            #skip deleted lines
            page = parseInt(req.query.page, 10)
            nbPerPage = parseInt(req.query.nbperpage, 10)
            newKey = req.query.doctype.join('_')
            if not ds.pageCountMatrix[newKey]?
                ds.pageCountMatrix[newKey] = []

                #nbDeleted = if req.query.deleted? then parseInt(req.query.deleted, 10) else 0                
                #pageParams['limit'] = nbPerPage
                #if page > 1 #and nbDeleted > 0
                    #pageParams['skip'] = (nbPerPage * (page - 1)) #- nbDeleted

            #add query for plain text search
            #if req.query.query? and req.query.query isnt ""
                #pageParams['query'] = req.query.query            
                
            if page is 1 
                requests = []
                requests.push (callback) -> #0 -> metadoctypes
                    ds.getView callback, ds.getPATH().metadoctype.getallbyrelated

                #one request per doctype
                reqCount = 0
                for dt in req.query.doctype
                    requests.push (callback) -> #1 to n -> requests
                        if pageParams['query']?
                            ds.getView callback, ds.getPATH().search + req.query.doctype[reqCount], pageParams
                        else
                            ds.getView callback, ds.getPATH().request + req.query.doctype[reqCount] + ds.getPATH().all, pageParams
                        reqCount++
                    

                async.parallel requests, (error, results) ->
                    jsonRes = []
                    if error
                        res.send('no_result', 'No result : Server error occurred while retrieving data.')
                        console.log error
                    else
                        idField = []
                        descField = []
                        for dt in req.query.doctype
                            for md in results[0]
                                if md.key? and md.value.identificationField? and md.key.toLowerCase() is dt.toLowerCase()                         
                                    idField[dt.toLowerCase()] = md.value.identificationField
                                    if md.value.fields[0]?
                                        descField[dt.toLowerCase()] = md.value.fields[0]
                        for result, index in results                        
                            if index > 0
                                for doc in result
                                    if doc.key? and doc.value? 
                                        doc.value['idField'] = idField[doc.value['docType'].toLowerCase()]
                                        doc.value['descField'] = descField[doc.value['docType'].toLowerCase()]                         
                                        jsonRes.push doc.value

                            #page count matrix knows how many results must be skipped for each doctypes                        
                        
                        ds.pageCountMatrix[newKey] = jsonRes

                        #prepare limit   
                        limit = if ds.pageCountMatrix[newKey].length? and ds.pageCountMatrix[newKey].length <= nbPerPage then ds.pageCountMatrix[newKey].length else nbPerPage
                        res.send(ds.pageCountMatrix[newKey].slice(0, limit))
            else if ds.pageCountMatrix[newKey] and ds.pageCountMatrix[newKey].length > nbPerPage
                #send json     
                limit = if ds.pageCountMatrix[newKey].length? and ds.pageCountMatrix[newKey].length <= nbPerPage*page then ds.pageCountMatrix[newKey].length else nbPerPage*page              
                res.send(ds.pageCountMatrix[newKey].slice(nbPerPage*(page-1), limit))
            else
                res.send([{ 'no_result' : 'No result for now.' }])
                            
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
