'use strict';

var express    = require('express');
var http       = require('http');
var logger     = require('morgan');
var Path       = require('path');

// Our server start function
exports.startServer = function startServer(port, path, callback) {
    var app = express();
    var server = http.createServer(app);

    // Basic middlewares: static files, logs, form fields
    app.use(express.static(Path.join(__dirname, path)));
    app.use(logger('dev'));

    // GET `/items` -> JSON for the entries array
    app.get('/initvalues.js', function(req, res) {
        res.end('window.locale = "fr";');
    });

    app.get('/doctypes', function(req, res) {
        res.json([
            {"doctype":"Account","sum":1},
            {"doctype":"Album","sum":3},
            {"doctype":"Application","sum":15},
            {"doctype":"Bank","sum":33},
            {"doctype":"Bankaccess","sum":1},
            {"doctype":"Bankaccount","sum":3},
            {"doctype":"Bankoperation","sum":522},
            {"doctype":"Binary","sum":5141},
            {"doctype":"Contact","sum":256},
            {"doctype":"Contactconfig","sum":1},
            {"doctype":"CozyInstance","sum":1},
            {"doctype":"Device","sum":1},
            {"doctype":"FavoriteTag","sum":1},
            {"doctype":"File","sum":687},
            {"doctype":"Folder","sum":1},
            {"doctype":"Kresusconfig","sum":2},
            {"doctype":"Mailbox","sum":16},
            {"doctype":"Message","sum":15967},
            {"doctype":"Mood","sum":1},
            {"doctype":"Note","sum":2},
            {"doctype":"Photo","sum":14},
            {"doctype":"StackApplication","sum":4},
            {"doctype":"Tag","sum":5},
            {"doctype":"Task","sum":1},
            {"doctype":"Tasky","sum":1},
            {"doctype":"TodoList","sum":1},
            {"doctype":"Tree","sum":1},
            {"doctype":"User","sum":1},
            {"doctype":"UseTracker","sum":111},
            {"doctype":"WebDAVAccount","sum":1}
        ]);
    });

    var counter = 0;
    app.get('/search', function(req, res) {
        counter++;
        if (counter % 2 === 0) {
            res.json([
                {"_id":"0c598fddbd4bced9588fe57a91003a1c","name":"files","description":"files description","slug":"files","state":"installed","isStoppable":false,"date":"2015-04-22T16:24:59.201Z","icon":"img/apps/files.svg","color":null,"git":"https://github.com/cozy/cozy-files.git","permissions":{"File":{"description":"Store files in your cozy"},"Folder":{"description":"Store folders in your cozy"},"Notification":{"description":"Display a notification when guests change file"},"send mail":{"description":"Send links by mail"},"CozyInstance":{"description":"To display the application in the right language, the application requires access to your instance informations."},"Contact":{"description":"To easily find your contact when sharing files & folders."},"User":{"description":"Need information for the from part of email sent."},"send mail from user":{"description":"Send links by mail"},"send mail to user":{"description":"Send links by mail"}},"password":"toto","widget":null,"version":"1.1.7","needsUpdate":false,"docType":"Application","iconPath":null,"iconType":"svg","port":9121,"id":"0c598fddbd4bced9588fe57a91003a1c","repository":{"type":"git","url":"https://github.com/cozy/cozy-files.git"},"dir":"/usr/local/cozy/apps/files","user":"cozy-files","logFile":"/usr/local/var/log/cozy/files.log","server":"build/server.js","startScript":"/usr/local/cozy/apps/files/build/server.js","backup":"/usr/local/var/log/cozy/files.log-backup","_attachments":{"icon.svg":{"content_type":"image/svg+xml","revpos":11,"digest":"toto","length":1076,"stub":true}}},
                {"_id":"0c598fddbd4bced9588fe57a9100557d","name":"contacts","description":"contacts description","slug":"contacts","state":"installed","isStoppable":false,"date":1429719915049,"icon":"img/apps/contacts.svg","color":null,"git":"https://github.com/cozy/cozy-contacts.git","permissions":{"Contact":{"description":"Create and edit your contacts."},"CozyInstance":{"description":"Read language setting"},"ContactConfig":{"description":"Store your settings for contacts"},"Tag":{"description":"Create new tags and change their color"},"WebDAVAccount":{"description":"Store webDAV password and sync informations"}},"password":"toto","widget":null,"version":"1.1.4","needsUpdate":false,"docType":"Application","iconPath":null,"iconType":"svg","port":9114,"id":"0c598fddbd4bced9588fe57a9100557d","repository":{"type":"git","url":"https://github.com/cozy/cozy-contacts.git"},"dir":"/usr/local/cozy/apps/contacts","user":"cozy-contacts","logFile":"/usr/local/var/log/cozy/contacts.log","server":"build/server.js","startScript":"/usr/local/cozy/apps/contacts/build/server.js","backup":"/usr/local/var/log/cozy/contacts.log-backup","_attachments":{"icon.svg":{"content_type":"image/svg+xml","revpos":3,"digest":"md5-PE2xs1D3O3iTrJcXVcd7mg==","length":2488,"stub":true}}},
                {"_id":"0c598fddbd4bced9588fe57a910060d1","name":"sync","description":"sync description","slug":"sync","state":"installed","isStoppable":false,"date":1429719915075,"icon":"img/apps/sync.svg","color":null,"git":"https://github.com/cozy/cozy-sync.git","permissions":{"Alarm":{"description":"Creates and edits your alarms."},"Event":{"description":"Creates and edits your events."},"Contact":{"description":"Creates and edits your contacts"},"User":{"description":"Used to recover your timezone"},"WebDAVAccount":{"description":"Store webDAV password and sync informations"},"Tag":{"description":"Read your tags, to get calendar's color"},"CozyInstance":{"description":"Read your cozy's url to generate help"}},"password":"toto","widget":null,"version":"1.0.7","needsUpdate":false,"docType":"Application","iconPath":null,"iconType":"svg","port":9116,"id":"0c598fddbd4bced9588fe57a910060d1","repository":{"type":"git","url":"https://github.com/cozy/cozy-sync.git"},"dir":"/usr/local/cozy/apps/sync","user":"cozy-sync","logFile":"/usr/local/var/log/cozy/sync.log","server":"build/server.js","startScript":"/usr/local/cozy/apps/sync/build/server.js","backup":"/usr/local/var/log/cozy/sync.log-backup","_attachments":{"icon.svg":{"content_type":"image/svg+xml","revpos":3,"digest":"md5-TDROBuh8Egcm/LIUqUuffQ==","length":3150,"stub":true}}},
                {"_id":"0c598fddbd4bced9588fe57a910062ab","name":"calendar","description":"calendars description","slug":"calendar","state":"installed","isStoppable":false,"date":1429719917611,"icon":"img/apps/calendar.svg","color":null,"git":"https://github.com/cozy/cozy-calendar.git","permissions":{"Alarm":{"description":"Creates and edits your alarms."},"Event":{"description":"Creates and edits your events."},"User":{"description":"Used to recover your timezone"},"CozyInstance":{"description":"Used to recover your language setting and your cozy's domain"},"Contact":{"description":"Invite your contacts to an event"},"Tag":{"description":"Create new tags and change their color"},"send mail from user":{"description":"Send invitations by mail"},"WebDAVAccount":{"description":"Store webDAV password and sync informations"}},"password":"toto","widget":null,"version":"1.0.14","needsUpdate":false,"docType":"Application","iconPath":null,"iconType":"svg","port":9113,"id":"0c598fddbd4bced9588fe57a910062ab","repository":{"type":"git","url":"https://github.com/cozy/cozy-calendar.git"},"dir":"/usr/local/cozy/apps/calendar","user":"cozy-calendar","logFile":"/usr/local/var/log/cozy/calendar.log","server":"build/server.js","startScript":"/usr/local/cozy/apps/calendar/build/server.js","backup":"/usr/local/var/log/cozy/calendar.log-backup","_attachments":{"icon.svg":{"content_type":"image/svg+xml","revpos":3,"digest":"md5-5UYu3j9exNgfF7nHSMhPNw==","length":5586,"stub":true}}},
                {"_id":"0c598fddbd4bced9588fe57a91006752","name":"photos","description":"photos description","slug":"photos","state":"stopped","isStoppable":true,"date":"2015-04-22T16:25:19.303Z","icon":"img/apps/photos.svg","color":null,"git":"https://github.com/cozy/cozy-photos.git","permissions":{"Photo":{"description":"Creates and edits your photos"},"Album":{"description":"Creates and edits your album which contains your photos."},"Contact":{"description":"Allows you to easily share an album"},"CozyInstance":{"description":"Read language setting"},"File":{"description":"Import pictures from the Files app"},"Send mail from user":{"description":"Share album with your friends"}},"password":"toto","widget":null,"version":"1.0.12","needsUpdate":false,"docType":"Application","iconPath":null,"iconType":"svg","port":0,"id":"0c598fddbd4bced9588fe57a91006752","_attachments":{"icon.svg":{"content_type":"image/svg+xml","revpos":10,"digest":"md5-1cHqsBXU4DixDyb1GYY2Xw==","length":1145,"stub":true}}},
                {"_id":"0c598fddbd4bced9588fe57a91008289","name":"notes","description":"Cozy Notes is a simple and powerful note manager. Its specificity resides in its note editor which helps you to structure efficiently your notes. It also provide classical text editor shortcuts which make you ultra-efficient at typing notes.","slug":"notes","state":"installed","isStoppable":false,"date":"2015-04-22T20:20:39.092Z","icon":"img/apps/notes.svg","color":null,"git":"https://github.com/cozy/notes.git","permissions":{"Note":{"description":"Creates and edits your note documents."},"Tree":{"description":"Find the Inbox TodoList"},"Contact":{"description":"Create meta-tag to a contact"},"Alarm":{"description":"Create reminders from a note"},"Task":{"description":"Create tasks from a note"},"TodoList":{"description":"Create the \"inbox\" TodoList"}},"password":"toto","widget":null,"version":"1.0.1","needsUpdate":false,"docType":"Application","iconPath":null,"iconType":"svg","port":9201,"id":"0c598fddbd4bced9588fe57a91008289","repository":{"type":"git","url":"https://github.com/cozy/notes.git"},"dir":"/usr/local/cozy/apps/notes","user":"cozy-notes","logFile":"/usr/local/var/log/cozy/notes.log","server":"server.js","startScript":"/usr/local/cozy/apps/notes/server.js","backup":"/usr/local/var/log/cozy/notes.log-backup","_attachments":{"icon.svg":{"content_type":"image/svg+xml","revpos":3,"digest":"md5-6ATEYGqToIdjqfbBaGTAAw==","length":1414,"stub":true}}},
                {"_id":"0c598fddbd4bced9588fe57a910091bd","name":"term","description":"The tty.js cozy app","slug":"term","state":"stopped","isStoppable":true,"date":"2015-04-22T20:20:49.325Z","icon":"img/apps/term.svg","color":null,"git":"https://github.com/alpha14/cozy-term.git","permissions":{},"password":"toto","widget":null,"version":"1.0.1","needsUpdate":false,"docType":"Application","iconPath":null,"iconType":"svg","port":0,"id":"0c598fddbd4bced9588fe57a910091bd","_attachments":{"icon.svg":{"content_type":"image/svg+xml","revpos":8,"digest":"md5-wUNQYeFh0+PtQGGP92TT3Q==","length":1405,"stub":true}}},
                {"_id":"0c598fddbd4bced9588fe57a9101b172","name":"feeds","description":"Read your RSS feeds within your Cozy.","slug":"feeds","state":"stopped","isStoppable":true,"date":"2015-04-22T20:28:10.798Z","icon":"img/apps/feeds.svg","color":null,"git":"https://github.com/Piour/cozy-feeds.git","permissions":{"feed":{"description":"Allow you to manage your feeds"},"param":{"description":"Allow you to change the options of the app"}},"password":"toto","widget":null,"version":"1.4.1","needsUpdate":false,"docType":"Application","iconPath":null,"iconType":"svg","port":0,"id":"0c598fddbd4bced9588fe57a9101b172","repository":{"type":"git","url":"https://github.com/Piour/cozy-feeds.git"},"dir":"/usr/local/cozy/apps/feeds","user":"cozy-feeds","logFile":"/usr/local/var/log/cozy/feeds.log","server":"server.js","startScript":"/usr/local/cozy/apps/feeds/server.js","backup":"/usr/local/var/log/cozy/feeds.log-backup","_attachments":{"icon.svg":{"content_type":"image/svg+xml","revpos":3,"digest":"md5-OpVijyvk4rfrf2dKRHxlFQ==","length":1764,"stub":true}}},
                {"_id":"0c598fddbd4bced9588fe57a9101b27b","name":"tasky","description":"","slug":"tasky","state":"stopped","isStoppable":true,"date":"2015-04-22T20:28:23.513Z","icon":"img/apps/tasky.svg","color":"#3BDA6C","git":"https://github.com/jsilvestre/tasky.git","permissions":{"Tasky":{"description":"Create, edit, organize all your tasks."},"FavoriteTag":{"description":"Manage your favorite tags."},"CozyInstance":{"description":"This information is needed to localize the application in your language."}},"password":"toto","widget":null,"version":"1.0.10","needsUpdate":false,"docType":"Application","iconPath":"build/client/public/icons/main_icon.svg","iconType":"svg","port":0,"id":"0c598fddbd4bced9588fe57a9101b27b","repository":{"type":"git","url":"https://github.com/jsilvestre/tasky.git"},"dir":"/usr/local/cozy/apps/tasky","user":"cozy-tasky","logFile":"/usr/local/var/log/cozy/tasky.log","server":"build/server.js","startScript":"/usr/local/cozy/apps/tasky/build/server.js","backup":"/usr/local/var/log/cozy/tasky.log-backup","_attachments":{"icon.svg":{"content_type":"image/svg+xml","revpos":3,"digest":"md5-MimR+EvVGFblYW6yBsxGBQ==","length":432,"stub":true}}},
                {"_id":"0c598fddbd4bced9588fe57a9101c0ea","name":"nirc","description":"","slug":"nirc","state":"installed","isStoppable":false,"date":1429734513871,"icon":"img/apps/nirc.svg","color":null,"git":"https://github.com/frankrousseau/cozy-nirc.git","permissions":{},"password":"toto","widget":null,"version":"1.0.0","needsUpdate":false,"docType":"Application","iconPath":null,"iconType":"svg","port":9888,"id":"0c598fddbd4bced9588fe57a9101c0ea","repository":{"type":"git","url":"https://github.com/frankrousseau/cozy-nirc.git"},"dir":"/usr/local/cozy/apps/nirc","user":"cozy-nirc","logFile":"/usr/local/var/log/cozy/nirc.log","server":"server.js","startScript":"/usr/local/cozy/apps/nirc/server.js","backup":"/usr/local/var/log/cozy/nirc.log-backup","_attachments":{"icon.svg":{"content_type":"image/svg+xml","revpos":3,"digest":"md5-/yku97scgGtqYBb7sn4tlw==","length":2417,"stub":true}}}
            ]);
        } else {
            res.json([
                {"_id":"471e28eb18d985e7d7f098080e14d032","start":"1901-01-01","end":"1901-01-01","place":"","description":"","tags":["Nouvel agenda"],"attendees":[],"related":null,"alarms":[],"created":"2015-07-15T05:06:49.415Z","lastModification":"2015-07-15T05:06:49.415Z","docType":"event"},
                {"_id":"471e28eb18d985e7d7f098080e164ba2","start":"2015-07-24T16:00:00.000Z","end":"2015-07-24T17:00:00.000Z","place":"Montfort-l'amory","details":"","description":"todo","tags":["Nouvel agenda"],"attendees":[],"related":null,"alarms":[],"created":"2015-07-18T18:18:28.142Z","lastModification":"2015-07-18T18:18:28.143Z","docType":"event"}
            ]);
        }
    });

    // Listen on the right port, and notify Brunch once ready through `callback`.
    server.listen(process.env.PORT || port, process.env.IP || "0.0.0.0", callback);
    console.log("Server started on " + (process.env.IP || "0.0.0.0") + ":" + (process.env.PORT || port));
};
