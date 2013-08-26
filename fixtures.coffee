###
Script to add data fixtures to the data system
to setup the dev env.
####
async = require 'async' # npm install async
Client = require('request-json').JsonClient # npm install request-json

# Connection to the data system
client = new Client "http://localhost:9101/"
dataCollection = []

###
TODO: making the tool more generic (loading data fixtures from other files)
###

# Agenda meta doctype document
dataCollection.push
    docType: "Metadoctype"
    related: "Alarm" # what doctype this document describes
    displayName: "Alarme"
    identificationField: "description"
    fields: [
        "action":
            displayName: "Action"
            description: "Représente le canal de diffusion de l'alarme dans le format iCal (DISPLAY, EMAIL, AUDIO)"
        "trigg":
            displayName: "Date de déclenchement"
            description: "Date à laquelle l'alarme doit être déclenchée"
        "related":
            displayName: "En relation"
            description: "Si cette alarme a été créée en relation avec un autre document, ce champ permet de spécifier l'identifiant de ce document."
    ]

# Agenda documents
dataCollection.push
    docType: "Alarm"
    action: "DISPLAY"
    trigg: "Tue Jul 08 2013 14:30:00"
    description: "Réunion scopyleft"
    related: null

dataCollection.push
    docType: "Alarm"
    action: "DISPLAY"
    trigg: "Tue Jul 19 2013 09:00:00"
    description: "Réunion MesInfos"
    related: null

dataCollection.push
    docType: "Alarm"
    action: "DISPLAY"
    trigg: "Tue Jul 02 2013 16:00:00"
    description: "Réunion review scopyleft"
    related: null
dataCollection.push
    docType: "Alarm"
    action: "DISPLAY"
    trigg: "Tue Jul 08 2013 14:30:00"
    description: "Réunion scopyleft"
    related: null

dataCollection.push
    docType: "Alarm"
    action: "DISPLAY"
    trigg: "Tue Jul 19 2013 09:00:00"
    description: "Réunion MesInfos"
    related: null

dataCollection.push
    docType: "Alarm"
    action: "DISPLAY"
    trigg: "Tue Jul 02 2013 16:00:00"
    description: "Réunion review scopyleft"
    related: null
dataCollection.push
    docType: "Alarm"
    action: "DISPLAY"
    trigg: "Tue Jul 08 2013 14:30:00"
    description: "Réunion scopyleft"
    related: null

dataCollection.push
    docType: "Alarm"
    action: "DISPLAY"
    trigg: "Tue Jul 19 2013 09:00:00"
    description: "Réunion MesInfos"
    related: null

dataCollection.push
    docType: "Alarm"
    action: "DISPLAY"
    trigg: "Tue Jul 02 2013 16:00:00"
    description: "Réunion review scopyleft"
    related: null
dataCollection.push
    docType: "Alarm"
    action: "DISPLAY"
    trigg: "Tue Jul 08 2013 14:30:00"
    description: "Réunion scopyleft"
    related: null

dataCollection.push
    docType: "Alarm"
    action: "DISPLAY"
    trigg: "Tue Jul 19 2013 09:00:00"
    description: "Réunion MesInfos"
    related: null

dataCollection.push
    docType: "Alarm"
    action: "DISPLAY"
    trigg: "Tue Jul 02 2013 16:00:00"
    description: "Réunion review scopyleft"
    related: null
dataCollection.push
    docType: "Alarm"
    action: "DISPLAY"
    trigg: "Tue Jul 08 2013 14:30:00"
    description: "Réunion scopyleft"
    related: null

dataCollection.push
    docType: "Alarm"
    action: "DISPLAY"
    trigg: "Tue Jul 19 2013 09:00:00"
    description: "Réunion MesInfos"
    related: null

dataCollection.push
    docType: "Alarm"
    action: "DISPLAY"
    trigg: "Tue Jul 02 2013 16:00:00"
    description: "Réunion review scopyleft"
    related: null

