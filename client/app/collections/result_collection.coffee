module.exports = class ResultCollection extends Backbone.Collection

    model: require '../models/result_model'

    page : 1

    nbPerPage : 10

    url: ->

        #define query
        query = ''
        paramNbPerPage = if @nbPerPage > 0 then 'nbperpage=' + @nbPerPage else ''
        paramPage = if @page > 0 then 'page=' + @page else ''
        if paramPage isnt '' and paramNbPerPage isnt ''
            query = '?' + paramPage + '&' + paramNbPerPage

        #return search url with query
        return 'search' + query

