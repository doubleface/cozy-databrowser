export default Backbone.Collection.extend({
    model: Backbone.Model,
    fetch() {
        return new Promise((resolve, reject) => {
            window.cozysdk.queryView("doctypes", "getsums", { group: true })
            .then(result => {
                this.reset(result);
                resolve(result);
            }).catch(err => {
                reject(err);
            });
        });
    }
});
