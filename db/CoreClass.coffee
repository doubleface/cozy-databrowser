module.exports = class CoreClass
    constructor: ->
        @_errCount = 0

    _getErrStack: ->
        orig = Error.prepareStackTrace
        Error.prepareStackTrace = (_, stack) ->
            return stack;
        err = new Error
        Error.captureStackTrace(err, arguments.callee)
        stack = err.stack
        Error.prepareStackTrace = orig
        return stack[1]

    _getErrFunc: ->
        return @_getErrStack().getFunctionName()

    _getErrLine: ->
        return (@_getErrStack().getLineNumber() - 1)          

    _getErrFile: ->
        return @_getErrStack().getFileName() 
        
    _logErrInConsole: (error, func, file, line) =>
            @errorCount++
            error = error || 'No information'
            func = func || 'Anonymous'
            file = file || 'Unknown' 
            line = line  || 'Not found'            
            myClass = @constructor.CLASS_NAME || 'Unknown'
            console.log '---------ERROR n°' + @_errCount + '--------'
            console.log '-- Running Class : ' + myClass
            console.log '-- Running Property : ' + func                       
            console.log '-- File :' + file
            console.log '-- Line : ' + line
            console.log '-- Error msg : '
            console.log '\t' + error
            console.log '----------------------'            
