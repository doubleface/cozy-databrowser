import Collection from "../models/menu";

export default Backbone.View.extend({
    el: "aside",
    collection: new Collection(),
    initialize() {
        this.collection.fetch()
        .then(this.render.bind(this))
        .catch(err => console.error(err, "error while fetching menu collection"));
    },
    itemTemplate: _.template('<li><a class="<%= sclass %>" href="#doctype/<%= key %>"><%= key %> (<%= value %>)</a></li>'),
    render() {
        var html = "<ul>";
        this.collection.forEach((model) => {
            var json = model.toJSON();
            json.sclass = json.key === this.selected ? "selected" : "";
            html+= this.itemTemplate(json);
        }, this);
        html+= "</ul>";
        this.$el.empty().html(html);
        return this;
    },
    select(doctype) {
        this.selected = doctype;
        this.$("a").removeClass("selected");
        this.$("a[href='#doctype/" + doctype + "']").addClass("selected");
    }
});
