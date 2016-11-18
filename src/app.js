cozysdk.defineRequest("doctypes", "getsums", 'function(doc) { if (doc.docType != null) { emit(doc.docType, 1); } }', () => {
    cozysdk.queryView("doctypes", "getsums", {group: true}, (err, res) => {
        console.log(err, "err");
        console.log(res, "res");
    });
});
