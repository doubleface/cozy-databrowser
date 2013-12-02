View = require './../lib/view'

module.exports = class ResultView extends View

    tagName: 'div'
    className: 'panel panel-default'
    templateModal: require('./templates/modal_confirm')
    events :
        'click .accordion-toggle' : 'blurIt'
        'mouseenter .label' : 'showFieldDescription'
        'mouseleave .label' : 'showFieldDescription'
        'click .remove-result' : 'confirmRemoveResult'
        'mouseover .remove-result' : 'convertButtonToDanger'
        'mouseout .remove-result' : 'convertButtonToClassic'

    convertButtonToDanger: (event) ->
        jqObj = $(event.currentTarget)
        jqObj.addClass 'btn-danger'

    convertButtonToClassic: (event) ->
        jqObj = $(event.currentTarget)
        jqObj.removeClass 'btn-danger'

    render: =>
        super
            results : @manageResultsForView()

    manageResultsForView: ->
        attr = @model.attributes
        count = @model.get('count')
        results = {}

        #case no results because error
        if attr.no_result?
            $('#all-result .accordion').empty()
            results['no_result'] = true
            results['no_result_msg'] = attr.no_result
            return results

        #case no results without error
        else if count is 0
            results['no_result'] = true
            results['no_result_msg'] = 'No results.'
            return results

        #prepare results
        else
            #no_result
            results['no_result'] = false

            #count
            results['count'] = count

            #heading
            results['heading'] =
                'doctype' : attr.displayName || attr.docType
                'field' : if attr.idField? then attr.idField else 'id'
                'data' : if attr.idField? then attr[attr.idField] else attr._id

            #fields
            @results = results
            @results['fields'] = @prepareResultFields attr


            return @results

    prepareResultFields: (attr) ->
        iCounter = 0
        fields = []
        settedField = ['idField', 'count', 'descField', 'displayName']
        simpleTypes = ['string', 'number', 'boolean']

        for fieldName, field of attr

            description = ""
            isNativField = ($.inArray fieldName, settedField) is -1
            if isNativField

                #prepare new fields
                fields[iCounter] =
                    'cdbFieldDescription' : ""
                    'cdbFieldName' : fieldName
                    'cdbFieldData' : ""
                    'cdbLabelClass' : "label-secondary"

                #add description and displayName
                if attr.descField? and attr.descField[fieldName]?
                    if attr.descField[fieldName].description?
                        description = attr.descField[fieldName].description
                        fields[iCounter]['cdbFieldDescription'] = description

                    descField = attr.descField[fieldName]
                    hasDisplayName = descField.displayName?

                    if hasDisplayName and descField.displayName isnt ""
                        displayName = descField.displayName
                        fields[iCounter]['cdbFieldName'] = displayName
                        if field is @results['heading']['field']
                            @results['heading']['field'] = displayName

                #add data according to typeof
                #field isn't an object  : display text
                typeOfField = typeof field
                isSimpleType = ($.inArray typeOfField, simpleTypes) isnt -1
                if isSimpleType
                    if fieldName is 'docType'
                        dataId = 'cdbFieldData'
                        fields[iCounter][dataId] = attr.displayName || field
                    else
                        fields[iCounter][dataId] = field

                #field is an object : display list
                else if field? and typeOfField is 'object'
                    fields[iCounter]['cdbFieldData'] = '<ul class="sober-list">'
                    for objName, obj of field
                        newLi = ''
                        typeOfObj = typeof obj
                        isSimpleObj = ($.inArray typeOfObj, simpleTypes) isnt -1

                        if isSimpleObj
                            newLi = '<li>' + objName + ' : '
                            newLi += '<i>' + obj + '</i></li>'
                            fields[iCounter]['cdbFieldData'] += newLi

                        else if obj? and typeof obj is 'object'
                            newLi = '<li>' + objName + ' : '
                            newLi += '<i>' + JSON.stringify(obj) + '</i></li>'
                            fields[iCounter]['cdbFieldData'] += newLi

                        else
                            newLi = '<li><i>empty</i></li>'
                            fields[iCounter]['cdbFieldData'] += newLi
                            fields[iCounter]['cdbLabelClass'] = 'label-danger'
                    fields[iCounter]['cdbFieldData'] += '</ul>'

                else
                    fields[iCounter]['cdbFieldData'] = '<i>empty</i>'
                    fields[iCounter]['cdbLabelClass'] = 'label-danger'

            iCounter++
        return fields



    template: ->
        require './templates/result_list'

    blurIt : (e) ->
        $(e.currentTarget).blur()

    showFieldDescription : (e) ->
        jqObj = $(e.currentTarget)
        if jqObj.attr("data-title") isnt ""
            if e.type is 'mouseenter'
                offsetLeft = jqObj.offset().left
                offsetTop = jqObj.offset().top
                accordionOffsetLeft = $('#basic-accordion.accordion')
                    .offset()
                    .left
                accordionOffsetTop = $('#basic-accordion.accordion')
                    .offset()
                    .top
                left = offsetLeft - accordionOffsetLeft - 5
                top = offsetTop - accordionOffsetTop - 7
                width = jqObj.width()
                $('.info-box .field-title').css {'padding-left' : width + 18}
                title = jqObj.attr("data-title")
                $('.info-box .field-description').empty().html title
                infoBoxCss =
                    'z-index' : '5'
                    'left' : left
                    'top' : top
                $('.info-box').css infoBoxCss
                $('.accordion .label').css {'z-index' : 'inherit'}
                jqObj.css({'z-index' : '10'})
                $('.info-box').stop().fadeTo(200, 1)
            else
                $('.info-box').stop().fadeTo(200, 0)

    confirmRemoveResult : (e) ->
        that = this
        e.preventDefault()
        data =
            title: t 'Confirmation required'
            body: t 'are you absolutely sure'
            confirm: t 'delete permanently'

        $("body").prepend @templateModal(data)
        $("#confirmation-dialog").modal()
        $("#confirmation-dialog").modal("show")
        $("#confirmation-dialog-confirm").unbind 'click'
        $("#confirmation-dialog-confirm").bind "click", ->
            that.removeResult()

    removeResult : ->

        #set id for the native backbone delete action
        @model.set('id', @model.get('_id'))

        #remove
        @model.destroy
            data : 'id=' + @model.get('id')
            success: =>
                @render
