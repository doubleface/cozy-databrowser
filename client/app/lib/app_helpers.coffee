(() ->
    # IIFE to avoid collisions with other variables
    (->
        # Make it safe to do console.log() always.
        console = window.console = window.console or {}
        method = undefined
        dummy = ->
        methods = ('assert,count,debug,dir,dirxml,error,exception,
                   group,groupCollapsed,groupEnd,info,log,markTimeline,
                   profile,profileEnd,time,timeEnd,trace,warn').split ','

        console[method] = console[method] or dummy while method = methods.pop()
    )()  
)()
  # Initialize Spin JS the lib that displays loading indicators
(() ->
    $.fn.spin = (opts, color) ->
        presets =
            tiny:
                lines: 8
                length: 2
                width: 2
                radius: 3

            small:
                lines: 8
                length: 1
                width: 2
                radius: 5

            large:
                lines: 10
                length: 8
                width: 4
                radius: 8

        if Spinner
            @each ->
                $this = $(this)
                spinner = $this.data("spinner")
                if spinner?
                    spinner.stop()
                    $this.data "spinner", null
                else if opts isnt false
                    if typeof opts is "string"
                        if opts of presets
                            opts = presets[opts]
                        else
                            opts = {}
                        opts.color = color if color
                    spinner = new Spinner(
                        $.extend(color: $this.css("color"), opts))
                    spinner.spin(this)
                    $this.data "spinner", spinner

        else
            console.log "Spinner class not available."
            null
)()