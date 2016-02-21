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
                    'vendor/scripts/datatables.js'
                    'vendor/scripts/dataTables.scroller.js'
                    'vendor/scripts/dataTables.buttons.js'
                    'vendor/scripts/buttons.colVis.js'
                    'vendor/scripts/dataTables.responsive.js'
                    'vendor/scripts/polyglot.js'
                ]

        stylesheets:
            joinTo: 'styles/app.css'

    server:
        path: 'custom-server.js'
    plugins:
        babel:
            ignore: [
                /^(bower_components|vendor)/
            ]
        stylus:
            plugins: [
                'cozy-ui/lib/stylus'
            ]
