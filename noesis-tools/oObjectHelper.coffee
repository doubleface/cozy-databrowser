module.exports = 
	setKeysToLowerCase: (obj) ->
		newObj = {}
		for key, subElt of obj		
			if typeof subElt is 'object'
				newObj[key.toLowerCase()] = this.setKeysToLowerCase(subElt)
			else 
				newObj[key.toLowerCase()] = subElt
		return newObj
