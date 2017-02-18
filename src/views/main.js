function attrToString(attr) {
    if (!_(attr).isObject()) return attr;
    else {
        let result = '<ul>';
        for (let i in attr) {
            result+= `<li>${attrToString(attr[i])}</li>`;
        }
        result+= '</ul>';
        return result;
    }
}

export default Backbone.View.extend({
    el: "[role='contentinfo']",
    events: {
        "click .remove_action": "onRemoveAction",
        "click .remove-all": "onRemoveAllAction",
    },
    collection: new Backbone.Collection(),
    initialize() {
        this.listenTo(this.collection, "reset", this.render);
    },
    onRemoveAllAction() {
        let result = confirm("Are you sure you want to remove ALL the rows?");
        if (result) {
            window.cozy.fetchJSON("PUT", `/request/${this.doctype.toLowerCase()}/all/destroy`)
            .then(() => {
                const datatable = this.$("#databrowser").DataTable();
                datatable.rows().remove().draw();
                this.trigger("remove:item");
            })
            .catch(err => {
                console.error(err, "could not destroy the documents");
            });
        }
    },
    onRemoveAction(e) {
        e.preventDefault();
        let result = confirm("Are you sure you want to remove this row?");
        if (result) {
            const datatable = this.$("#databrowser").DataTable();
            const tr = $(e.target).closest("tr")[0];
            const datatable_tr = datatable.row(tr);
            const id = datatable_tr.data()._id;
            window.cozy.fetchJSON("DELETE", `/data/${id}`)
            .then(() => {
                datatable_tr.remove().draw();
                this.trigger("remove:item");
            })
            .catch(err => {
                console.error(err, "could not destroy document");
            });
        }
    },
    getCols(json) {
        var result = [];
        if (json.length === 0 || Object.keys(json[0]) == 0) return false;
        for (var i in json[0]) {
            result.push({
                title: i,
                name: i.toLowerCase(),
                data: i,
                defaultContent: ""
            });
        }
        result.push({
            title: "Action",
            data: null,
            defaultContent: '<a class="remove_action" title="Remove"><img src="images/trash.svg"></a>'
        });
        return result;
    },
    render() {
        this.$el.html('<table id="databrowser"></table>');
        var json = this.collection.toJSON();
        var columns = this.getCols(json);
        if (columns === false) {
            console.log("no column or no data at all");
            return this;
        }
        var config = {
            destroy: true,
            lengthChange: false,
            dom: '<"thead"Bfi<"remove-all-action">>t',
            buttons: ["colvis", "copyHtml5", "csvHtml5"],
            scrollX: "100%",
            scrollY: "calc(100vh - 7em)",
            deferRender: true,
            scroller: true,
            data: json,
            columns: this.getCols(json)
        };
        let dt = this.$("#databrowser").DataTable(config);
        dt.column("_id:name").visible(false);
        dt.column("doctype:name").visible(false);
        dt.column("password:name").visible(false);
        this.renderRemoveAll();
        return this;
    },
    renderRemoveAll() {
        let title = "Remove all";
        this.$(".remove-all-action").html(`<a class="dt-button remove-all">
                <span><img src="images/trash.svg"> ${title}</span>
        </a>`);
    },
    displayLoader() {
        this.$el.html(`<img class="spinner" src="images/spinner.gif">`);
    },
    setDoctype(doctype){
        this.doctype = doctype;
        this.displayLoader();
        cozy.defineIndex(doctype.toLowerCase(), ["_id"])
        .then(index => cozy.query(index, {selector: {"_id": {"$gt": 0}}}))
        .then(data => {
            this.collection.reset(data);
        })
        .catch(err => {
            console.error(err, "error while fetching doctype");
        });
    }
});
