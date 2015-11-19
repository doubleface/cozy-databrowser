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
    emptyTemplate: '<p>Nothing to display at the moment!</p>',
    initialize() {
        this.render();
        this.listenTo(this.collection, "reset", this.render);
    },
    serializeModel(model) {
        const result = {};
        const json = model.toJSON();
        for (let i in json) {
            if (_(json[i]).isObject()) continue
            if (i === "password") result[i] = "***";
            if (i === "_id") continue;
            result[i] = json[i];
        }

        return result;
    },
    render() {
        let html = "";
        if (this.collection.length === 0) {
            html = this.emptyTemplate;
        } else {
            html = '<table><thead><tr>';
            this.columnList = this.serializeModel(this.collection.at(0));
            for (let i in this.columnList) {
                html+= `<th>${i}</th>`;
            }
            html+= '</tr></thead><tbody>';
            this.collection.forEach(model => {
                html+= '<tr>';
                const json = this.serializeModel(model);
                for (let i in this.columnList) {
                    if (json[i] !== undefined) {
                        html+= `<td>${attrToString(json[i])}</td>`;
                    } else {
                        html+= `<td>NA</td>`;
                    }
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
