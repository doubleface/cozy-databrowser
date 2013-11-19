americano = require 'americano'
init = require './server/init'

port = process.env.PORT || 9250
init ->
    americano.start name: 'databrowser', port: port