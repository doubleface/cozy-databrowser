function initDoctypeRequest() {
    return new Promise((resolve, reject) => {
        cozysdk.client.put("request/doctypes/getsums", {
            map: 'function(doc) { if (doc.docType != null) { emit(doc.docType, 1); } }',
            reduce: 'function(keys, values, rereduce){return sum(values)}'
        }, (err, res, body) => {
            if (err) reject(err);
            else resolve(body);
        });
    });
}

function getDoctypes() {
    return new Promise((resolve, reject) => {
        cozysdk.queryView("doctypes", "getsums", {group: true})
        .then(result => {
            resolve(result);
        })
        .catch(err => {
            initDoctypeRequest().then(() => {
                cozysdk.queryView("doctypes", "getsums", {group: true})
                then(result => {
                    resolve(result);
                })
                .catch(err => {
                    reject(err);
                });
            });
        });
    });
}

getDoctypes().then(result => {
    console.log(result, "result");
});
