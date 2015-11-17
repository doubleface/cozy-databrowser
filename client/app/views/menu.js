import Collection from "models/menu";

export default Backbone.View.extend({
    el: "aside",
    collection: new Collection(),
    initialize() {
        this.collection.fetch().done(this.render.bind(this));
    },
    itemTemplate: _.template('<li><a class="<%= sclass %>" href="#doctype/<%= doctype %>"><%= doctype %> (<%= sum %>)</a></li>'),
    render() {
        var html = "<ul>";
        this.collection.forEach((model) => {
            var json = model.toJSON();
            json.sclass = json.doctype === this.selected ? "selected" : "";
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
