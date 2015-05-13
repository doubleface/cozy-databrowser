(function() {
  'use strict';

  var globals = typeof window === 'undefined' ? global : window;
  if (typeof globals.require === 'function') return;

  var modules = {};
  var cache = {};
  var has = ({}).hasOwnProperty;

  var aliases = {};

  var endsWith = function(str, suffix) {
    return str.indexOf(suffix, str.length - suffix.length) !== -1;
  };

  var unalias = function(alias, loaderPath) {
    var start = 0;
    if (loaderPath) {
      if (loaderPath.indexOf('components/' === 0)) {
        start = 'components/'.length;
      }
      if (loaderPath.indexOf('/', start) > 0) {
        loaderPath = loaderPath.substring(start, loaderPath.indexOf('/', start));
      }
    }
    var result = aliases[alias + '/index.js'] || aliases[loaderPath + '/deps/' + alias + '/index.js'];
    if (result) {
      return 'components/' + result.substring(0, result.length - '.js'.length);
    }
    return alias;
  };

  var expand = (function() {
    var reg = /^\.\.?(\/|$)/;
    return function(root, name) {
      var results = [], parts, part;
      parts = (reg.test(name) ? root + '/' + name : name).split('/');
      for (var i = 0, length = parts.length; i < length; i++) {
        part = parts[i];
        if (part === '..') {
          results.pop();
        } else if (part !== '.' && part !== '') {
          results.push(part);
        }
      }
      return results.join('/');
    };
  })();
  var dirname = function(path) {
    return path.split('/').slice(0, -1).join('/');
  };

  var localRequire = function(path) {
    return function(name) {
      var absolute = expand(dirname(path), name);
      return globals.require(absolute, path);
    };
  };

  var initModule = function(name, definition) {
    var module = {id: name, exports: {}};
    cache[name] = module;
    definition(module.exports, localRequire(name), module);
    return module.exports;
  };

  var require = function(name, loaderPath) {
    var path = expand(name, '.');
    if (loaderPath == null) loaderPath = '/';
    path = unalias(name, loaderPath);

    if (has.call(cache, path)) return cache[path].exports;
    if (has.call(modules, path)) return initModule(path, modules[path]);

    var dirIndex = expand(path, './index');
    if (has.call(cache, dirIndex)) return cache[dirIndex].exports;
    if (has.call(modules, dirIndex)) return initModule(dirIndex, modules[dirIndex]);

    throw new Error('Cannot find module "' + name + '" from '+ '"' + loaderPath + '"');
  };

  require.alias = function(from, to) {
    aliases[to] = from;
  };

  require.register = require.define = function(bundle, fn) {
    if (typeof bundle === 'object') {
      for (var key in bundle) {
        if (has.call(bundle, key)) {
          modules[key] = bundle[key];
        }
      }
    } else {
      modules[bundle] = fn;
    }
  };

  require.list = function() {
    var result = [];
    for (var item in modules) {
      if (has.call(modules, item)) {
        result.push(item);
      }
    }
    return result;
  };

  require.brunch = true;
  globals.require = require;
})();
require.register("application", function(exports, require, module) {
module.exports = {
  initialize: function() {
    var Router, e, locales;
    Router = require('router');
    this.router = new Router();
    this.locale = window.locale;
    delete window.locale;
    this.polyglot = new Polyglot();
    try {
      locales = require('locales/' + this.locale);
    } catch (_error) {
      e = _error;
      locales = require('locales/en');
    }
    this.polyglot.extend(locales);
    window.t = this.polyglot.t.bind(this.polyglot);
    return Backbone.history.start();
  }
};
});

;require.register("collections/doctype_collection", function(exports, require, module) {
var DoctypeCollection,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

module.exports = DoctypeCollection = (function(_super) {
  __extends(DoctypeCollection, _super);

  function DoctypeCollection() {
    return DoctypeCollection.__super__.constructor.apply(this, arguments);
  }

  DoctypeCollection.prototype.model = require('../models/doctype_model');

  DoctypeCollection.prototype.url = 'doctypes';

  return DoctypeCollection;

})(Backbone.Collection);
});

;require.register("collections/result_collection", function(exports, require, module) {
var ResultCollection,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

module.exports = ResultCollection = (function(_super) {
  __extends(ResultCollection, _super);

  function ResultCollection() {
    return ResultCollection.__super__.constructor.apply(this, arguments);
  }

  ResultCollection.prototype.model = require('../models/result_model');

  ResultCollection.prototype.page = 1;

  ResultCollection.prototype.nbPerPage = 10;

  ResultCollection.prototype.url = function() {
    var paramNbPerPage, paramPage, query;
    query = '';
    paramNbPerPage = '';
    if (this.nbPerPage > 0) {
      paramNbPerPage = 'nbperpage=' + this.nbPerPage;
    }
    paramPage = this.page > 0 ? 'page=' + this.page : '';
    if (paramPage !== '' && paramNbPerPage !== '') {
      query = '?' + paramPage + '&' + paramNbPerPage;
    }
    return 'search' + query;
  };

  ResultCollection.prototype.fields = function() {
    var out;
    out = {};
    this.each(function(model) {
      var desc, field, _i, _len, _ref, _ref1, _results;
      _ref = Object.keys(model.toJSON());
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        field = _ref[_i];
        if (field === "count" || field === "descField" || field === "displayName" || field === "idField") {
          continue;
        }
        desc = (_ref1 = model.get('descField')) != null ? _ref1[field] : void 0;
        _results.push(out[field] != null ? out[field] : out[field] = {
          cdbFieldDescription: (desc != null ? desc.description : void 0) || '',
          cdbFieldName: (desc != null ? desc.displayName : void 0) || field
        });
      }
      return _results;
    });
    return out;
  };

  return ResultCollection;

})(Backbone.Collection);
});

;require.register("helpers/oLocalStorageHelper", function(exports, require, module) {
module.exports = {
  keys: {
    isMetaInfoVisible: 'ismetainfovisible',
    isListPresentation: 'istablepresentation',
    separator: '.'
  },
  getBoolean: function(key) {
    var value;
    value = localStorage.getItem(key);
    if (value && JSON.parse(value)) {
      return true;
    } else {
      return false;
    }
  },
  setBoolean: function(key, value) {
    if (typeof value === 'boolean') {
      return localStorage.setItem(key, JSON.stringify(value));
    } else {
      return localStorage.setItem(key("false"));
    }
  }
};
});

;require.register("initialize", function(exports, require, module) {
var app;

app = require('application');

$(function() {
  require('lib/app_helpers');
  return app.initialize();
});
});

;require.register("lib/app_helpers", function(exports, require, module) {
(function() {
  return (function() {
    var console, dummy, method, methods, _results;
    console = window.console = window.console || {};
    method = void 0;
    dummy = function() {};
    methods = 'assert,count,debug,dir,dirxml,error,exception, group,groupCollapsed,groupEnd,info,log,markTimeline, profile,profileEnd,time,timeEnd,trace,warn'.split(',');
    _results = [];
    while (method = methods.pop()) {
      _results.push(console[method] = console[method] || dummy);
    }
    return _results;
  })();
})();

(function() {
  return $.fn.spin = function(opts, color) {
    var presets;
    presets = {
      tiny: {
        lines: 8,
        length: 2,
        width: 2,
        radius: 3
      },
      small: {
        lines: 8,
        length: 1,
        width: 2,
        radius: 5
      },
      large: {
        lines: 10,
        length: 8,
        width: 4,
        radius: 8
      }
    };
    if (Spinner) {
      return this.each(function() {
        var $this, spinner;
        $this = $(this);
        spinner = $this.data("spinner");
        if (spinner != null) {
          spinner.stop();
          return $this.data("spinner", null);
        } else if (opts !== false) {
          if (typeof opts === "string") {
            if (opts in presets) {
              opts = presets[opts];
            } else {
              opts = {};
            }
            if (color) {
              opts.color = color;
            }
          }
          spinner = new Spinner($.extend({
            color: $this.css("color")
          }, opts));
          spinner.spin(this);
          return $this.data("spinner", spinner);
        }
      });
    } else {
      console.log("Spinner class not available.");
      return null;
    }
  };
})();
});

;require.register("lib/base_view", function(exports, require, module) {
var BaseView,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

module.exports = BaseView = (function(_super) {
  __extends(BaseView, _super);

  function BaseView() {
    return BaseView.__super__.constructor.apply(this, arguments);
  }

  BaseView.prototype.template = function() {};

  BaseView.prototype.initialize = function() {};

  BaseView.prototype.getRenderData = function() {
    var _ref;
    return {
      model: (_ref = this.model) != null ? _ref.toJSON() : void 0
    };
  };

  BaseView.prototype.render = function() {
    this.beforeRender();
    this.$el.html(this.template(this.getRenderData()));
    this.afterRender();
    return this;
  };

  BaseView.prototype.beforeRender = function() {};

  BaseView.prototype.afterRender = function() {};

  BaseView.prototype.destroy = function() {
    this.undelegateEvents();
    this.$el.removeData().unbind();
    this.remove();
    return Backbone.View.prototype.remove.call(this);
  };

  return BaseView;

})(Backbone.View);
});

