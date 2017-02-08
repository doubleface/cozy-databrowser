export default Backbone.Collection.extend({
    model: Backbone.Model,
    fetch() {
        return new Promise((resolve, reject) => {
            window.cozy.fetchJSON("POST", "/request/doctypes/getsums/", {group: true})
            .then(result => {
                this.reset(this.mergeDoubles(result));
                resolve(result);
            }).catch(err => {
                reject(err);
            });
        });
    },
    mergeDoubles(collection) {
        let map = collection.reduce((memo, item) => {
            let label = item.key.toLowerCase();
            if (memo[label]) memo[label]+= item.value;
            else memo[label] = item.value;
            return memo;
        }, {});
        return Object.keys(map).map(key => {
            return { key, value: map[key]};
        });
    }
});
