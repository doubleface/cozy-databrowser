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
        if (json.length === 0 || Object.keys(json[0]) == 0) return false;
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
        this.$el.html('<table></table>');
        var json = this.collection.toJSON();
        var columns = this.getCols(json);
        if (columns === false) {
            console.log("no column or no data at all");
            return this;
        }
        var config = {
            destroy: true,
            lengthChange: false,
            dom: '<"thead"Bfi>t',
            buttons: [
                'colvis'
            ],
            scrollX: "100%",
            scrollY: "calc(100vh - 7em)",
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
        cozysdk.queryView(doctype.toLowerCase(), "all", {})
        .then(data => {
            this.collection.reset(data.map(record => record.value));
        })
        .catch(err => {
            console.error(err, "error while fetching doctype");
        });
    }
});
