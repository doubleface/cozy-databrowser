export default Backbone.Collection.extend({
    model: Backbone.Model,
    fetch() {
        return window.cozysdk.queryView("doctypes", "getsums", {group: true})
        .then(result => {
            console.log(result, "result to see");
            return result;
        }).catch(function(err){
            console.error(err, "there was an error in the request");
        });
    }
});
