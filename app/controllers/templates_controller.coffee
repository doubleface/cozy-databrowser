load 'application'

#instanciate DataSystem
DataSystem = require('./db/DataSystem')
ds = new DataSystem(Metadoctype)


#doctypes
action 'doctypes', ->

	#prepare callback
	callback = (error, jsonRes) -> 
		if error 
			res.send(500, 'Server error occurred while retrieving data')
		else
			res.send(jsonRes)

	#force json form to { "name" : value }
	jsonForm = "name"
	
	#get doctypes
	ds.reqDoctypes(callback, jsonForm, true)
	