;require.register("lib/view", function(exports, require, module) {
var View,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

module.exports = View = (function(_super) {
  __extends(View, _super);

  function View() {
    return View.__super__.constructor.apply(this, arguments);
  }

  View.prototype.template = function() {};

  View.prototype.initialize = function() {};

  View.prototype.render = function(templateOptions) {
    var render;
    this.beforeRender();
    render = this.template().call(null, templateOptions);
    this.$el.html(render);
    this.afterRender();
    return this;
  };

  View.prototype.beforeRender = function() {};

  View.prototype.afterRender = function() {};

  View.prototype.destroy = function() {
    this.undelegateEvents();
    this.$el.removeData().unbind();
    this.remove();
    return Backbone.View.prototype.remove.call(this);
  };

  return View;

})(Backbone.View);
});

;require.register("lib/view_collection", function(exports, require, module) {
var BaseView, ViewCollection,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

BaseView = require('lib/base_view');

module.exports = ViewCollection = (function(_super) {
  __extends(ViewCollection, _super);

  function ViewCollection() {
    this.removeItem = __bind(this.removeItem, this);
    this.addItem = __bind(this.addItem, this);
    return ViewCollection.__super__.constructor.apply(this, arguments);
  }

  ViewCollection.prototype.itemview = null;

  ViewCollection.prototype.views = {};

  ViewCollection.prototype.template = function() {
    return '';
  };

  ViewCollection.prototype.itemViewOptions = function() {};

  ViewCollection.prototype.collectionEl = null;

  ViewCollection.prototype.onChange = function() {
    return this.$el.toggleClass('empty', _.size(this.views) === 0);
  };

  ViewCollection.prototype.appendView = function(view) {
    return this.$collectionEl.append(view.el);
  };

  ViewCollection.prototype.initialize = function() {
    var collectionEl;
    this.count = 0;
    this.deleted = 0;
    ViewCollection.__super__.initialize.apply(this, arguments);
    this.views = {};
    this.listenTo(this.collection, "reset", this.onReset);
    this.listenTo(this.collection, "add", this.addItem);
    this.listenTo(this.collection, "remove", this.removeItem);
    if (this.collectionEl == null) {
      return collectionEl = el;
    }
  };

  ViewCollection.prototype.render = function() {
    var id, view, _ref;
    _ref = this.views;
    for (id in _ref) {
      view = _ref[id];
      view.$el.detach();
    }
    return ViewCollection.__super__.render.apply(this, arguments);
  };

  ViewCollection.prototype.afterRender = function() {
    var id, view, _ref;
    this.$collectionEl = $(this.collectionEl);
    this.$collectionEl.empty();
    _ref = this.views;
    for (id in _ref) {
      view = _ref[id];
      this.appendView(view);
    }
    this.onReset(this.collection);
    return this.onChange(this.views);
  };

  ViewCollection.prototype.remove = function() {
    this.onReset([]);
    return ViewCollection.__super__.remove.apply(this, arguments);
  };

  ViewCollection.prototype.onReset = function(newcollection) {
    var id, view, _ref;
    _ref = this.views;
    for (id in _ref) {
      view = _ref[id];
      view.remove();
    }
    return newcollection.forEach(this.addItem);
  };

  ViewCollection.prototype.addItem = function(model) {
    var options, view;
    this.count++;
    model.set("count", this.count);
    options = _.extend({}, {
      model: model
    }, this.itemViewOptions(model));
    view = new this.itemview(options);
    this.views[model.cid] = view.render();
    this.appendView(view);
    return this.onChange(this.views);
  };

  ViewCollection.prototype.removeItem = function(model) {
    this.deleted++;
    this.views[model.cid].remove();
    delete this.views[model.cid];
    return this.onChange(this.views);
  };

  return ViewCollection;

})(BaseView);
});

;require.register("locales/en", function(exports, require, module) {
module.exports = {
  "all": "All",
  "applications": "Applications",
  "currently exploring": "Currently exploring",
  "confirmation required": "Confirmation required",
  "are you absolutely sure": "Are you ABSOLUTELY sure ?\nIt could lead to IRREVERSIBLE DAMAGES to your cozy environment.",
  "delete permanently": "Delete permanently",
  "cancel": "Cancel",
  "load more results": "load more results",
  "delete all": "Delete all",
  "search-placeholder": "Search ...",
  "about": "About",
  "applications using it": "Applications using it",
  "fields information": "Fields information",
  "sources": "sources",
  "welcome title": "Welcome to your data explorer",
  "welcome message part1": "This application allows you to find any data in your cozy environement.",
  "welcome message part2": "Please, explore the menu and select a type of document that you want to retrieve.",
  "button toggle visibility": "Show / Hide columns"
};
});

;require.register("locales/fr", function(exports, require, module) {
module.exports = {
  "all": "Tous",
  "applications": "Applications",
  "currently exploring": "Vue actuelle",
  "confirmation required": "Confirmation requise",
  "are you absolutely sure": "Etes vous VRAIMENT sûr ?\nCela peut causer des DOMMAGES IRREVERSIBLES à votre Cozy.",
  "delete permanently": "Supprimer définitivement",
  "cancel": "Annuler",
  "load more results": "Charger plus de résultats",
  "delete all": "Tout supprimer",
  "search-placeholder": "Recherche ...",
  "about": "A propos de",
  "applications using it": "Applications l'utilisant",
  "fields information": "Information sur les champs",
  "sources": "sources",
  "welcome title": "Bienvenue sur votre explorateur de données",
  "welcome message part1": "Cette application vous permet de visualiser toutes les données présentes dans votre Cozy.",
  "welcome message part2": "Déroulez le menu et sélectionnez un type de données pour consulter les documents en relation.",
  "button toggle visibility": "Montrer / Cacher des colonnes"
};
});

;require.register("models/delete_all_model", function(exports, require, module) {
var DoctypeDeleteAllModel,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

module.exports = DoctypeDeleteAllModel = (function(_super) {
  __extends(DoctypeDeleteAllModel, _super);

  function DoctypeDeleteAllModel() {
    return DoctypeDeleteAllModel.__super__.constructor.apply(this, arguments);
  }

  DoctypeDeleteAllModel.prototype.urlRoot = 'doctype_delete_all';

  return DoctypeDeleteAllModel;

})(Backbone.Model);
});

;require.register("models/doctype_model", function(exports, require, module) {
var DoctypeModel,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

module.exports = DoctypeModel = (function(_super) {
  __extends(DoctypeModel, _super);

  function DoctypeModel() {
    return DoctypeModel.__super__.constructor.apply(this, arguments);
  }

  DoctypeModel.prototype.rootUrl = "doctypes";

  return DoctypeModel;

})(Backbone.Model);
});

;require.register("models/meta_infos_model", function(exports, require, module) {
var DoctypeMetaInfosModel,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

module.exports = DoctypeMetaInfosModel = (function(_super) {
  __extends(DoctypeMetaInfosModel, _super);

  function DoctypeMetaInfosModel() {
    return DoctypeMetaInfosModel.__super__.constructor.apply(this, arguments);
  }

  DoctypeMetaInfosModel.prototype.urlRoot = 'doctype_meta_infos';

  return DoctypeMetaInfosModel;

})(Backbone.Model);
});

;require.register("models/result_model", function(exports, require, module) {
var ResultModel,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

module.exports = ResultModel = (function(_super) {
  __extends(ResultModel, _super);

  function ResultModel() {
    return ResultModel.__super__.constructor.apply(this, arguments);
  }

  ResultModel.prototype.urlRoot = "search";

  return ResultModel;

})(Backbone.Model);
});

;require.register("router", function(exports, require, module) {
var DoctypeNavCollectionView, Router, SearchView,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

DoctypeNavCollectionView = require('views/doctype_nav_collection_view');

SearchView = require('views/search_view');

module.exports = Router = (function(_super) {
  __extends(Router, _super);

  function Router() {
    return Router.__super__.constructor.apply(this, arguments);
  }

  Router.prototype.routes = {
    '': 'search',
    'search': 'search',
    'search/all/:doctype': 'search'
  };

  Router.prototype.initialize = function() {
    var doctypeNavCollectionView;
    doctypeNavCollectionView = new DoctypeNavCollectionView();
    return doctypeNavCollectionView.render();
  };

  Router.prototype.search = function(query) {
    var decodedQuery, doctypeQuery, options, parsedQuery, searchView, splittedQuery;
    options = {};
    if (query != null) {
      splittedQuery = query.split('&&');
      doctypeQuery = splittedQuery[0];
      decodedQuery = decodeURIComponent(doctypeQuery);
      if (!/\|/.test(decodedQuery)) {
        options['doctypes'] = [doctypeQuery];
      } else {
        options['doctypes'] = decodedQuery.split(/\|/);
      }
      options['range'] = 'all';
      if (splittedQuery.length > 1) {
        parsedQuery = this.parseQueryString(splittedQuery[1]);
        if (parsedQuery.presentation != null) {
          options['presentation'] = parsedQuery.presentation;
        }
      }
    }
    searchView = new SearchView(options);
    return searchView.render();
  };

  Router.prototype.parseQueryString = function(queryString) {
    var params;
    params = {};
    if (queryString) {
      _.each(_.map(decodeURI(queryString).split(/&/g), function(el, i) {
        var aux, o, val;
        aux = el.split("=");
        o = {};
        if (aux.length >= 1) {
          val = 'undefined';
          if (aux.length === 2) {
            val = aux[1];
          }
          o[aux[0]] = val;
        }
        return o;
      }), function(o) {
        return _.extend(params, o);
      });
    }
    return params;
  };

  return Router;

})(Backbone.Router);
});

