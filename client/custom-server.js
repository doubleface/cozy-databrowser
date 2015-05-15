'use strict';

var express    = require('express');
var http       = require('http');
var logger     = require('morgan');
var Path       = require('path');

// Our server start function
exports.startServer = function startServer(port, path, callback) {
    var app = express();
    var server = http.createServer(app);

    // We’ll just store entries sent through REST in-memory here
    var items = [];

    // Basic middlewares: static files, logs, form fields
    app.use(express.static(Path.join(__dirname, path)));
    app.use(logger('dev'));

    // GET `/items` -> JSON for the entries array
    app.get('/initvalues.js', function(req, res) {
        res.end('window.locale = "fr";');
    });

    app.get('/doctypes', function(req, res) {
        res.json([
            {"name":"all","value":[
                {"doctype":"account","sum":1,"displayName":""},
                {"doctype":"album","sum":3,"displayName":""},
                {"doctype":"Application","sum":15,"displayName":""},
                {"doctype":"bank","sum":33,"displayName":""},
                {"doctype":"bankaccess","sum":1,"displayName":""},
                {"doctype":"bankaccount","sum":3,"displayName":""},
                {"doctype":"bankoperation","sum":522,"displayName":""},
                {"doctype":"Binary","sum":5141,"displayName":""},
                {"doctype":"contact","sum":256,"displayName":""},
                {"doctype":"contactconfig","sum":1,"displayName":""},
                {"doctype":"CozyInstance","sum":1,"displayName":""},
                {"doctype":"Device","sum":1,"displayName":""},
                {"doctype":"FavoriteTag","sum":1,"displayName":""},
                {"doctype":"File","sum":687,"displayName":""},
                {"doctype":"Folder","sum":1,"displayName":""},
                {"doctype":"kresusconfig","sum":2,"displayName":""},
                {"doctype":"mailbox","sum":16,"displayName":""},
                {"doctype":"message","sum":15967,"displayName":""},
                {"doctype":"Mood","sum":1,"displayName":""},
                {"doctype":"Note","sum":2,"displayName":""},
                {"doctype":"photo","sum":14,"displayName":""},
                {"doctype":"StackApplication","sum":4,"displayName":""},
                {"doctype":"tag","sum":5,"displayName":""},
                {"doctype":"Task","sum":1,"displayName":""},
                {"doctype":"Tasky","sum":1,"displayName":""},
                {"doctype":"TodoList","sum":1,"displayName":""},
                {"doctype":"Tree","sum":1,"displayName":""},
                {"doctype":"User","sum":1,"displayName":""},
                {"doctype":"UseTracker","sum":111,"displayName":""},
                {"doctype":"WebDAVAccount","sum":1,"displayName":""}
            ]}
        ]);
    });

    // Listen on the right port, and notify Brunch once ready through `callback`.
    server.listen(port, callback);
};
