function attrToString(attr) {
    if (!_(attr).isObject()) return attr;
    else {
        var result = '<ul>';
        for (var i in attr) {
            result+= `<li>${attrToString(attr[i])}</li>`;
        }
        result+= '</ul>';
        return result;
    }
}


export default Backbone.View.extend({
    el: "[role='contentinfo']",
    collection: new Backbone.Collection(),
    emptyTemplate: '<p>Nothing to display at the moment!</p>',
    initialize() {
        this.render();
        this.listenTo(this.collection, "reset", this.render);
    },
    render() {
        var html = "";
        if (this.collection.length === 0) {
            html = this.emptyTemplate;
        } else {
            html = '<table><thead><tr>';
            var model = this.collection.at(0).toJSON();
            for (var i in model) {
                html+= `<th>${i}</th>`;
            }
            html+= '</tr></thead><tbody>';
            this.collection.forEach(model => {
                html+= '<tr>';
                var json = model.toJSON();
                for (var i in json) {
                    html+= `<td>${attrToString(json[i])}</td>`;
                }
                html+= '</tr>';
            });
            html+= '</tbody></table>';
        }
        this.$el.empty().html(html);
        return this;
    },
    setDoctype(doctype){
        this.doctype = doctype;
        this.collection.fetch({
            reset: true,
            url: "search?page=1&nbperpage=100&range=all&doctypes[]=" + doctype
        });
    }
});
