load 'application'

#instanciate DataSystem
DataSystem = require('./db/DataSystem')
ds = new DataSystem(compound.models)
async = require('async')

#doctypes
action 'doctypes', ->

#prepare request
	requests = []
	requests.push (callback) -> #0 -> doctypes
		ds.reqDoctypes(callback)
	requests.push (callback) -> #1 -> metadoctypes
		ds.applyModelRequest(callback, 'Metadoctype', 'getAllByRelated')
	requests.push (callback) -> #2 -> sums
		ds.applyModelRequest(callback, 'All', 'getSumsByDoctype', {group : true})
	
	#agregate callback 
	async.parallel requests, (error, results) ->
		jsonRes = []
		if error
			res.send(500, 'Server error occurred while retrieving data')
			console.log error
		else
			for name in results[0]
				newObj = {}
				newObj['name'] = name
				
				for metadoctype in results[1]
					if metadoctype.related.toLowerCase() is name
						newObj['metadoctype'] = metadoctype
				
				for info in results[2]
					if info.docType.toLowerCase() is name
						newObj['sum'] = info.sum
				jsonRes.push(newObj)

			res.send(jsonRes)
