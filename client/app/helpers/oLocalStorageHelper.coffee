module.exports =
    keys:
        isMetaInfoVisible : 'ismetainfovisible'
        isListPresentation : 'istablepresentation'
        separator : '.'

    getBoolean: (key) ->
        value = localStorage.getItem key
        if value and JSON.parse value
            return true
        else
            return false
    setBoolean: (key, value) ->
        if typeof value is 'boolean'
            localStorage.setItem key, JSON.stringify value
        else
            localStorage.setItem key "false"