;require.register("views/doctype_nav_collection_view", function(exports, require, module) {
var DoctypeCollection, DoctypeNavCollectionView, DoctypeNavView, ViewCollection,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

ViewCollection = require('../lib/view_collection');

DoctypeCollection = require('../collections/doctype_collection');

DoctypeNavView = require('./doctype_nav_view');

module.exports = DoctypeNavCollectionView = (function(_super) {
  __extends(DoctypeNavCollectionView, _super);

  function DoctypeNavCollectionView() {
    return DoctypeNavCollectionView.__super__.constructor.apply(this, arguments);
  }

  DoctypeNavCollectionView.prototype.itemview = DoctypeNavView;

  DoctypeNavCollectionView.prototype.collection = new DoctypeCollection();

  DoctypeNavCollectionView.prototype.collectionEl = '#doctype-nav-collection-view';

  DoctypeNavCollectionView.prototype.el = '#doctype-nav-collection-view';

  DoctypeNavCollectionView.prototype.lastSlimScrolled = null;

  DoctypeNavCollectionView.prototype.events = {
    'click a': 'activateMenuElement',
    'mouseenter .doctype-list-item': 'showMinimizedMenu'
  };

  DoctypeNavCollectionView.prototype.initialize = function() {
    this.bindMenuResponsive();
    this.collection.fetch({
      data: $.param({
        'menu': true
      })
    });
    this.views = {};
    this.listenTo(this.collection, "reset", this.onReset);
    return DoctypeNavCollectionView.__super__.initialize.apply(this, arguments);
  };

  DoctypeNavCollectionView.prototype.showMinimizedMenu = function(event) {
    var jqLiContainer, jqSubmenu;
    jqLiContainer = $(event.currentTarget);
    return jqSubmenu = jqLiContainer.find(' .submenu:eq(0)');
  };

  DoctypeNavCollectionView.prototype.activateMenuElement = function(event) {
    var hasSubmenu, isDirectLink, jqMenuLink, jqParentUl, jqSubmenu, parentLi, parentsLi, submenuIsVisible;
    jqMenuLink = $(event.target);
    parentLi = jqMenuLink.parent('li');
    parentsLi = jqMenuLink.parentsUntil('#doctype-nav-collection-view', 'li');
    jqSubmenu = parentLi.find('> .submenu');
    jqParentUl = jqSubmenu.parent().closest('ul');
    isDirectLink = !jqMenuLink.hasClass('dropdown-toggle');
    hasSubmenu = jqSubmenu.length > 0;
    if (!isDirectLink) {
      this.destroySlimscrolls();
      if ((this.lastSlimScrolled != null) && (this.lastSlimScrolled !== jqSubmenu)) {
        this.lastSlimScrolled = null;
      } else {
        this.lastSlimScrolled = jqSubmenu;
      }
    }
    if (!hasSubmenu) {
      $('#doctype-nav-collection-view li').removeClass('active');
      parentsLi.addClass('active');
      parentLi.addClass('active');
    }
    if (isDirectLink) {
      return;
    }
    submenuIsVisible = jqSubmenu.is(':visible');
    if (!submenuIsVisible) {
      jqParentUl.find('.open').find('.submenu').each(function() {
        if ($(this) !== jqSubmenu) {
          return $(this).slideUp(200).closest('li').removeClass('open');
        }
      });
      this.applySlimscroll(jqSubmenu);
    }
    return false;
  };

  DoctypeNavCollectionView.prototype.applySlimscroll = function(jqSubmenu) {
    var bSlimScollExist, fullHeight, hasParentSubmenu, hasSubmenu, isFirstSubmenu, maxHeightOfMenu, menuHeight, navHeight, navlistHeight, parentSubmenu, searchHeight, triggerEnter, winHeight;
    this.destroySlimscrolls();
    hasSubmenu = jqSubmenu.length > 0;
    hasParentSubmenu = jqSubmenu.parent().closest('.submenu').length > 0;
    isFirstSubmenu = hasSubmenu && !hasParentSubmenu;
    searchHeight = $('.nav-search:eq(0)').height();
    navlistHeight = $('.nav-list > li').length * 46;
    navHeight = navlistHeight + searchHeight;
    if (this.isMenuMinimized) {
      navHeight = searchHeight + 25;
    }
    menuHeight = jqSubmenu.height();
    fullHeight = navHeight + menuHeight;
    winHeight = $(window).height();
    maxHeightOfMenu = winHeight - navHeight;
    parentSubmenu = jqSubmenu.parent().closest('.submenu');
    bSlimScollExist = false;
    if (isFirstSubmenu && fullHeight > winHeight) {
      jqSubmenu.slimScroll({
        height: maxHeightOfMenu + 'px'
      });
      bSlimScollExist = true;
    } else if (parentSubmenu.length > 0 && !isFirstSubmenu) {
      if (fullHeight + parentSubmenu.height() > winHeight) {
        parentSubmenu.slimScroll({
          height: maxHeightOfMenu + 'px'
        });
        triggerEnter = function() {
          return parentSubmenu.mouseenter();
        };
        setTimeout(triggerEnter, 200);
        bSlimScollExist = true;
      }
    }
    if (bSlimScollExist) {
      return this.lastSlimScrolled = jqSubmenu;
    }
  };

  DoctypeNavCollectionView.prototype.bindMenuResponsive = function() {
    $('#menu-toggler').on('click', function() {
      $('#sidebar').toggleClass('display');
      $(this).toggleClass('display');
      return false;
    });
    return $(window).resize((function(_this) {
      return function() {
        if (_this.lastSlimScrolled != null) {
          return _this.applySlimscroll(_this.lastSlimScrolled);
        }
      };
    })(this));
  };

  DoctypeNavCollectionView.prototype.destroySlimscrolls = function() {
    return $('.slimScrollDiv').each(function() {
      var jqObj;
      jqObj = $(this).children('ul');
      jqObj.css({
        'height': 'auto'
      });
      jqObj.parent().unbind();
      jqObj.parent().undelegate();
      return jqObj.parent().replaceWith(jqObj);
    });
  };

  return DoctypeNavCollectionView;

})(ViewCollection);
});

;require.register("views/doctype_nav_view", function(exports, require, module) {
var DoctypeNavView, View,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

View = require('./../lib/view');

module.exports = DoctypeNavView = (function(_super) {
  __extends(DoctypeNavView, _super);

  function DoctypeNavView() {
    return DoctypeNavView.__super__.constructor.apply(this, arguments);
  }

  DoctypeNavView.prototype.tagName = 'li';

  DoctypeNavView.prototype.className = 'doctype-list-item';

  DoctypeNavView.prototype.render = function() {
    return DoctypeNavView.__super__.render.call(this, {
      category: this.model.get('name'),
      value: this.model.get('value'),
      icons: {
        all: 'icon-list',
        applications: 'icon-download-alt',
        sources: 'icon-book'
      }
    });
  };

  DoctypeNavView.prototype.template = function() {
    return require('./templates/doctype_nav');
  };

  return DoctypeNavView;

})(View);
});

