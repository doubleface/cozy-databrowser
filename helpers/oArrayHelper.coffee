module.exports = 
    isInArray: (myString, myArray, caseSensitive = false) ->       
        for value in myArray
            if caseSensitive
                if myString is myArray[key]
                    return true
            else 
                if myString.toLowerCase() is value.toLowerCase()
                    return true
        return false