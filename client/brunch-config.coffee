exports.config =
    files:
        javascripts:
            joinTo:
                'javascripts/app.js': /^app/
                'javascripts/vendor.js': /^vendor/
            order:
                before: [
                    'vendor/scripts/jquery.js'
                    'vendor/scripts/underscore.js'
                    'vendor/scripts/backbone.js'
                    'vendor/scripts/polyglot.js'
                ]

    server:
        path: 'custom-server.js'
    plugins:
        babel:
            ignore: [
                /^(bower_components|vendor)/
            ]
