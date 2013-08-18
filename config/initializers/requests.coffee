module.exports = (compound) ->

    Metadoctype = compound.models.Metadoctype

    # all = (doc) ->
    #     emit doc.title, doc

    # Metadoctype.defineRequest "all", all, (err) ->
    #     if err
    #         compound.logger.write "Request Metadoctype#All, cannot be created"
    #         compound.logger.write err


    bydoctypename = (doc) ->
        emit doc.related, doc 

    Metadoctype.defineRequest "bydoctypename", bydoctypename, (err) ->
        if err
            compound.logger.write "Request Metadoctype#bydoctypename, cannot be created"
            compound.logger.write err

    # Metadoctype.request "bydoctypename", null, (err) ->
    #     if err
    #         compound.logger.write "Request Metadoctype#bydoctypename, cannot be created"
    #         compound.logger.write err

 