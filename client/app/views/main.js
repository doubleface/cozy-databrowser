export default Backbone.View.extend({
    attributes: {
        id: "main"
    },
    collection: new Backbone.Collection(),
    emptyTemplate: '<p>Nothing to display at the moment!</p>',
    initialize() {
        this.render();
    },
    render() {
        var html = "";
        if (this.collection.length === 0) {
            html = this.emptyTemplate;
        }
        this.$el.empty().html(html);
        return this;
    }
});
