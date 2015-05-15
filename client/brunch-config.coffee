exports.config =
    # See docs at http://brunch.readthedocs.org/en/latest/config.html.
    #coffeelint:
        #pattern: /^app\/.*\.coffee$/
        #options:
            #indentation:
                #value: 4
                #level: "error"

    files:
        javascripts:
            joinTo:
                'javascripts/app.js': /^app/
                'javascripts/vendor.js': /^vendor/
            order:
                # Files in `vendor` directories are compiled before other files
                # even if they aren't specified in order.
                before: [
                    'vendor/scripts/jquery-2.0.3.min.js'
                    'vendor/scripts/underscore-1.5.2.min.js'
                    'vendor/scripts/bootstrap.min.js'
                    'vendor/scripts/backbone-1.1.0.min.js'
                ]

        stylesheets:
            joinTo: 'stylesheets/app.css'
            order:
                before: [
                    'vendor/styles/font-awesome.min.css'
                    'vendor/styles/bootstrap.min.css'
                ]

        templates:
            defaultExtension: 'jade'
            joinTo: 'javascripts/app.js'
    plugins:
        jade:
            globals: ['t', 'jQuery', '$']
    server:
        path: 'custom-server.js'

