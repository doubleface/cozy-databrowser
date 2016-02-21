function attrToString(attr) {
    if (!_(attr).isObject()) return attr;
    else {
        let result = '<ul>';
        for (let i in attr) {
            result+= `<li>${attrToString(attr[i])}</li>`;
        }
        result+= '</ul>';
        return result;
    }
}

export default Backbone.View.extend({
    el: "[role='contentinfo']",
    collection: new Backbone.Collection(),
    initialize() {
        this.listenTo(this.collection, "reset", this.render);
    },
    getCols(json) {
        var result = [];
        if (json.length === 0) return result;
        for (var i in json[0]) {
            result.push({
                title: i,
                data: i,
                defaultContent: ""
            });
        }
        return result;
    },
    render() {
        this.$el.empty().html('<table></table>');
        var json = this.collection.toJSON();
        var config = {
            destroy: true,
            lengthChange: false,
            dom: "fit",
            scrollY: "calc(100vh - 6em)",
            responsive: true,
            deferRender: true,
            scroller: true,
            data: json,
            columns: this.getCols(json)
        };
        this.$("table").DataTable(config);
        return this;
    },
    setDoctype(doctype){
        this.doctype = doctype;
        this.collection.fetch({
            reset: true,
            url: "search?range=all&doctypes[]=" + doctype
        });
    }
});
