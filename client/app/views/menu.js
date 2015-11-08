import Collection from "models/menu";

export default Backbone.View.extend({
    attributes: {
        id: "menu"
    },
    collection: new Collection(),
    initialize() {
        this.collection.fetch().done(this.render.bind(this));
    },
    itemTemplate: _.template('<li><%= doctype %> (<%= sum %>)</li>'),
    render() {
        var html = "<ul>";
        this.collection.forEach((model) => {
            html+= this.itemTemplate(model.toJSON());
        }, this);
        html+= "</ul>";
        this.$el.empty().html(html);
        return this;
    }
});
