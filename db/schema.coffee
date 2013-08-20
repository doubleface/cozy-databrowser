Metadoctype = define 'Metadoctype', ->
	property 'docType', String, default: null
	property 'displayName', String, default: null
	property 'identificationField', String, default: null
	property 'fields', String, default: null
	property 'related', String, default: null

All = define 'All', ->
	property 'docType', String, default : null
	property 'sum', Object, default: null