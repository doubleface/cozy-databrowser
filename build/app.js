/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ((function(modules) {
	// Check all modules for deduplicated modules
	for(var i in modules) {
		if(Object.prototype.hasOwnProperty.call(modules, i)) {
			switch(typeof modules[i]) {
			case "function": break;
			case "object":
				// Module can be created from a template
				modules[i] = (function(_m) {
					var args = _m.slice(1), fn = modules[_m[0]];
					return function (a,b,c) {
						fn.apply(this, [a,b,c].concat(args));
					};
				}(modules[i]));
				break;
			default:
				// Module is a copy of another module
				modules[i] = modules[modules[i]];
				break;
			}
		}
	}
	return modules;
}([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	var _application = __webpack_require__(5);
	
	var _application2 = _interopRequireDefault(_application);
	
	__webpack_require__(16);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	window.app = _application2.default;
	
	$(function () {
	  return _application2.default.initialize();
	});

/***/ },
/* 1 */,
/* 2 */,
/* 3 */,
/* 4 */,
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	
	var _menu = __webpack_require__(8);
	
	var _menu2 = _interopRequireDefault(_menu);
	
	var _main = __webpack_require__(7);
	
	var _main2 = _interopRequireDefault(_main);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	var Router = Backbone.Router.extend({
	    routes: {
	        "doctype/:doctype": "onDoctype"
	    },
	    onDoctype: function onDoctype(doctype) {
	        this.app.views.main.setDoctype(doctype);
	        this.app.views.menu.select(doctype);
	    }
	});
	
	var app = {
	    initialize: function initialize() {
	        var _this = this;
	
	        window.cozysdk.client.put("request/doctypes/getsums/", {
	            "reduce": "function (keys, values, rereduce) {return sum(values);}",
	            "map": "function (doc) { if (doc.docType) emit(doc.docType, 1); }"
	        }, function () {
	            _this.views = {
	                menu: new _menu2.default(),
	                main: new _main2.default()
	            };
	            _this.views.menu.$el.appendTo("#container");
	            _this.views.main.$el.appendTo("#container");
	
	            _this.views.main.on("remove:item", function () {
	                _this.views.menu.refresh();
	            });
	            _this.router = new Router({
	                app: _this
	            });
	            _this.router.app = _this;
	            Backbone.history.start();
	
	            $("[formaction='drawer/toggle']").on("click", function () {
	                var $aside = $("aside");
	                var isExpanded = $aside.attr("aria-expanded") === "true" ? "false" : "true";
	                $aside.attr("aria-expanded", isExpanded);
	            });
	        });
	    }
	};
	
	var router = new Router();
	
	exports.default = app;

/***/ },
/* 6 */
/***/ function(module, exports) {

	"use strict";
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.default = Backbone.Collection.extend({
	    model: Backbone.Model,
	    fetch: function fetch() {
	        var _this = this;
	
	        return new Promise(function (resolve, reject) {
	            window.cozysdk.queryView("doctypes", "getsums", { group: true }).then(function (result) {
	                _this.reset(result);
	                resolve(result);
	            }).catch(function (err) {
	                reject(err);
	            });
	        });
	    }
	});

/***/ },
/* 7 */
/***/ function(module, exports) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	function attrToString(attr) {
	    if (!_(attr).isObject()) return attr;else {
	        var result = '<ul>';
	        for (var i in attr) {
	            result += '<li>' + attrToString(attr[i]) + '</li>';
	        }
	        result += '</ul>';
	        return result;
	    }
	}
	
	exports.default = Backbone.View.extend({
	    el: "[role='contentinfo']",
	    events: {
	        "click .remove_action": "onRemoveAction"
	    },
	    collection: new Backbone.Collection(),
	    initialize: function initialize() {
	        this.listenTo(this.collection, "reset", this.render);
	    },
	    onRemoveAction: function onRemoveAction(e) {
	        var _this = this;
	
	        var datatable = this.$("#databrowser").DataTable();
	        var tr = $(e.target).closest("tr")[0];
	        var datatable_tr = datatable.row(tr);
	        var id = datatable_tr.data()._id;
	        window.cozysdk.destroy(this.doctype, id).then(function () {
	            datatable_tr.remove().draw();
	            _this.trigger("remove:item");
	        }).catch(function (err) {
	            console.error(err, "could not destroy document");
	        });
	    },
	    getCols: function getCols(json) {
	        var result = [];
	        if (json.length === 0 || Object.keys(json[0]) == 0) return false;
	        for (var i in json[0]) {
	            result.push({
	                title: i,
	                data: i,
	                defaultContent: ""
	            });
	        }
	        result.unshift({
	            title: "Action",
	            data: null,
	            defaultContent: '<a class="remove_action" href="#" title="Remove">&#128465;</a>'
	        });
	        return result;
	    },
	    render: function render() {
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
	            dom: '<"thead"Bfi>t',
	            buttons: ["colvis", "copyHtml5", "csvHtml5"],
	            scrollX: "100%",
	            scrollY: "calc(100vh - 7em)",
	            deferRender: true,
	            scroller: true,
	            data: json,
	            columns: this.getCols(json)
	        };
	        this.$("#databrowser").DataTable(config);
	        return this;
	    },
	    setDoctype: function setDoctype(doctype) {
	        var _this2 = this;
	
	        this.doctype = doctype;
	        cozysdk.queryView(doctype.toLowerCase(), "all", {}).then(function (data) {
	            _this2.collection.reset(data.map(function (record) {
	                return record.value;
	            }));
	        }).catch(function (err) {
	            console.error(err, "error while fetching doctype");
	        });
	    }
	});

/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	
	var _menu = __webpack_require__(6);
	
	var _menu2 = _interopRequireDefault(_menu);
	
	__webpack_require__(14);
	
	__webpack_require__(13);
	
	__webpack_require__(15);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	exports.default = Backbone.View.extend({
	    el: "aside",
	    collection: new _menu2.default(),
	    initialize: function initialize() {
	        this.refresh();
	    },
	
	    itemTemplate: _.template('<li><a class="<%= sclass %>" href="#doctype/<%= url %>"><%= label %> (<%= value %>)</a></li>'),
	    refresh: function refresh() {
	        this.collection.fetch().then(this.render.bind(this)).catch(function (err) {
	            return console.error(err, "error while fetching menu collection");
	        });
	    },
	    render: function render() {
	        var _this = this;
	
	        var html = "<ul>";
	        this.collection.forEach(function (model) {
	            var json = model.toJSON();
	            json.sclass = json.key === _this.selected ? "selected" : "";
	            json.label = json.key[0].toUpperCase() + json.key.substr(1);
	            json.url = json.key.toLowerCase();
	            html += _this.itemTemplate(json);
	        }, this);
	        html += "</ul>";
	        this.$el.empty().html(html);
	        return this;
	    },
	    select: function select(doctype) {
	        this.selected = doctype;
	        this.$("a").removeClass("selected");
	        this.$("a[href='#doctype/" + doctype + "']").addClass("selected");
	    }
	});

/***/ },
/* 9 */,
/* 10 */,
/* 11 */,
/* 12 */,
/* 13 */
/***/ function(module, exports) {

	// removed by extract-text-webpack-plugin

/***/ },
/* 14 */
13,
/* 15 */
13,
/* 16 */
13
/******/ ])));
//# sourceMappingURL=app.js.map