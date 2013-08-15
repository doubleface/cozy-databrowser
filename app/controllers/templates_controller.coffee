load 'application'

# action 'index', ->
#     render
#     	title: "Cozy Template"


action 'doctypes', ->
	
	#instanciate DataSystem
    DataSystem = require('./db/DataSystem')
    ds1 = new DataSystem
    ds1.reqDoctypes(res)
    #---------end noesis tests
