module.exports = {
	convertIndexesToLowerCase: (obj) ->
		newObj = {}
		for index, subElt of obj		
			if typeof subElt is 'object'
				newObj[index.toLowerCase()] = this.convertIndexesToLowerCase(subElt)
			else 
				newObj[index.toLowerCase()] = subElt
		return newObj
}
