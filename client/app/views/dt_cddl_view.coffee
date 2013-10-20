View = require './../lib/view'

module.exports = class DtCddlView extends View

    tagName: 'li'
    className: 'dt-cddl-list-item'

    render: ->
        super
            name: @model.get("name")

    template: ->
        require './templates/dt_cddl_list_item'

