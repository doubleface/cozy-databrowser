module.exports = (compound) ->

    All = compound.models.All
    Metadoctype = compound.models.Metadoctype


    # all = (doc) ->
    #     emit doc.title, doc

    # Metadoctype.defineRequest "all", all, (err) ->
    #     if err
    #         compound.logger.write "Request Metadoctype#All, cannot be created"
    #         compound.logger.write err
    
    getAllByRelated = (doc) ->
        emit doc.related, doc 

    getSumsByDoctype = {
        map : (doc) ->
            if doc.docType?                
                emit doc.docType, 1         
        reduce : (keys, values, rereduce) ->
            result = { 'docType' : '', 'sum': 0 }
            for elt, index in values
                if !isNaN(elt)
                    result.docType = keys[index][0] || ''
                    result.sum += elt || 0
            return result        
    }
            
    All.defineFullRequest "getSumsByDoctype", getSumsByDoctype, (err) ->
        if err
            compound.logger.write "Request All#getSumsByDoctype, cannot be created"
            compound.logger.write err

    
    Metadoctype.defineRequest "getAllByRelated", getAllByRelated, (err) ->
        if err
            compound.logger.write "Request Metadoctype#getAllByRelated, cannot be created"
            compound.logger.write err

    # Metadoctype.request "bydoctypename", null, (err) ->
    #     if err
    #         compound.logger.write "Request Metadoctype#bydoctypename, cannot be created"
    #         compound.logger.write err

# var sums = {};
# function (doc) {
#   sums[doc.docType.toLowerCase()] = sums[doc.docType.toLowerCase()] || 0;
#   sums[doc.docType.toLowerCase()]++;

#   if (doc.docType === "Metadoctype") {
#     filter = function (doc) {
#       return emit (doc.related.toLowerCase(), [doc, sums[doc.related.toLowerCase()]]);
#     };
#     filter(doc);
#   }
# }