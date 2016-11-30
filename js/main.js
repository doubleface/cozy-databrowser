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
/******/ ({

/***/ 0:
/***/ function(module, exports, __webpack_require__) {

	__webpack_require__(10);
	module.exports = __webpack_require__(5);


/***/ },

/***/ 5:
/***/ function(module, exports) {

	"use strict";
	
	/******/(function (modules) {
		// webpackBootstrap
		/******/ // The module cache
		/******/var installedModules = {};
		/******/
		/******/ // The require function
		/******/function __webpack_require__(moduleId) {
			/******/
			/******/ // Check if module is in cache
			/******/if (installedModules[moduleId])
				/******/return installedModules[moduleId].exports;
			/******/
			/******/ // Create a new module (and put it into the cache)
			/******/var module = installedModules[moduleId] = {
				/******/exports: {},
				/******/id: moduleId,
				/******/loaded: false
				/******/ };
			/******/
			/******/ // Execute the module function
			/******/modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
			/******/
			/******/ // Flag the module as loaded
			/******/module.loaded = true;
			/******/
			/******/ // Return the exports of the module
			/******/return module.exports;
			/******/
		}
		/******/
		/******/
		/******/ // expose the modules object (__webpack_modules__)
		/******/__webpack_require__.m = modules;
		/******/
		/******/ // expose the module cache
		/******/__webpack_require__.c = installedModules;
		/******/
		/******/ // __webpack_public_path__
		/******/__webpack_require__.p = "";
		/******/
		/******/ // Load entry module and return exports
		/******/return __webpack_require__(0);
		/******/
	})(
	/************************************************************************/
	/******/[
	/* 0 */
	/***/function (module, exports, __webpack_require__) {
	
		"use strict";
	
		var _application = __webpack_require__(5);
	
		var _application2 = _interopRequireDefault(_application);
	
		function _interopRequireDefault(obj) {
			return obj && obj.__esModule ? obj : { default: obj };
		}
	
		window.app = _application2.default;
	
		$(function () {
			return _application2.default.initialize();
		});
	
		/***/
	},,,,,
	/* 1 */
	/* 2 */
	/* 3 */
	/* 4 */
	/* 5 */
	/***/function (module, exports, __webpack_require__) {
	
		"use strict";
	
		Object.defineProperty(exports, "__esModule", {
			value: true
		});
	
		var _menu = __webpack_require__(8);
	
		var _menu2 = _interopRequireDefault(_menu);
	
		var _main = __webpack_require__(7);
	
		var _main2 = _interopRequireDefault(_main);
	
		function _interopRequireDefault(obj) {
			return obj && obj.__esModule ? obj : { default: obj };
		}
	
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
				this.views = {
					menu: new _menu2.default(),
					main: new _main2.default()
				};
				this.views.menu.$el.appendTo("#container");
				this.views.main.$el.appendTo("#container");
				this.router = new Router({
					app: this
				});
				this.router.app = this;
				Backbone.history.start();
	
				$("[formaction='drawer/toggle']").on("click", function () {
					var $aside = $("aside");
					var isExpanded = $aside.attr("aria-expanded") === "true" ? "false" : "true";
					$aside.attr("aria-expanded", isExpanded);
				});
			}
		};
	
		var router = new Router();
	
		exports.default = app;
	
		/***/
	},
	/* 6 */
	/***/function (module, exports) {
	
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
	
		/***/
	},
	/* 7 */
	/***/function (module, exports) {
	
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
			collection: new Backbone.Collection(),
			initialize: function initialize() {
				this.listenTo(this.collection, "reset", this.render);
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
				return result;
			},
			render: function render() {
				this.$el.html('<table></table>');
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
					buttons: ['colvis'],
					scrollX: "100%",
					scrollY: "calc(100vh - 7em)",
					deferRender: true,
					scroller: true,
					data: json,
					columns: this.getCols(json)
				};
				this.$("table").DataTable(config);
				return this;
			},
			setDoctype: function setDoctype(doctype) {
				var _this = this;
	
				this.doctype = doctype;
				cozysdk.queryView(doctype.toLowerCase(), "all", {}).then(function (data) {
					_this.collection.reset(data.map(function (record) {
						return record.value;
					}));
				}).catch(function (err) {
					console.error(err, "error while fetching doctype");
				});
			}
		});
	
		/***/
	},
	/* 8 */
	/***/function (module, exports, __webpack_require__) {
	
		"use strict";
	
		Object.defineProperty(exports, "__esModule", {
			value: true
		});
	
		var _menu = __webpack_require__(6);
	
		var _menu2 = _interopRequireDefault(_menu);
	
		function _interopRequireDefault(obj) {
			return obj && obj.__esModule ? obj : { default: obj };
		}
	
		exports.default = Backbone.View.extend({
			el: "aside",
			collection: new _menu2.default(),
			initialize: function initialize() {
				this.collection.fetch().then(this.render.bind(this)).catch(function (err) {
					return console.error(err, "error while fetching menu collection");
				});
			},
	
			itemTemplate: _.template('<li><a class="<%= sclass %>" href="#doctype/<%= key %>"><%= key %> (<%= value %>)</a></li>'),
			render: function render() {
				var _this = this;
	
				var html = "<ul>";
				this.collection.forEach(function (model) {
					var json = model.toJSON();
					json.sclass = json.key === _this.selected ? "selected" : "";
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
	
		/***/
	}
	/******/]);
	//# sourceMappingURL=app.js.map

/***/ },

/***/ 10:
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	__webpack_require__(!(function webpackMissingModule() { var e = new Error("Cannot find module \"../src/initialize\""); e.code = 'MODULE_NOT_FOUND'; throw e; }()));
	
	// replace cozysdk with a standalone version
	window.cozysdk.queryView = function (type) {
	    return new Promise(function (resolve, reject) {
	        if (type === "doctypes") {
	            resolve([{ "key": "Access", "value": 17 }, { "key": "album", "value": 3 }, { "key": "application", "value": 16 }, { "key": "bank", "value": 46 }, { "key": "bill", "value": 34 }, { "key": "Binary", "value": 5678 }, { "key": "Bookmark", "value": 1 }, { "key": "commit", "value": 141 }, { "key": "contact", "value": 396 }, { "key": "CozyInstance", "value": 1 }, { "key": "Device", "value": 1 }, { "key": "event", "value": 2 }, { "key": "FavoriteTag", "value": 2 }, { "key": "Feed", "value": 3 }, { "key": "file", "value": 144 }, { "key": "File", "value": 1874 }, { "key": "folder", "value": 12 }, { "key": "Folder", "value": 1 }, { "key": "haste", "value": 1 }, { "key": "hastesettings", "value": 1 }, { "key": "indexdefinition", "value": 3 }, { "key": "konnector", "value": 48 }, { "key": "kresusconfig", "value": 4 }, { "key": "Mood", "value": 1 }, { "key": "Note", "value": 4 }, { "key": "phonebill", "value": 9 }, { "key": "photo", "value": 14 }, { "key": "StackApplication", "value": 4 }, { "key": "tag", "value": 7 }, { "key": "Task", "value": 1 }, { "key": "tasky", "value": 16 }, { "key": "Tasky", "value": 15 }, { "key": "TodoList", "value": 1 }, { "key": "toread", "value": 191 }, { "key": "Tree", "value": 1 }, { "key": "twittertweet", "value": 175 }, { "key": "User", "value": 1 }, { "key": "usetracker", "value": 742 }, { "key": "UseTracker", "value": 898 }, { "key": "WebDAVAccount", "value": 1 }, { "key": "ZFParam", "value": 4 }]);
	        } else {
	            resolve([{ value: { id: "toto", alias: "contact alias" } }]);
	        }
	    });
	};

/***/ }

/******/ });
//# sourceMappingURL=main.js.map