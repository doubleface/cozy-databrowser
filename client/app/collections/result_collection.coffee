module.exports = class ResultCollection extends Backbone.Collection

    model: require '../models/result_model'

    page : 1

    nbPerPage : 10

    url: ->

        #define query
        query = ''
        paramNbPerPage = ''
        if @nbPerPage > 0
            paramNbPerPage = 'nbperpage=' + @nbPerPage

        paramPage = if @page > 0 then 'page=' + @page else ''

        if paramPage isnt '' and paramNbPerPage isnt ''
            query = '?' + paramPage + '&' + paramNbPerPage

        #return search url with query
        return 'search' + query


    fields: ->
        out = {}
        @each (model) ->
            for field in Object.keys model.toJSON()
                continue if field in ["count", "descField", "displayName", "idField"]
                desc = model.get('descField')?[field]
                out[field] ?=
                    cdbFieldDescription: desc?.description or ''
                    cdbFieldName: desc?.displayName or field

        return out