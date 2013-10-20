View = require './../lib/view'

module.exports = class DoctypeView extends View

    tagName: 'tr'
    className: 'doctype-list-item'

    render: ->
        super
            name: @model.get("name")
            metadoctype : @model.get("metadoctype")
            sum : @model.get("sum")
            app : @model.get("app")

    template: ->
        require './templates/doctype'

    events :
        'click .more-info' : 'showDescription'


    showDescription: (e) ->
        jqObj = $(e.currentTarget)

        #show description
        if (jqObj.hasClass('label-primary'))

            #prepare elements
            descWrapper = jqObj.parent().children('.md-desc-wrapper')
            newTd = $(document.createElement('td')).attr('colspan', '3')
            newTr = $(document.createElement('tr')).addClass('bg-gray')

            #tranform elements
            descWrapper.appendTo(newTd).show()
            newTd.appendTo(newTr)
            jqObj.closest("." + @className).after(newTr)

            #change button
            jqObj.removeClass('label-primary').addClass('label-danger').empty()
            jqObj.append(' Hide info <i class="icon-minus-sign"></i> ')

        #hide description
        else
            #prepare elements
            descWrapper = jqObj
                .closest("." + @className)
                .next("tr")
                .find('.md-desc-wrapper')
                .hide()

            #tranform elements
            jqObj.parent().append(descWrapper)
            jqObj.closest("." + @className).next("tr").remove()

            #change button
            jqObj.removeClass('label-danger').addClass('label-primary').empty()
            jqObj.append(' More info <i class="icon-plus-sign"></i> ')