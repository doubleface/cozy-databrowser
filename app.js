cozysdk.queryView("doctypes", "getsums", {group: true}, (err, res) => {
    console.log(err, "err");
    console.log(res, "res");
});
