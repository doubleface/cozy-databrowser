load 'application'

#instanciate DataSystem
DataSystem = require('./db/DataSystem')
ds = new DataSystem

#doctypes
action 'doctypes', ->
	ds.reqDoctypes (error, jsonRes) -> 
		if error 
			res.send(500, 'Server Error : ')
			return
		res.send(jsonRes) 
	
