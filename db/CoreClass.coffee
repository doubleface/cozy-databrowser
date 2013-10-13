module.exports = class CoreClass    
    
    #----REQUIRE CLASS CONSTANT 
    _traceback = require 'traceback' 

    #----SETTED CLASS VAR
    _errCount = 0   
    
    #----METHODS 
    _logErrorInConsole: (error, allStack = false) ->

        _errCount++

        #get stack trace ([0] gives CoreClass, [1] gives extended class)
        trace = _traceback()
        if trace.length > 1 
            info = trace[1]

        #prepare default values       
        info = info || {}
        error = error || 'No information'
        myClass = @constructor.CLASS_NAME || null
        func = info.method || info.name || null
        file = info.path || 'File not found' 
        line = info.line  || 'Unknown'
        column = info.col || 'Unknown' 

        #log error in console
        console.log '---------ERROR n°' + _errCount + '--------'
        if myClass? then console.log '-- Running Class : "' + myClass + '"'
        if func? then console.log '-- Running Property : "' + func + '"'             
        console.log '-- File :"' + file + '"'
        console.log '-- Line : "' + line + '", Column : "' + column + '"'
        console.log '******* Error Msg ********'
        console.log error       
        

        #log all traces in stack one by one
        if allStack and trace.length > 2
            console.log '***** Stack description *****'
            for currentStack, index in trace
                if index > 1
                    errorMsg = ""
                    errorMsg += index + ') in ' + currentStack.path
                    errorMsg +=  ', line ' + currentStack.line
                    errorMsg += ', col ' + currentStack.col
                    console.log errorMsg

        console.log '---------------------------------'