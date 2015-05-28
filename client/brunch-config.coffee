exports.config =
    files:
        javascripts:
            joinTo:
                'javascripts/app.js': /^app/
                'javascripts/vendor.js': /^vendor/
            order:
                before: [
                    'vendor/scripts/jquery-2.0.3.min.js'
                    'vendor/scripts/underscore-1.5.2.min.js'
                    'vendor/scripts/bootstrap.min.js'
                    'vendor/scripts/backbone-1.1.0.min.js'
                    'vendor/scripts/ace-extra.js'
                    'vendor/scripts/ace-elements.min.js'
                    'vendor/scripts/ace.js'
                    'vendor/scripts/spin.js'
                    'vendor/scripts/polyglot.js'
                    'vendor/scripts/jquery.dataTables.js'
                    'vendor/scripts/jquery.dataTables.bootstrap.js'
                    'vendor/scripts/jquery.dataTables.colreorder.min.js'
                    'vendor/scripts/jquery.dataTables.colvis.js'
                    'vendor/scripts/jquery.dataTables.addTr.jk'
                ]

        stylesheets:
            joinTo: 'stylesheets/app.css'
            order:
                before: [
                    'vendor/styles/ace-fonts.css'
                    'vendor/styles/ace.css'
                    'vendor/styles/ace-rtl.css'
                    'vendor/styles/ace-skins.css'
                    'vendor/styles/font-awesome.min.css'
                    'vendor/styles/bootstrap.min.css'
                    'vendor/styles/colreorder.css'
                    'vendor/styles/colvis.css'
                ]

        templates:
            defaultExtension: 'jade'
            joinTo: 'javascripts/app.js'
    plugins:
        jade:
            globals: ['t', 'jQuery', '$']
    server:
        path: 'custom-server.js'