# Contact meta doctype document
dataCollection.push
    docType: "Metadoctype"
    related: "Contact" # what doctype this document describes
    displayName: "Contact"
    identificationField: "fn"
    fields: [
        "fn":
            displayName: "Nom complet"
            description: "Le nom complet du contact."
        "datapoints":
            displayName: "Données complémentaires"
            description: "Tabeau contenant des données complémentaires sur le contact."
        "note":
            displayName: "Note"
            description: "Une note sur le contact."
    ]

# Contact documents
dataCollection.push
    docType: "Contact"
    fn: "Joseph Silvestre"
    datapoints: [
        {
            name: "about"
            type: "birthday"
            value: "02/02/1990"
            id: 1
        },
        {
            name: "tel"
            type: "main"
            value: "+33 12 34 56 78"
            id: 2
        }
    ]
    note: "Données complémentaires sur le contact."

dataCollection.push
    docType: "Contact"
    fn: "David Larlet"
    datapoints: [
        {
            name: "about"
            type: "birthday"
            value: "02/02/1980"
            id: 1
        },
        {
            name: "tel"
            type: "main"
            value: "+33 12 34 56 78"
            id: 2
        }
    ]
    note: "Données complémentaires sur le contact."

# Task meta doctype document
dataCollection.push
    docType: "Metadoctype"
    related: "Task" # what doctype this document describes
    displayName: "Tâche"
    identificationField: "description"
    fields: [
        "description":
            displayName: "Description"
            description: "Le contenu de la tâche."
        "done":
            displayName: "Fait?"
            description: "Indique si la tâche a été réalisée ou pas."
        "creationDate":
            displayName: "Date de création"
            description: "Date à laquelle la tâche a été créée."
        "completionDate":
            displayName: "Date de complétion"
            description: "Date à laquelle la tâche a été marquée comme faite."
        "previousTask":
            displayName: "Tâche précédente"
            description: "Une référence à la tâche précédente dans la liste."
        "nextTask":
            displayName: "Tâche suivante"
            description: "Une référence à la tâche suivante dans la liste."
        "list":
            displayName: "Liste"
            description: "Une référence à la liste à laquelle appartient la tâche."
        "tags":
            displayName: "Tags"
            description: "Les tags liés à la tâche."
    ]

# Task documents
dataCollection.push
    docType: "Task"
    id: "29aba0e2c27d5406dcc05bc919001d4d"
    description: "Ma super todo à faire"
    done: false
    completionDate: null
    creationDate: "1373360685861"
    previousTask: "29aba0e2c27d5406dcc05bc919001b1b"
    nextTask: null
    list: "29aba0e2c27d5406dcc05bc919001b1b"
    tags: []

dataCollection.push
    docType: "Task"
    id: "29aba0e2c27d5406dcc05bc919002138"
    description: "Une autre #super tâche"
    done: false
    completionDate: null
    creationDate: "1373360689162"
    previousTask: "29aba0e2c27d5406dcc05bc9190027c2"
    nextTask: "29aba0e2c27d5406dcc05bc919001d4d"
    list: "29aba0e2c27d5406dcc05bc919001b1b"
    tags: ["super"]

dataCollection.push
    docType: "Task"
    id: "29aba0e2c27d5406dcc05bc9190027c2"
    description: "Encore une #super tâche"
    done: false
    completionDate: null
    creationDate: "1373360693530"
    previousTask: null
    nextTask: "29aba0e2c27d5406dcc05bc919002138"
    list: "29aba0e2c27d5406dcc05bc919001b1b"
    tags: ["super"]

