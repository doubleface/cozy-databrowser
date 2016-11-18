cozysdk.defineRequest("doctypes", "getsums", {
    map(doc) {
        if (doc.docType != null) {
            emit("coucou", 1);
        }
    },
    reduce(keys, values, rereduce) {
        return sum(values);
    }
}, () => {
    cozysdk.queryView("doctypes", "getsums", {group: true}, (err, res) => {
        console.log(err, "err");
        console.log(res, "res");
    });
});