;require.register("views/result_collection_view", function(exports, require, module) {
var ResultCollection, ResultCollectionView, ResultView, TableResultView, ViewCollection,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

ViewCollection = require('../lib/view_collection');

ResultCollection = require('../collections/result_collection');

ResultView = require('./result_list_view');

TableResultView = require('./result_table_view');

module.exports = ResultCollectionView = (function(_super) {
  __extends(ResultCollectionView, _super);

  function ResultCollectionView() {
    return ResultCollectionView.__super__.constructor.apply(this, arguments);
  }

  ResultCollectionView.prototype.itemview = TableResultView;

  ResultCollectionView.prototype.collectionEl = '#result-view-as-table';

  ResultCollectionView.prototype.isLoading = false;

  ResultCollectionView.prototype.noMoreItems = false;

  ResultCollectionView.prototype.firstRender = true;

  ResultCollectionView.prototype.initialize = function(options) {
    this.options = options;
    this.collection = new ResultCollection();
    if (this.options.presentation != null) {
      switch (this.options.presentation) {
        case 'list':
          this.itemview = ResultView;
          this.collectionEl = '#basic-accordion';
          break;
        case 'table':
          this.itemview = TableResultView;
          this.collectionEl = '#result-view-as-table';
          break;
        default:
          this.itemview = TableResultView;
          this.collectionEl = '#result-view-as-table';
      }
    }
    ResultCollectionView.__super__.initialize.apply(this, arguments);
    if (this.options.doctypes != null) {
      if (this.options.presentation === 'table') {
        $('#results-list').undelegate('th .icon-eye-close', 'click');
        $('#results-list').undelegate('button.show-col', 'click');
      }
      this.isLoading = true;
      return this.collection.fetch({
        reset: true,
        data: $.param(this.options),
        success: (function(_this) {
          return function(col, data) {
            _this.isLoading = false;
            $('.loading-image').remove();
            if ((_this.options.range != null) && (_this.options.doctypes != null)) {
              if (data.length === _this.collection.nbPerPage) {
                _this.loopFirstScroll();
                return $('.load-more-result').show();
              } else {
                _this.noMoreItems = true;
                if (_this.options.presentation === "list") {
                  _this.collection.forEach(_this.removeItem);
                }
                if (_this.options.presentation === "table") {
                  _this.buildTable(_this.firstRender);
                }
                _this.collection.forEach(_this.addItem);
                return $('.load-more-result').hide();
              }
            }
          };
        })(this),
        error: (function(_this) {
          return function() {
            _this.isLoading = false;
            $('.loading-image').remove();
            _this.noMoreItems = true;
            return _this.displayLoadingError();
          };
        })(this)
      });
    }
  };

  ResultCollectionView.prototype.onReset = function() {

    /*
    if @oldFields?
        console.log "reset", Object.keys(@oldFields).length
    else
        console.log "reset", null
     */
    this.oldFields = this.collection.fields();
    if (this.options.presentation === 'table') {
      this.buildTable(this.firstRender);
    }
    return ResultCollectionView.__super__.onReset.apply(this, arguments);
  };

  ResultCollectionView.prototype.render = function() {
    $('.introduction').hide();
    if (this.options.presentation === 'table') {
      if (this.firstRender) {
        this.buildTable(true);
        this.firstRender = false;
      }
    }
    if (this.isLoading) {
      $('#all-result').append("<div class=\"loading-image\">\n    <img src=\"images/ajax-loader.gif\" />\n</div>");
    }
    return ResultCollectionView.__super__.render.apply(this, arguments);
  };

  ResultCollectionView.prototype.appendView = function(view) {
    if (this.options.presentation === 'table') {
      return $('#result-view-as-table').dataTable().fnAddTr(view.$el[0]);
    } else {
      return ResultCollectionView.__super__.appendView.apply(this, arguments);
    }
  };

  ResultCollectionView.prototype.itemViewOptions = function() {
    return {
      fields: this.collection.fields()
    };
  };

  ResultCollectionView.prototype.search = function(content) {
    this.options['query'] = content;
    return this.collection.fetch({
      data: $.param(this.options)
    });
  };

  ResultCollectionView.prototype.loadNextPage = function(isTriggered, callback) {
    this.options['deleted'] = this.deleted;
    if (!this.noMoreItems) {
      this.isLoading = true;
      this.collection.page++;
      if (!isTriggered) {
        $('.load-more-result i, .load-more-result span').hide();
        $('.load-more-result').spin('tiny');
      }
      return this.collection.fetch({
        data: $.param(this.options),
        remove: false,
        success: (function(_this) {
          return function(col, data) {
            var isDone;
            if (data.length != null) {
              if (!isTriggered) {
                $('.load-more-result .spinner').hide();
                $('.load-more-result i').show();
                $('.load-more-result span').show();
              }
              isDone = data.length < _this.collection.nbPerPage;
              _this.noMoreItems = isDone;
              if (_this.noMoreItems) {
                $('.load-more-result').hide();
              }
              _this.isLoading = false;
              if (Object.keys(_this.oldFields).length !== Object.keys(_this.collection.fields()).length) {
                _this.oldFields = _this.collection.fields();
                if (_this.options.presentation === "list") {
                  _this.collection.forEach(_this.removeItem);
                }
                if (_this.options.presentation === "table") {
                  _this.buildTable(_this.firstRender);
                }
                _this.collection.forEach(_this.addItem);
              }
              if (_this.noMoreItems) {
                if (_this.options.presentation === "list") {
                  _this.collection.forEach(_this.removeItem);
                }
                if (_this.options.presentation === "table") {
                  _this.buildTable(_this.firstRender);
                }
                _this.collection.forEach(_this.addItem);
              }
              if (callback != null) {
                return callback();
              }
            } else {
              _this.noMoreItems = true;
              if (_this.options.presentation === "table") {
                return _this.buildTable(_this.firstRender);
              }
            }
          };
        })(this),
        error: function() {
          this.isLoading = false;
          this.noMoreItems = true;
          return this.displayLoadingError();
        }
      });
    }
  };

  ResultCollectionView.prototype.loopFirstScroll = function() {
    var firstScroll;
    if (!this.isLoading && !this.noMoreItems) {
      firstScroll = $(document).height() === $(window).height();
      if (firstScroll) {
        return this.loadNextPage(true, (function(_this) {
          return function() {
            return _this.loopFirstScroll();
          };
        })(this));
      }
    }
  };

  ResultCollectionView.prototype.displayLoadingError = function() {
    var errorMsg;
    $('.load-more-result').css({
      'color': '#AF4434'
    });
    $('.load-more-result i').hide();
    errorMsg = 'An error occurs during the loading process';
    $('.load-more-result span').text(errorMsg);
    return $('.load-more-result').show();
  };

  ResultCollectionView.prototype.makeTHead = function() {
    var display, field, fieldname, htmlThead, title, _ref;
    $('#result-view-as-table').find('thead').remove();
    htmlThead = '<thead><tr>';
    _ref = this.itemViewOptions().fields;
    for (fieldname in _ref) {
      field = _ref[fieldname];
      display = field.cdbFieldName;
      title = field.cdbFieldDescription;
      htmlThead += "<th class=\"cozy_" + fieldname + "\"\n    title=\"" + title + "\">\n    " + display + "\n</th>";
    }
    htmlThead += '<th class="action">Action</th>';
    htmlThead += '</tr></thead>';
    return $('#result-view-as-table').prepend(htmlThead);
  };

  ResultCollectionView.prototype.buildTable = function(firstRender) {
    var storedPath, table;
    if (!firstRender) {
      table = $('#result-view-as-table').dataTable();
      table.fnDestroy();
      $('#result-view-as-table tr').remove();
    }
    this.makeTHead();
    storedPath = 'DataTables_' + window.location.hash;
    return $('#result-view-as-table').dataTable({
      "bRetrieve": !firstRender,
      "bPaginate": false,
      "aoColumnDefs": [
        {
          bSortable: this.noMoreItems,
          aTargets: ['_all']
        }, {
          bSortable: false,
          aTargets: ['cozy_docType', 'action']
        }, {
          bVisible: false,
          aTargets: ['cozy__id', 'cozy_docType']
        }
      ],
      "oColVis": {
        "iOverlayFade": 200,
        buttonText: t('button toggle visibility')
      },
      "sDom": 'CRt',
      "bStateSave": true,
      "fnStateSave": function(oSettings, oData) {
        var stringifiedData;
        stringifiedData = JSON.stringify(oData);
        return localStorage.setItem(storedPath, stringifiedData);
      },
      "fnStateLoad": function(oSettings) {
        var loadedData;
        loadedData = localStorage.getItem(storedPath);
        return JSON.parse(loadedData);
      }
    });
  };

  return ResultCollectionView;

})(ViewCollection);
});

;require.register("views/result_list_view", function(exports, require, module) {
var ResultView, View,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

View = require('./../lib/view');

module.exports = ResultView = (function(_super) {
  __extends(ResultView, _super);

  function ResultView() {
    this.render = __bind(this.render, this);
    return ResultView.__super__.constructor.apply(this, arguments);
  }

  ResultView.prototype.tagName = 'div';

  ResultView.prototype.className = 'panel panel-default';

  ResultView.prototype.templateModal = require('./templates/modal_confirm');

  ResultView.prototype.events = {
    'click .accordion-toggle': 'blurIt',
    'mouseenter .label': 'showFieldDescription',
    'mouseleave .label': 'showFieldDescription',
    'click .remove-result': 'confirmRemoveResult',
    'mouseover .remove-result': 'convertButtonToDanger',
    'mouseout .remove-result': 'convertButtonToClassic'
  };

  ResultView.prototype.template = function() {
    return require('./templates/result_list');
  };

  ResultView.prototype.render = function() {
    return ResultView.__super__.render.call(this, {
      results: this.manageResultsForView()
    });
  };

  ResultView.prototype.blurIt = function(e) {
    return $(e.currentTarget).blur();
  };

  ResultView.prototype.convertButtonToDanger = function(event) {
    var jqObj;
    jqObj = $(event.currentTarget);
    return jqObj.addClass('btn-danger');
  };

  ResultView.prototype.convertButtonToClassic = function(event) {
    var jqObj;
    jqObj = $(event.currentTarget);
    return jqObj.removeClass('btn-danger');
  };

  ResultView.prototype.confirmRemoveResult = function(e) {
    var data, that;
    that = this;
    e.preventDefault();
    data = {
      title: t('Confirmation required'),
      body: t('are you absolutely sure'),
      confirm: t('delete permanently')
    };
    $("body").prepend(this.templateModal(data));
    $("#confirmation-dialog").modal();
    $("#confirmation-dialog").modal("show");
    $("#confirmation-dialog-confirm").unbind('click');
    return $("#confirmation-dialog-confirm").bind("click", function() {
      return that.removeResult();
    });
  };

  ResultView.prototype.removeResult = function() {
    this.model.set('id', this.model.get('_id'));
    return this.model.destroy({
      data: 'id=' + this.model.get('id'),
      success: (function(_this) {
        return function() {
          return _this.render;
        };
      })(this)
    });
  };

  ResultView.prototype.manageResultsForView = function() {
    var attr, count, results;
    attr = this.model.attributes;
    count = this.model.get('count');
    results = {};
    if (attr.no_result != null) {
      $('#all-result .accordion').empty();
      results['no_result'] = true;
      results['no_result_msg'] = attr.no_result;
      return results;
    } else if (count === 0) {
      results['no_result'] = true;
      results['no_result_msg'] = 'No results.';
      return results;
    } else {
      results['no_result'] = false;
      results['count'] = count;
      results['heading'] = {
        'doctype': attr.displayName || attr.docType,
        'field': attr.idField != null ? attr.idField : 'id',
        'data': attr.idField != null ? attr[attr.idField] : attr._id
      };
      this.results = results;
      this.results['fields'] = this.prepareResultFields(attr);
      return this.results;
    }
  };

  ResultView.prototype.prepareResultFields = function(attr) {
    var dataId, descField, description, displayName, field, fieldName, fields, hasDisplayName, iCounter, isNativField, isSimpleObj, isSimpleType, newLi, obj, objName, settedField, simpleTypes, typeOfField, typeOfObj;
    iCounter = 0;
    fields = [];
    settedField = ['idField', 'count', 'descField', 'displayName'];
    simpleTypes = ['string', 'number', 'boolean'];
    for (fieldName in attr) {
      field = attr[fieldName];
      description = "";
      isNativField = ($.inArray(fieldName, settedField)) === -1;
      if (isNativField) {
        fields[iCounter] = {
          'cdbFieldDescription': "",
          'cdbFieldName': fieldName,
          'cdbFieldData': "",
          'cdbLabelClass': "label-secondary"
        };
        if ((attr.descField != null) && (attr.descField[fieldName] != null)) {
          if (attr.descField[fieldName].description != null) {
            description = attr.descField[fieldName].description;
            fields[iCounter]['cdbFieldDescription'] = description;
          }
          descField = attr.descField[fieldName];
          hasDisplayName = descField.displayName != null;
          if (hasDisplayName && descField.displayName !== "") {
            displayName = descField.displayName;
            fields[iCounter]['cdbFieldName'] = displayName;
            if (field === this.results['heading']['field']) {
              this.results['heading']['field'] = displayName;
            }
          }
        }
        typeOfField = typeof field;
        isSimpleType = ($.inArray(typeOfField, simpleTypes)) !== -1;
        if (isSimpleType) {
          dataId = 'cdbFieldData';
          if (fieldName === 'docType') {
            fields[iCounter][dataId] = attr.displayName || field;
          } else {
            fields[iCounter][dataId] = field;
          }
        } else if ((field != null) && typeOfField === 'object') {
          fields[iCounter]['cdbFieldData'] = '<ul class="sober-list">';
          for (objName in field) {
            obj = field[objName];
            newLi = '';
            typeOfObj = typeof obj;
            isSimpleObj = ($.inArray(typeOfObj, simpleTypes)) !== -1;
            if (isSimpleObj) {
              newLi = '<li>' + objName + ' : ';
              newLi += '<i>' + obj + '</i></li>';
              fields[iCounter]['cdbFieldData'] += newLi;
            } else if ((obj != null) && typeof obj === 'object') {
              newLi = '<li>' + objName + ' : ';
              newLi += '<i>' + JSON.stringify(obj) + '</i></li>';
              fields[iCounter]['cdbFieldData'] += newLi;
            } else {
              newLi = '<li><i>empty</i></li>';
              fields[iCounter]['cdbFieldData'] += newLi;
              fields[iCounter]['cdbLabelClass'] = 'label-danger';
            }
          }
          fields[iCounter]['cdbFieldData'] += '</ul>';
        } else {
          fields[iCounter]['cdbFieldData'] = '<i>empty</i>';
          fields[iCounter]['cdbLabelClass'] = 'label-danger';
        }
      }
      iCounter++;
    }
    return fields;
  };

  return ResultView;

})(View);
});