# Mail meta doctype document
dataCollection.push
    docType: "Metadoctype"
    related: "Mail" # what doctype this document describes
    displayName: "Mail"
    identificationField: "subject"
    fields: [
        "mailbox":
            displayName: "Boite mail"
            description: "Le contenu de la tâche."
        "idRemoteMailBox":
            displayName: "ID boite distante"
            description: "Usage interne."
        "createdAt":
            displayName: "Date de création"
            description: "Date de création"
        "dateValueOf":
            displayName: "Date"
            description: "Usage interne."
        "date":
            displayName: "Date"
            description: "Usage interne."
        "headersRaw":
            displayName: "Entêtes brut"
            description: "Usage interne."
        "raw":
            displayName: "Contenu brut"
            description: "Usage interne."
        "priority":
            displayName: "Priorité"
            description: "La priorité du mail."
        "subject":
            displayName: "Sujet"
            description: "Le sujet du mail."
        "from":
            displayName: "Expéditeur"
            description: "L'expéditeur du mail."
        "to":
            displayName: "Destinataire"
            description: "Le destinataire du mail."
        "cc":
            displayName: "En copie"
            description: "Destinataires en copie"
        "text":
            displayName: "Corps (text)"
            description: "Corps du mail en version texte."
        "html":
            displayName: "Corps (html)"
            description: "Corps du mail en version HTML."
        "flags":
            displayName: "Marqueur"
            description: "?"
        "read":
            displayName: "Lu"
            description: "Indique si le mail est lu ou pas."
        "flagged":
            displayName: "Marqué"
            description: "?"
        "hasAttachements":
            displayName: "Pièces jointes"
            description: "Indique si le mail a des pièces jointes"
        "inReplyTo":
            displayName: "En réponse à"
            description: "Référence à un mail précédent."
        "references":
            displayName: "Référence"
            description: "?"
    ]
# Mail documents
dataCollection.push
    docType: "Mail"
    mailbox: "Encore une #super tâche"
    idRemoteMailBox: ""
    createdAt: "1373360693530"
    dateValueOf: "1373360693530"
    date: "1373360693530"
    headersRaw: "?"
    raw: "?"
    priority: "0"
    subject: "Sujet du mail"
    from: "sample@test.com"
    to: "sample2@test.com"
    cc: "sample3@test.com"
    text: "Un super texte"
    html: "<p>Un super texte</p>"
    flags: "?"
    read: false
    flagged: false
    hasAttachements: false
    inReplyTo: null
    references: null


# Request factory
# Data are wrapped inside async requests.
requestFactory = (doc) ->
    return (callback) ->
        client.post 'data/', doc, (err, res, body) ->
            if err?
                callback("#{res.statusCode} - #{err}", null)
            else
               callback(null, 'OK')

# We prepare the requests
requests = []
for doc in dataCollection
    requests.push requestFactory(doc)


# We remove the old data and create the reequest
setupRequests = []
map = (doc) -> emit doc.id, doc if doc.docType is "Metadoctype"
all =
    map: map.toString()

setupRequests.push (callback) ->
    client.put 'request/alarm/all/destroy/', {}, (err, res, body) ->
        callback(err, body)
setupRequests.push (callback) ->
    client.put 'request/contact/all/destroy/', {}, (err, res, body) ->
        callback(err, body)
setupRequests.push (callback) ->
    client.put 'request/task/all/destroy/', {}, (err, res, body) ->
        callback(err, body)
setupRequests.push (callback) ->
    client.put 'request/metadoctype/all/destroy/', {}, (err, res, body) ->
        callback(err, body)
setupRequests.push (callback) ->
    client.put 'request/mail/all/destroy/', {}, (err, res, body) ->
        callback(err, body)
setupRequests.push (callback) ->
    client.put 'request/alarm/all/', all, (err, res, body) ->
        callback(err, body)
setupRequests.push (callback) ->
    client.put 'request/contact/all/', all, (err, res, body) ->
        callback(err, body)
setupRequests.push (callback) ->
    client.put 'request/task/all/', all, (err, res, body) ->
        callback(err, body)
setupRequests.push (callback) ->
    client.put 'request/metadoctype/all/', all, (err, res, body) ->
        callback(err, body)
setupRequests.push (callback) ->
    client.put 'request/task/all/', all, (err, res, body) ->
        callback(err, body)
setupRequests.push (callback) ->
    client.put 'request/mail/all/', all, (err, res, body) ->
        callback(err, body)



# We run the request with async (parallel execution, wait for all the callbacks)
console.log "Cleaning the database..."
async.parallel setupRequests, (err, results) ->
    if err?
        console.log err
    else
        console.log "Database cleaned.."
        console.log "Adding #{requests.length} new document to the data system..."
        async.parallel requests, (err, results) ->
           if err?
                console.log err if err?
            else
                console.log "#{results.length} documents have successfully added to the data system."