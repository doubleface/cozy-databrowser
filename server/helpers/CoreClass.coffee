#********************************************************
#******************* CLASS CoreClass ********************
#********************************************************
#@description : used as an abstract class giving usefull common methods
#@tip :         all attributes and methods begin with _

module.exports = class CoreClass

    #------------------ CONSTRUCTOR CONSTANTS ----------------

    #------------------ PROTOTYPE CONSTANTS ----------------
    #required dependencies

    #setted class var
    _ERROR_COUNT = 0

    #----------------- OBJECT PARAMETERS ---------------

    #------------------ OBJECT METHODS -----------------
    _logErrorInConsole: (error, allStack = false) ->

        _ERROR_COUNT++

        #get stack trace ([0] gives CoreClass, [1] gives extended class)
        if Error.prepareStackTrace then delete Error.prepareStackTrace
        trace = require('traceback')()
        if trace.length > 1
            info = trace[1]

        #prepare default values
        info = info || {}
        errorMsg =  error || 'No information'

        myClass = @constructor.CLASS_NAME || null
        func = info.method || info.name || null
        file = info.path || 'File not found'
        line = info.line  || 'Unknown'
        column = info.col || 'Unknown'

        #log error in console
        console.log '---------ERROR n°' + _ERROR_COUNT + '--------'
        if myClass? then console.log '-- Running Class : "' + myClass + '"'
        if func? then console.log '-- Running Property : "' + func + '"'
        console.log '-- File :"' + file + '"'
        console.log '-- Line : "' + line + '", Column : "' + column + '"'
        console.log '******* Error Msg ********'
        console.log errorMsg


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