;require.register("views/result_table_view", function(exports, require, module) {
var ResultTableView, View,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

View = require('./../lib/view');

module.exports = ResultTableView = (function(_super) {
  __extends(ResultTableView, _super);

  function ResultTableView() {
    this.render = __bind(this.render, this);
    return ResultTableView.__super__.constructor.apply(this, arguments);
  }

  ResultTableView.prototype.tagName = 'tr';

  ResultTableView.prototype.templateModal = require('./templates/modal_confirm');

  ResultTableView.prototype.events = {
    'click .accordion-toggle': 'blurIt',
    'mouseenter .label': 'showFieldDescription',
    'mouseleave .label': 'showFieldDescription',
    'click .remove-result': 'confirmRemoveResult',
    'mouseover .remove-result': 'convertButtonToDanger',
    'mouseout .remove-result': 'convertButtonToClassic'
  };

  ResultTableView.prototype.initialize = function(options) {
    return this.fields = options.fields;
  };

  ResultTableView.prototype.convertButtonToDanger = function(event) {
    var jqObj;
    jqObj = $(event.currentTarget);
    return jqObj.addClass('btn-danger');
  };

  ResultTableView.prototype.convertButtonToClassic = function(event) {
    var jqObj;
    jqObj = $(event.currentTarget);
    return jqObj.removeClass('btn-danger');
  };

  ResultTableView.prototype.render = function() {
    var currentResults;
    currentResults = this.manageResultsForView();
    return ResultTableView.__super__.render.call(this, {
      fields: this.fields,
      results: currentResults
    });
  };

  ResultTableView.prototype.manageResultsForView = function() {
    var attr, count, results;
    attr = this.model.attributes;
    count = this.model.get('count');
    results = {};
    if (attr.no_result != null) {
      $('#all-result .accordion').empty();
      results['no_result'] = true;
      results['no_result_msg'] = attr.no_result;
      return results;
    } else if (count === 0) {
      results['no_result'] = true;
      results['no_result_msg'] = 'No results.';
      return results;
    } else {
      results['no_result'] = false;
      results['count'] = count;
      results['heading'] = {
        'doctype': attr.displayName || attr.docType,
        'field': attr.idField != null ? attr.idField : 'id',
        'data': attr.idField != null ? attr[attr.idField] : attr._id
      };
      this.results = results;
      this.results['fields'] = this.prepareResultFields(attr);
      return this.results;
    }
  };

  ResultTableView.prototype.prepareResultFields = function(attr) {
    var dataId, descField, description, displayName, field, fieldName, fields, hasDisplayName, iCounter, isSimpleObj, isSimpleType, minifiedId, newLi, obj, objName, settedField, simpleTypes, typeOfField, typeOfObj;
    iCounter = 0;
    fields = [];
    settedField = ['idField', 'count', 'descField', 'displayName'];
    simpleTypes = ['string', 'number', 'boolean'];
    for (fieldName in attr) {
      field = attr[fieldName];
      if (!(__indexOf.call(settedField, fieldName) < 0)) {
        continue;
      }
      iCounter = fieldName;
      fields[iCounter] = {
        'cdbFieldDescription': "",
        'cdbFieldName': fieldName,
        'cdbFieldTitle': '',
        'cdbFieldData': '',
        'cdbLabelClass': 'label-secondary'
      };
      if ((attr.descField != null) && (attr.descField[fieldName] != null)) {
        if (attr.descField[fieldName].description != null) {
          description = attr.descField[fieldName].description;
          fields[iCounter]['cdbFieldDescription'] = description;
        }
        descField = attr.descField[fieldName];
        hasDisplayName = descField.displayName != null;
        if (hasDisplayName && descField.displayName !== "") {
          displayName = descField.displayName;
          fields[iCounter]['cdbFieldName'] = displayName;
          if (field === this.results['heading']['field']) {
            this.results['heading']['field'] = displayName;
          }
        }
      }
      typeOfField = typeof field;
      isSimpleType = ($.inArray(typeOfField, simpleTypes)) !== -1;
      if (isSimpleType) {
        dataId = 'cdbFieldData';
        if (fieldName === 'docType') {
          fields[iCounter][dataId] = attr.displayName || field;
        } else if (fieldName === '_id') {
          minifiedId = '...' + field.substr(field.length - 5);
          fields[iCounter][dataId] = minifiedId;
          fields[iCounter]['cdbFieldTitle'] = field;
        } else {
          fields[iCounter][dataId] = field;
        }
      } else if ((field != null) && typeOfField === 'object') {
        fields[iCounter]['cdbFieldData'] = '<ul class="sober-list">';
        for (objName in field) {
          obj = field[objName];
          newLi = '';
          typeOfObj = typeof obj;
          isSimpleObj = ($.inArray(typeOfObj, simpleTypes)) !== -1;
          if (isSimpleObj) {
            newLi = '<li>' + objName + ' : ';
            newLi += '<i>' + obj + '</i></li>';
            fields[iCounter]['cdbFieldData'] += newLi;
          } else if ((obj != null) && typeof obj === 'object') {
            newLi = '<li>' + objName + ' : ';
            newLi += '<i>' + JSON.stringify(obj) + '</i></li>';
            fields[iCounter]['cdbFieldData'] += newLi;
          } else {
            newLi = '<li><i>empty</i></li>';
            fields[iCounter]['cdbFieldData'] += newLi;
            fields[iCounter]['cdbLabelClass'] = 'label-danger';
          }
        }
        fields[iCounter]['cdbFieldData'] += '</ul>';
      } else {
        fields[iCounter]['cdbFieldData'] = '<i>empty</i>';
        fields[iCounter]['cdbLabelClass'] = 'label-danger';
      }
    }
    return fields;
  };

  ResultTableView.prototype.template = function() {
    return require('./templates/result_table');
  };

  ResultTableView.prototype.blurIt = function(e) {
    return $(e.currentTarget).blur();
  };

  ResultTableView.prototype.showFieldDescription = function(e) {
    var accordionOffsetLeft, accordionOffsetTop, infoBoxCss, jqObj, left, offsetLeft, offsetTop, title, top, width;
    jqObj = $(e.currentTarget);
    if (jqObj.attr("data-title") !== "") {
      if (e.type === 'mouseenter') {
        offsetLeft = jqObj.offset().left;
        offsetTop = jqObj.offset().top;
        accordionOffsetLeft = $('#basic-accordion.accordion').offset().left;
        accordionOffsetTop = $('#basic-accordion.accordion').offset().top;
        left = offsetLeft - accordionOffsetLeft - 5;
        top = offsetTop - accordionOffsetTop - 7;
        width = jqObj.width();
        $('.info-box .field-title').css({
          'padding-left': width + 18
        });
        title = jqObj.attr("data-title");
        $('.info-box .field-description').empty().html(title);
        infoBoxCss = {
          'z-index': '5',
          'left': left,
          'top': top
        };
        $('.info-box').css(infoBoxCss);
        $('.accordion .label').css({
          'z-index': 'inherit'
        });
        jqObj.css({
          'z-index': '10'
        });
        return $('.info-box').stop().fadeTo(200, 1);
      } else {
        return $('.info-box').stop().fadeTo(200, 0);
      }
    }
  };

  ResultTableView.prototype.confirmRemoveResult = function(e) {
    var data, that;
    that = this;
    e.preventDefault();
    data = {
      title: t('confirmation required'),
      body: t('are you absolutely sure'),
      confirm: t('delete permanently')
    };
    $("body").prepend(this.templateModal(data));
    $("#confirmation-dialog").modal();
    $("#confirmation-dialog").modal("show");
    $("#confirmation-dialog-confirm").unbind('click');
    return $("#confirmation-dialog-confirm").bind("click", function() {
      return that.removeResult();
    });
  };

  ResultTableView.prototype.removeResult = function() {
    this.model.set('id', this.model.get('_id'));
    return this.model.destroy({
      data: 'id=' + this.model.get('id'),
      success: (function(_this) {
        return function() {
          return _this.render;
        };
      })(this)
    });
  };

  return ResultTableView;

})(View);
});

