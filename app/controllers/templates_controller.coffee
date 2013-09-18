load 'application'

#instanciate DataSystem
DataSystem = require './db/DataSystem'
ds = new DataSystem compound.models
oObjectHelper = require './noesis-tools/oObjectHelper'
async = require 'async'

#doctypes
action 'doctypes', ->

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
		if req.query.range is 'all' and req.query.docType?

			#prepare params
			pageParams = {}
			if parseInt(req.query.page, 10)? and parseInt(req.query.nbperpage, 10)?
				nbDeleted = if req.query.deleted? then parseInt(req.query.deleted, 10) else 0
				page = parseInt(req.query.page, 10)
				nbPerPage = parseInt(req.query.nbperpage, 10)
				pageParams['limit'] = nbPerPage
				if page > 1
					pageParams['skip'] = (nbPerPage * (page - 1)) - nbDeleted

			requests = []
			requests.push (callback) -> #0 -> all
				ds.getView callback, DataSystem::PATH.request + req.query.docType + DataSystem::PATH.all, pageParams
			requests.push (callback) -> #1 -> metadoctypes
				ds.getView callback, DataSystem::PATH.metadoctype.getallbyrelated	

			async.parallel requests, (error, results) ->
				jsonRes = []
				if error
					res.send('no_result', 'No result : Server error occurred while retrieving data.')
					console.log error
				else
					idField = null
					descField = null
					for md in results[1]
						if md.key? and md.value.identificationField? and md.key.toLowerCase() is req.query.docType.toLowerCase()							
							idField = md.value.identificationField
							if md.value.fields[0]?
								descField = md.value.fields[0]
					for doc in results[0]
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
	if params.id? 
		requests = []
		requests.push (callback) -> #0 -> delete
				ds.deleteById callback, params.id
		async.parallel requests, (error, results) ->
				jsonRes = []
				if error
					res.send('error', 'Server error occurred while trying to remove data.')
					console.log error
				else
					res.send(results[0])


	
