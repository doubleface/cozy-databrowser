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
        this.$el.html('<table></table>');
        this.listenTo(this.collection, "reset", this.render);
    },
    getCols(json) {
        if (json.length === 0) return [];
        return Object.keys(json[0]).map(function(col){
            return {data: col};
        });
    },
    render() {
        var json = this.collection.toJSON();
        var config = {
            destroy: true,
            data: json,
            columns: this.getCols(json)
        };
        console.log(config)
        //this.$("table").DataTable(config);
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