;require.register("views/results_global_controls_view", function(exports, require, module) {
var DeleteAllModel, ResultsGlobalControlsView, View, app, localStore,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

View = require('./../lib/view');

DeleteAllModel = require('./../models/delete_all_model');

app = require('application');

localStore = require('./../helpers/oLocalStorageHelper');

module.exports = ResultsGlobalControlsView = (function(_super) {
  __extends(ResultsGlobalControlsView, _super);

  function ResultsGlobalControlsView() {
    this.switchToTableView = __bind(this.switchToTableView, this);
    this.render = __bind(this.render, this);
    return ResultsGlobalControlsView.__super__.constructor.apply(this, arguments);
  }

  ResultsGlobalControlsView.prototype.el = '#results-global-controls';

  ResultsGlobalControlsView.prototype.templateModal = require('./templates/modal_confirm');

  ResultsGlobalControlsView.prototype.currentDoctype = '';

  ResultsGlobalControlsView.prototype.events = {
    'mouseover #delete-all': 'switchStyleOfDeleteButton',
    'mouseout #delete-all': 'switchStyleOfDeleteButton',
    'click #delete-all': 'confirmDeleteAll',
    'click .about-doctype': 'toogleMetaInfos',
    'click .view-switcher': 'switchToTableView'
  };

  ResultsGlobalControlsView.prototype.template = function() {
    return require('./templates/results_global_controls');
  };

  ResultsGlobalControlsView.prototype.initialize = function(opt) {
    this.opt = opt;
    $(this.el).undelegate('.about-doctype', 'click');
    $(this.el).undelegate('.view-switcher', 'click');
    $(this.el).undelegate('#delete-all', 'mouseover');
    $(this.el).undelegate('#delete-all', 'mouseout');
    $(this.el).undelegate('#delete-all', 'click');
    if (this.opt.doctypes != null) {
      this.currentDoctype = this.opt.doctypes[0] || '';
    }
    return this.render(this.opt);
  };

  ResultsGlobalControlsView.prototype.render = function(opt) {
    var iconPresentation, isList, isMetaInfoVisible, templateData;
    templateData = {};
    isList = opt.presentation && (opt.presentation === 'list');
    iconPresentation = isList ? 'icon-th' : 'icon-list-alt';
    templateData['icon_presentation'] = iconPresentation;
    templateData['range'] = opt.range ? '(' + opt.range + ')' || '' : void 0;
    templateData['doctype'] = opt.doctypes ? opt.doctypes[0] : '';
    if (opt.displayName && (opt.displayName !== '')) {
      templateData['doctype'] = opt.displayName;
    }
    templateData['hasMetainfos'] = opt.hasMetaInfos ? true : void 0;
    isMetaInfoVisible = this.isMetaInfoVisible();
    templateData['isVisible'] = isMetaInfoVisible;
    if (isMetaInfoVisible) {
      $('#results-meta-infos').show();
    }
    return ResultsGlobalControlsView.__super__.render.call(this, templateData);
  };

  ResultsGlobalControlsView.prototype.switchToTableView = function(event) {
    var presentation, presentationQuery, tableRoute, viewSwitcher;
    viewSwitcher = $(event.currentTarget);
    presentation = 'table';
    if (this.currentDoctype) {
      if (viewSwitcher.hasClass('icon-th')) {
        presentation = 'table';
        viewSwitcher.removeClass('icon-th').addClass('icon-list-alt');
      } else {
        presentation = 'list';
        viewSwitcher.removeClass('icon-list-alt').addClass('icon-th');
      }
      this.storePresentation(presentation);
      presentationQuery = '&&presentation=' + presentation;
      tableRoute = 'search/all/' + this.currentDoctype + presentationQuery;
      return app.router.navigate(tableRoute, {
        replace: true,
        trigger: true
      });
    }
  };

  ResultsGlobalControlsView.prototype.prepareStoragePresentationKey = function() {
    var key;
    key = this.currentDoctype.toLowerCase();
    key += localStore.keys.separation + localStore.keys.isListPresentation;
    return key;
  };

  ResultsGlobalControlsView.prototype.isListPresentation = function() {
    var key;
    key = this.prepareStoragePresentationKey();
    return localStore.getBoolean(key);
  };

  ResultsGlobalControlsView.prototype.storePresentation = function(presentation) {
    var isList, key;
    isList = presentation !== 'table' ? true : false;
    key = this.prepareStoragePresentationKey();
    return localStore.setBoolean(key, isList);
  };

  ResultsGlobalControlsView.prototype.isMetaInfoVisible = function() {
    return localStore.getBoolean(localStore.keys.isMetaInfoVisible);
  };

  ResultsGlobalControlsView.prototype.toogleMetaInfos = function(event) {
    var jqObj;
    jqObj = $(event.currentTarget);
    if (jqObj.hasClass('white-and-green')) {
      jqObj.removeClass('white-and-green');
      $('#results-meta-infos').hide();
      return localStore.setBoolean(localStore.keys.isMetaInfoVisible, false);
    } else {
      jqObj.addClass('white-and-green');
      $('#results-meta-infos').show();
      return localStore.setBoolean(localStore.keys.isMetaInfoVisible, true);
    }
  };

  ResultsGlobalControlsView.prototype.switchStyleOfDeleteButton = function(event) {
    var jqObj;
    jqObj = $(event.currentTarget);
    if (!jqObj.hasClass('btn-danger')) {
      jqObj.addClass('btn-danger');
      return jqObj.children('span').text(t('delete all') + ' ');
    } else {
      jqObj.removeClass('btn-danger');
      return jqObj.children('span').empty();
    }
  };

  ResultsGlobalControlsView.prototype.confirmDeleteAll = function(e) {
    var data;
    e.preventDefault();
    data = {
      title: t('confirmation required'),
      body: t('are you absolutely sure'),
      confirm: t('delete permanently')
    };
    $("body").prepend(this.templateModal(data));
    $("#confirmation-dialog").modal();
    $("#confirmation-dialog").modal("show");
    $("#confirmation-dialog-confirm").unbind('click');
    return $("#confirmation-dialog-confirm").bind("click", (function(_this) {
      return function() {
        return _this.deleteAll();
      };
    })(this));
  };

  ResultsGlobalControlsView.prototype.deleteAll = function() {
    var deleteAllModel;
    if ((this.currentDoctype != null) && this.currentDoctype !== '') {
      deleteAllModel = new DeleteAllModel();
      return deleteAllModel.fetch({
        type: 'DELETE',
        url: deleteAllModel.urlRoot + '?' + $.param({
          doctype: this.currentDoctype
        }),
        success: function(col, data) {
          app.router.navigate('search', {
            replace: true,
            trigger: true
          });
          return location.reload();
        }
      });
    }
  };

  return ResultsGlobalControlsView;

})(View);
});

;require.register("views/results_meta_infos_view", function(exports, require, module) {
var ResultsMetaInfosView, View, localStore,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

View = require('./../lib/view');

localStore = require('./../helpers/oLocalStorageHelper');

module.exports = ResultsMetaInfosView = (function(_super) {
  __extends(ResultsMetaInfosView, _super);

  function ResultsMetaInfosView() {
    return ResultsMetaInfosView.__super__.constructor.apply(this, arguments);
  }

  ResultsMetaInfosView.prototype.el = '#results-meta-infos';

  ResultsMetaInfosView.prototype.events = {
    'click #close-about-doctype': 'hideMetaInfos'
  };

  ResultsMetaInfosView.prototype.template = function() {
    return require('./templates/results_meta_infos');
  };

  ResultsMetaInfosView.prototype.hideMetaInfos = function(event) {
    var jqObj;
    jqObj = $('.about-doctype');
    jqObj.removeClass('white-and-green');
    $('#results-meta-infos').hide();
    return localStore.setBoolean(localStore.keys.isMetaInfoVisible, false);
  };

  return ResultsMetaInfosView;

})(View);
});

