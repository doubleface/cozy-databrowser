module.exports = {
    errorCount : 0
    setErrorManager : (obj)->        
        obj._getStack = () ->
            orig = Error.prepareStackTrace
            Error.prepareStackTrace = (_, stack) ->
                return stack;
            err = new Error
            Error.captureStackTrace(err, arguments.callee)
            stack = err.stack
            Error.prepareStackTrace = orig
            return stack[1]

        obj._getFunc = () ->
            return @_getStack().getFunctionName()

        obj._getLine = () ->
            return (@_getStack().getLineNumber() - 1)          

        obj._getFile = () ->
            return @_getStack().getFileName() 
        
        obj.logErrInConsole = (error, func, file, line) =>
            @errorCount++
            error = error || 'No information'
            func = func || 'Anonymous'
            file = file || 'Unknown' 
            line = line  || 'Not found'            
            myClass = obj.constructor.CLASS_NAME || 'Unknown'
            console.log '---------ERROR n°' + @errorCount + '--------'
            console.log '-- Running Class : ' + myClass
            console.log '-- Running Property : ' + func                       
            console.log '-- File :' + file
            console.log '-- Line : ' + line
            console.log '-- Error msg : '
            console.log '\t' + error
            console.log '----------------------'            
}
