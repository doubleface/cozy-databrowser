fs     = require 'fs'
{exec} = require 'child_process'
util   = require 'util'

option '-f' , '--file [FILE*]' , 'test file to run'
option ''   , '--dir [DIR*]'   , 'directory where to grab test files'
option '-d' , '--debug'        , 'run node in debug mode'
option '-b' , '--debug-brk'    , 'run node in --debug-brk mode (stops on first line)'
option '-v' , '--verbose'      , 'run in development NODE_ENV instead of test NODE_ENV'

options =  # defaults, will be overwritten by command line options
    file        : no
    dir         : no
    debug       : no
    'debug-brk' : no

# Grab test files of a directory
walk = (dir, fileList, excludeElements = []) ->
    list = fs.readdirSync dir
    if list
        for file in list
            if file and file not in excludeElements
                filename = "#{dir}/#{file}"
                stat = fs.statSync filename
                if stat and stat.isDirectory()
                    walk filename, fileList, excludeElements
                else if filename.substr(-6) is "coffee"
                    fileList.push filename
    return fileList


task 'tests', 'run server tests, ./test is parsed by default, otherwise use -f or --dir', (opts) ->
    options   = opts
    testFiles = []
    if options.dir
        dirList   = options.dir
        testFiles = walk dir, testFiles for dir in dirList
    if options.file
        testFiles  = testFiles.concat options.file
    if not (options.dir or options.file)
        testFiles = walk "tests", []
    runTests testFiles

runTests = (fileList) ->
    if options['verbose']
        env = 'NODE_ENV=development'
    else
        env = 'NODE_ENV=test'
    command = "mocha " + fileList.join(" ") + " "
    if options['debug-brk']
        command += "--debug-brk --forward-io --profile "
    if options.debug
        command += "--debug --forward-io --profile "
    command += " --reporter spec --require should --compilers coffee:coffee-script --colors"
    exec command, (err, stdout, stderr) ->
        if err
            console.log "Running mocha caught exception: \n" + err
        console.log stdout

task "lint", "Run coffeelint on source files", ->
    lintFiles = []
    walk '.', lintFiles, ['node_modules', 'tests']

    # if installed globally, output will be colored
    testCommand = "coffeelint -v"
    exec testCommand, (err, stdout, stderr) ->
        if err or stderr
            command = "./node_modules/coffeelint/bin/coffeelint"
        else
            command = "coffeelint"

        command += " -f coffeelint.json -r " + lintFiles.join " "
        exec command, (err, stdout, stderr) ->
            console.log stdout