;require.register("views/search_view", function(exports, require, module) {
var BaseView, MetaInfosModel, ResultCollectionView, ResultsGlobalControlsView, ResultsMetaInfosView, SearchView, localStore,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

BaseView = require('../lib/base_view');

ResultCollectionView = require('../views/result_collection_view');

ResultsGlobalControlsView = require('../views/results_global_controls_view');

MetaInfosModel = require('./../models/meta_infos_model');

ResultsMetaInfosView = require('../views/results_meta_infos_view');

localStore = require('./../helpers/oLocalStorageHelper');

module.exports = SearchView = (function(_super) {
  __extends(SearchView, _super);

  function SearchView() {
    this.initialize = __bind(this.initialize, this);
    return SearchView.__super__.constructor.apply(this, arguments);
  }

  SearchView.prototype.el = '#results-list';

  SearchView.prototype.template = require('./templates/search');

  SearchView.prototype.hasDoctype = false;

  SearchView.prototype.events = {
    'click #btn-scroll-up': 'hideThis'
  };

  SearchView.prototype.initialize = function(options) {
    var metaInfosModel;
    this.options = options;
    this.hasDoctype = this.options.doctypes && this.options.doctypes.length > 0;
    this.hasPresentation = this.options.presentation != null;
    this.bindSearch();
    if (this.hasDoctype) {
      if (!this.hasPresentation) {
        this.applyStoredPresentation();
      }
      this.resultCollectionView = new ResultCollectionView(this.options);
      metaInfosModel = new MetaInfosModel();
      $('#results-meta-infos').empty();
      metaInfosModel.fetch({
        data: $.param({
          doctype: this.options.doctypes[0]
        }),
        success: (function(_this) {
          return function(col, data) {
            _this.applyMetaInformation(data);
            return _this.applyGlobalControls();
          };
        })(this)
      });
      if (this.options.range != null) {
        return $(window).bind('scroll', (function(_this) {
          return function(e, isTriggered) {
            var docHeight, noMoreItems, winHeight;
            docHeight = $(document).height();
            noMoreItems = _this.resultCollectionView.noMoreItems;
            if (!_this.resultCollectionView.isLoading && !noMoreItems) {
              winHeight = $(window).scrollTop() + $(window).height();
              if (winHeight === docHeight) {
                _this.loadMore(isTriggered);
              }
            }
            if ($(window).scrollTop() > 0) {
              return $('#btn-scroll-up').show();
            } else {
              return $('#btn-scroll-up').hide();
            }
          };
        })(this));
      }
    }
  };

  SearchView.prototype.afterRender = function() {
    if (this.hasDoctype) {
      this.resultCollectionView.render();
      $(window).bind('resize', (function(_this) {
        return function() {
          return _this.resultCollectionView.loopFirstScroll();
        };
      })(this));
      return this.bindSearch();
    }
  };

  SearchView.prototype.applyMetaInformation = function(data) {
    var resultsMetaInfosView;
    if (data && data.name && (data.application || data.metadoctype)) {
      resultsMetaInfosView = new ResultsMetaInfosView();
      resultsMetaInfosView.render(data);
      this.options['hasMetaInfos'] = true;
      return this.options['displayName'] = data.displayName;
    }
  };

  SearchView.prototype.applyGlobalControls = function() {
    return this.resultsGlobalControlsView = new ResultsGlobalControlsView(this.options);
  };

  SearchView.prototype.hideThis = function(event) {
    var jqObj;
    jqObj = $(event.currentTarget);
    return jqObj.hide();
  };

  SearchView.prototype.loadMore = function(isTriggered) {
    return this.resultCollectionView.loadNextPage(isTriggered);
  };

  SearchView.prototype.applyStoredPresentation = function() {
    var key;
    key = this.options.doctypes[0].toLowerCase();
    key += localStore.keys.separation + localStore.keys.isListPresentation;
    if (localStore.getBoolean(key)) {
      return this.options['presentation'] = 'list';
    } else {
      return this.options['presentation'] = 'table';
    }
  };

  SearchView.prototype.bindSearch = function() {
    var searchElt, searchField;
    searchElt = $('#launch-search');
    searchField = $('#search-field');
    searchElt.unbind('click');
    searchField.unbind('keypress');
    searchElt.click((function(_this) {
      return function() {
        return _this.resultCollectionView.search(searchField.val());
      };
    })(this));
    searchField.attr('placeholder', t('search-placeholder'));
    return searchField.keypress(function(event) {
      if (event.which === 13) {
        event.preventDefault();
        return searchElt.click();
      }
    });
  };

  return SearchView;

})(BaseView);
});

;require.register("views/templates/doctype_nav", function(exports, require, module) {
var __templateData = function template(locals) {
var buf = [];
var jade_mixins = {};
var jade_interp;
var locals_ = (locals || {}),value = locals_.value,displayName = locals_.displayName,subValues = locals_.subValues,doctype = locals_.doctype,sum = locals_.sum,name = locals_.name;
if (value.length) {
{
buf.push("<ul style=\"display:block;\" class=\"submenu\">");
for (var index in value) {
{
if (value[index].doctype) {
{
displayName = value[index].displayName !== ''? value[index].displayName : value[index].doctype
buf.push("<li><a" + (jade.attr("href", '#search/all/' + (value[index].doctype) + '', true, false)) + "><i class=\"icon-double-angle-right\"></i>" + (jade.escape((jade_interp = displayName) == null ? '' : jade_interp)) + "<span class=\"menu-little-text\">&nbsp;(" + (jade.escape((jade_interp = value[index].sum) == null ? '' : jade_interp)) + ")</span></a></li>");
}
}
else {
{
buf.push("<li><a href=\"#\" class=\"dropdown-toggle\"><i class=\"icon-double-angle-right\"></i><span class=\"menu-text\">" + (jade.escape((jade_interp = value[index].key) == null ? '' : jade_interp)) + "</span><b class=\"arrow icon-angle-right\"></b></a><ul class=\"submenu\">");
subValues = value[index].value
for (var subIndex in subValues) {
{
doctype = subValues[subIndex].doctype
displayName = subValues[subIndex].displayName !== ''? subValues[subIndex].displayName : doctype
sum = subValues[subIndex].sum
buf.push("<li><a" + (jade.attr("href", '#search/all/' + (doctype) + '', true, false)) + ">" + (jade.escape((jade_interp = displayName) == null ? '' : jade_interp)) + "<span class=\"menu-little-text\">&nbsp;(" + (jade.escape((jade_interp = sum) == null ? '' : jade_interp)) + ")</span></a></li>");
}
}
buf.push("</ul></li>");
}
}
}
}
buf.push("</ul>");
}
}
else {
{
buf.push("<a" + (jade.attr("href", '#search/all/' + (name) + '', true, false)) + ">" + (jade.escape((jade_interp = name) == null ? '' : jade_interp)) + "</a>");
}
};return buf.join("");
};
if (typeof define === 'function' && define.amd) {
  define([], function() {
    return __templateData;
  });
} else if (typeof module === 'object' && module && module.exports) {
  module.exports = __templateData;
} else {
  __templateData;
}
});

;require.register("views/templates/modal_confirm", function(exports, require, module) {
var __templateData = function template(locals) {
var buf = [];
var jade_mixins = {};
var jade_interp;
var locals_ = (locals || {}),title = locals_.title,body = locals_.body,confirm = locals_.confirm;
buf.push("<div id=\"confirmation-dialog\" class=\"modal\"><div class=\"modal-dialog\"><div class=\"modal-content\"><div class=\"modal-header\"><button type=\"button\" data-dismiss=\"modal\" aria-hidden=\"true\" class=\"close\">x</button><h4 class=\"modal-title\">" + (jade.escape((jade_interp = title) == null ? '' : jade_interp)) + "</h4></div><div class=\"modal-body\"><p class=\"modal-confirm-text\">" + (jade.escape((jade_interp = body) == null ? '' : jade_interp)) + "</p></div><div class=\"modal-footer\"><span data-dismiss=\"modal\" class=\"btn btn-link\">" + (jade.escape(null == (jade_interp = t('cancel')) ? "" : jade_interp)) + "</span><span id=\"confirmation-dialog-confirm\" data-dismiss=\"modal\" class=\"btn btn-danger\">" + (jade.escape((jade_interp = confirm) == null ? '' : jade_interp)) + "</span></div></div></div></div>");;return buf.join("");
};
if (typeof define === 'function' && define.amd) {
  define([], function() {
    return __templateData;
  });
} else if (typeof module === 'object' && module && module.exports) {
  module.exports = __templateData;
} else {
  __templateData;
}
});

;require.register("views/templates/result_list", function(exports, require, module) {
var __templateData = function template(locals) {
var buf = [];
var jade_mixins = {};
var jade_interp;
var locals_ = (locals || {}),results = locals_.results;
if (results['no_result']) {
{
buf.push("<em>" + (jade.escape((jade_interp = results['no_result_msg']) == null ? '' : jade_interp)) + "</em>");
}
}
else {
{
buf.push("<div class=\"panel-heading\"><h4 class=\"panel-title\"><a data-toggle=\"collapse\" data-parent=\"#basic-accordion\"" + (jade.attr("href", "#collapse" + (results.count) + "", true, false)) + " class=\"accordion-toggle\"><i class=\"icon-plus-sign\"></i><strong>&nbsp;" + (jade.escape((jade_interp = results.heading.doctype) == null ? '' : jade_interp)) + "</strong>&nbsp;" + (jade.escape((jade_interp = results.heading.field) == null ? '' : jade_interp)) + " :\n&nbsp;" + (jade.escape((jade_interp = results.heading.data) == null ? '' : jade_interp)) + "</a><div class=\"visible-md visible-lg hidden-sm hidden-xs btn-group result-buttons\"><button class=\"btn btn-xs remove-result\"><i class=\"icon-trash bigger-120\"></i></button></div></h4></div><div style=\"height: 0px;\"" + (jade.attr("id", "collapse" + (results.count) + "", true, false)) + " class=\"panel-collapse collapse\"><div class=\"panel-body\"><div id=\"result-list\" class=\"profile-user-info profile-user-info-striped\">");
for (var iCount = 0; iCount < results['fields'].length; iCount++) {
{
buf.push("<div" + (jade.attr("title", results['fields'][iCount].cdbFieldDescription, true, false)) + " class=\"profile-info-row\"><div class=\"profile-info-name\">" + (jade.escape((jade_interp = results['fields'][iCount].cdbFieldName) == null ? '' : jade_interp)) + "</div><div class=\"profile-info-value\">" + (null == (jade_interp = results['fields'][iCount].cdbFieldData) ? "" : jade_interp) + "</div></div>");
}
}
buf.push("</div></div></div>");
}
};return buf.join("");
};
if (typeof define === 'function' && define.amd) {
  define([], function() {
    return __templateData;
  });
} else if (typeof module === 'object' && module && module.exports) {
  module.exports = __templateData;
} else {
  __templateData;
}
});

;require.register("views/templates/result_table", function(exports, require, module) {
var __templateData = function template(locals) {
var buf = [];
var jade_mixins = {};
var jade_interp;
var locals_ = (locals || {}),results = locals_.results,fields = locals_.fields,undefined = locals_.undefined;
if ( results['no_result'])
{
buf.push("<em>" + (jade.escape((jade_interp = results['no_result_msg']) == null ? '' : jade_interp)) + "</em>");
}
else
{
// iterate Object.keys(fields)
;(function(){
  var $$obj = Object.keys(fields);
  if ('number' == typeof $$obj.length) {

    for (var $index = 0, $$l = $$obj.length; $index < $$l; $index++) {
      var fieldname = $$obj[$index];

if ( results['fields'][fieldname] == undefined)
{
buf.push("<td>NA</td>");
}
else if ( results['fields'][fieldname].cdbFieldTitle !== '')
{
buf.push("<td" + (jade.attr("title", results['fields'][fieldname].cdbFieldTitle, true, false)) + ">" + (null == (jade_interp = results['fields'][fieldname].cdbFieldData) ? "" : jade_interp) + "</td>");
}
else
{
buf.push("<td>" + (null == (jade_interp = results['fields'][fieldname].cdbFieldData) ? "" : jade_interp) + "</td>");
}
    }

  } else {
    var $$l = 0;
    for (var $index in $$obj) {
      $$l++;      var fieldname = $$obj[$index];

if ( results['fields'][fieldname] == undefined)
{
buf.push("<td>NA</td>");
}
else if ( results['fields'][fieldname].cdbFieldTitle !== '')
{
buf.push("<td" + (jade.attr("title", results['fields'][fieldname].cdbFieldTitle, true, false)) + ">" + (null == (jade_interp = results['fields'][fieldname].cdbFieldData) ? "" : jade_interp) + "</td>");
}
else
{
buf.push("<td>" + (null == (jade_interp = results['fields'][fieldname].cdbFieldData) ? "" : jade_interp) + "</td>");
}
    }

  }
}).call(this);

buf.push("<td class=\"action\"><button class=\"btn btn-xs remove-result\"><i class=\"icon-trash bigger-120\"></i></button></td>");
};return buf.join("");
};
if (typeof define === 'function' && define.amd) {
  define([], function() {
    return __templateData;
  });
} else if (typeof module === 'object' && module && module.exports) {
  module.exports = __templateData;
} else {
  __templateData;
}
});

;require.register("views/templates/results_global_controls", function(exports, require, module) {
var __templateData = function template(locals) {
var buf = [];
var jade_mixins = {};
var jade_interp;
var locals_ = (locals || {}),doctype = locals_.doctype,hasMetainfos = locals_.hasMetainfos,isVisible = locals_.isVisible,icon_presentation = locals_.icon_presentation;
if (doctype !== '') {
{
buf.push("<h4>&nbsp;&nbsp;" + (jade.escape((jade_interp = t('currently exploring')) == null ? '' : jade_interp)) + " :&nbsp;<em>" + (jade.escape((jade_interp = doctype) == null ? '' : jade_interp)) + " &nbsp;</em>");
if (hasMetainfos) {
{
if (isVisible) {
{
buf.push("<i class=\"about-doctype icon-question-sign white-and-green\"></i>");
}
}
else {
{
buf.push("<i class=\"about-doctype icon-question-sign\"></i>");
}
}
}
}
buf.push("&nbsp;<i" + (jade.cls(['view-switcher',icon_presentation], [null,true])) + "></i></h4><div class=\"visible-md visible-lg hidden-sm hidden-xs btn-group result-buttons\"><button id=\"delete-all\" class=\"btn btn-xs\"><span></span><i class=\"icon-trash bigger-120\"></i></button></div>");
}
};return buf.join("");
};
if (typeof define === 'function' && define.amd) {
  define([], function() {
    return __templateData;
  });
} else if (typeof module === 'object' && module && module.exports) {
  module.exports = __templateData;
} else {
  __templateData;
}
});

;require.register("views/templates/results_meta_infos", function(exports, require, module) {
var __templateData = function template(locals) {
var buf = [];
var jade_mixins = {};
var jade_interp;
var locals_ = (locals || {}),displayedDoctype = locals_.displayedDoctype,displayName = locals_.displayName,name = locals_.name,applications = locals_.applications,metadoctype = locals_.metadoctype;
buf.push("<div class=\"widget-box\"><div class=\"widget-header widget-header-small header-color-green\"><h4 class=\"lighter\"><i class=\"icon-question-sign\"></i>");
displayedDoctype = displayName !== '' ? displayName : name;
buf.push("&nbsp;" + (jade.escape((jade_interp = t('about')) == null ? '' : jade_interp)) + " " + (jade.escape((jade_interp = displayedDoctype) == null ? '' : jade_interp)) + "</h4><div class=\"widget-toolbar\"><span id=\"close-about-doctype\"><i class=\"icon-remove\"></i></span></div></div><div class=\"widget-body\"><div class=\"widget-body-inner\"><div class=\"widget-main padding-6\"><div class=\"md-desc-wrapper\">");
if (applications && applications.length > 0) {
{
buf.push("<div class=\"md-desc-container\"><strong>" + (jade.escape(null == (jade_interp = t('applications using it') + ' :') ? "" : jade_interp)) + "</strong><ul class=\"sober-list\">");
for (var index in applications) {
{
buf.push("<li class=\"firstLetterUp\"><i class=\"icon-download-alt\"></i><span>&nbsp;" + (jade.escape((jade_interp = applications[index]) == null ? '' : jade_interp)) + "</span></li>");
}
}
buf.push("</ul></div>");
}
}
if (typeof(metadoctype) === 'object') {
{
buf.push("<div class=\"md-desc-container\"><strong>" + (jade.escape(null == (jade_interp = t('fields information') + ' :') ? "" : jade_interp)) + "</strong><ul class=\"sober-list\">");
var fields = metadoctype.fields;
for (var obj in fields) {
{
buf.push("<li><i class=\"icon-tag\"></i><span>&nbsp;" + (jade.escape((jade_interp = fields[obj].displayName) == null ? '' : jade_interp)) + " -&nbsp;<i>" + (jade.escape((jade_interp = fields[obj].description) == null ? '' : jade_interp)) + "</i></span></li>");
}
}
buf.push("</ul></div>");
}
}
buf.push("</div></div><div class=\"clear\"></div></div></div></div>");;return buf.join("");
};
if (typeof define === 'function' && define.amd) {
  define([], function() {
    return __templateData;
  });
} else if (typeof module === 'object' && module && module.exports) {
  module.exports = __templateData;
} else {
  __templateData;
}
});

;require.register("views/templates/search", function(exports, require, module) {
var __templateData = function template(locals) {
var buf = [];
var jade_mixins = {};
var jade_interp;

buf.push("<div class=\"introduction\"><div class=\"page-header\"><h1>" + (jade.escape((jade_interp = t('welcome title')) == null ? '' : jade_interp)) + "</h1></div><p>" + (jade.escape((jade_interp = t('welcome message part1')) == null ? '' : jade_interp)) + "</p><p>" + (jade.escape((jade_interp = t('welcome message part2')) == null ? '' : jade_interp)) + "</p></div><div id=\"all-result\"><div id=\"basic-accordion\" class=\"accordion-style1 panel-group\"></div><div id=\"basic-table\" class=\"table-responsive\"><table id=\"result-view-as-table\" class=\"table table-striped table-bordered table-hover\"><tbody></tbody></table></div><div class=\"load-more-result\"><span>" + (jade.escape((jade_interp = t('load more results')) == null ? '' : jade_interp)) + "&nbsp;</span><br/><i class=\"icon-circle-arrow-down\"></i></div></div>");;return buf.join("");
};
if (typeof define === 'function' && define.amd) {
  define([], function() {
    return __templateData;
  });
} else if (typeof module === 'object' && module && module.exports) {
  module.exports = __templateData;
} else {
  __templateData;
}
});

;
//# sourceMappingURL=app.js.map