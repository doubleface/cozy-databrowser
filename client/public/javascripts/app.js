(function(/*! Brunch !*/) {
  'use strict';

  var globals = typeof window !== 'undefined' ? window : global;
  if (typeof globals.require === 'function') return;

  var modules = {};
  var cache = {};

  var has = function(object, name) {
    return ({}).hasOwnProperty.call(object, name);
  };

  var expand = function(root, name) {
    var results = [], parts, part;
    if (/^\.\.?(\/|$)/.test(name)) {
      parts = [root, name].join('/').split('/');
    } else {
      parts = name.split('/');
    }
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

  var dirname = function(path) {
    return path.split('/').slice(0, -1).join('/');
  };

  var localRequire = function(path) {
    return function(name) {
      var dir = dirname(path);
      var absolute = expand(dir, name);
      return globals.require(absolute, path);
    };
  };

  var initModule = function(name, definition) {
    var module = {id: name, exports: {}};
    definition(module.exports, localRequire(name), module);
    var exports = cache[name] = module.exports;
    return exports;
  };

  var require = function(name, loaderPath) {
    var path = expand(name, '.');
    if (loaderPath == null) loaderPath = '/';

    if (has(cache, path)) return cache[path];
    if (has(modules, path)) return initModule(path, modules[path]);

    var dirIndex = expand(path, './index');
    if (has(cache, dirIndex)) return cache[dirIndex];
    if (has(modules, dirIndex)) return initModule(dirIndex, modules[dirIndex]);

    throw new Error('Cannot find module "' + name + '" from '+ '"' + loaderPath + '"');
  };

  var define = function(bundle, fn) {
    if (typeof bundle === 'object') {
      for (var key in bundle) {
        if (has(bundle, key)) {
          modules[key] = bundle[key];
        }
      }
    } else {
      modules[bundle] = fn;
    }
  };

  var list = function() {
    var result = [];
    for (var item in modules) {
      if (has(modules, item)) {
        result.push(item);
      }
    }
    return result;
  };

  globals.require = require;
  globals.require.define = define;
  globals.require.register = define;
  globals.require.list = list;
  globals.require.brunch = true;
})();
require.register("application", function(exports, require, module) {
module.exports = {
  initialize: function() {
    var Router;
    Router = require('router');
    this.router = new Router();
    Backbone.history.start();
    if (typeof Object.freeze === 'function') {
      return Object.freeze(this);
    }
  }
};

});

;require.register("collections/doctype_collection", function(exports, require, module) {
var DoctypeCollection, _ref,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

module.exports = DoctypeCollection = (function(_super) {
  __extends(DoctypeCollection, _super);

  function DoctypeCollection() {
    _ref = DoctypeCollection.__super__.constructor.apply(this, arguments);
    return _ref;
  }

  DoctypeCollection.prototype.model = require('../models/doctype_model');

  DoctypeCollection.prototype.url = 'doctypes';

  return DoctypeCollection;

})(Backbone.Collection);

});

;require.register("collections/result_collection", function(exports, require, module) {
var ResultCollection, _ref,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

module.exports = ResultCollection = (function(_super) {
  __extends(ResultCollection, _super);

  function ResultCollection() {
    _ref = ResultCollection.__super__.constructor.apply(this, arguments);
    return _ref;
  }

  ResultCollection.prototype.model = require('../models/result_model');

  ResultCollection.prototype.page = 1;

  ResultCollection.prototype.nbPerPage = 10;

  ResultCollection.prototype.url = function() {
    var paramNbPerPage, paramPage, query;
    query = '';
    paramNbPerPage = this.nbPerPage > 0 ? 'nbperpage=' + this.nbPerPage : '';
    paramPage = this.page > 0 ? 'page=' + this.page : '';
    if (paramPage !== '' && paramNbPerPage !== '') {
      query = '?' + paramPage + '&' + paramNbPerPage;
    }
    return 'search' + query;
  };

  return ResultCollection;

})(Backbone.Collection);

});

;require.register("helpers/oLocalStorageHelper", function(exports, require, module) {
module.exports = {
  keys: {
    isMetaInfoVisible: 'ismetainfovisible'
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
    methods = 'assert,count,debug,dir,dirxml,error,exception,\
                   group,groupCollapsed,groupEnd,info,log,markTimeline,\
                   profile,profileEnd,time,timeEnd,trace,warn'.split(',');
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
var BaseView, _ref,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

module.exports = BaseView = (function(_super) {
  __extends(BaseView, _super);

  function BaseView() {
    _ref = BaseView.__super__.constructor.apply(this, arguments);
    return _ref;
  }

  BaseView.prototype.template = function() {};

  BaseView.prototype.initialize = function() {};

  BaseView.prototype.getRenderData = function() {
    var _ref1;
    return {
      model: (_ref1 = this.model) != null ? _ref1.toJSON() : void 0
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
var View, _ref,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

module.exports = View = (function(_super) {
  __extends(View, _super);

  function View() {
    _ref = View.__super__.constructor.apply(this, arguments);
    return _ref;
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
var BaseView, ViewCollection, _ref,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

BaseView = require('lib/base_view');

module.exports = ViewCollection = (function(_super) {
  __extends(ViewCollection, _super);

  function ViewCollection() {
    this.removeItem = __bind(this.removeItem, this);
    this.addItem = __bind(this.addItem, this);
    _ref = ViewCollection.__super__.constructor.apply(this, arguments);
    return _ref;
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
    var id, view, _ref1;
    _ref1 = this.views;
    for (id in _ref1) {
      view = _ref1[id];
      view.$el.detach();
    }
    return ViewCollection.__super__.render.apply(this, arguments);
  };

  ViewCollection.prototype.afterRender = function() {
    var id, view, _ref1;
    this.$collectionEl = $(this.collectionEl);
    this.$collectionEl.empty();
    _ref1 = this.views;
    for (id in _ref1) {
      view = _ref1[id];
      this.appendView(view.$el);
    }
    this.onReset(this.collection);
    return this.onChange(this.views);
  };

  ViewCollection.prototype.remove = function() {
    this.onReset([]);
    return ViewCollection.__super__.remove.apply(this, arguments);
  };

  ViewCollection.prototype.onReset = function(newcollection) {
    var id, view, _ref1;
    _ref1 = this.views;
    for (id in _ref1) {
      view = _ref1[id];
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

;require.register("models/delete_all_model", function(exports, require, module) {
var DoctypeDeleteAllModel, _ref,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

module.exports = DoctypeDeleteAllModel = (function(_super) {
  __extends(DoctypeDeleteAllModel, _super);

  function DoctypeDeleteAllModel() {
    _ref = DoctypeDeleteAllModel.__super__.constructor.apply(this, arguments);
    return _ref;
  }

  DoctypeDeleteAllModel.prototype.urlRoot = 'doctype_delete_all';

  return DoctypeDeleteAllModel;

})(Backbone.Model);

});

;require.register("models/doctype_model", function(exports, require, module) {
var DoctypeModel, _ref,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

module.exports = DoctypeModel = (function(_super) {
  __extends(DoctypeModel, _super);

  function DoctypeModel() {
    _ref = DoctypeModel.__super__.constructor.apply(this, arguments);
    return _ref;
  }

  DoctypeModel.prototype.rootUrl = "doctypes";

  return DoctypeModel;

})(Backbone.Model);

});

;require.register("models/meta_infos_model", function(exports, require, module) {
var DoctypeMetaInfosModel, _ref,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

module.exports = DoctypeMetaInfosModel = (function(_super) {
  __extends(DoctypeMetaInfosModel, _super);

  function DoctypeMetaInfosModel() {
    _ref = DoctypeMetaInfosModel.__super__.constructor.apply(this, arguments);
    return _ref;
  }

  DoctypeMetaInfosModel.prototype.urlRoot = 'doctype_meta_infos';

  return DoctypeMetaInfosModel;

})(Backbone.Model);

});

;require.register("models/result_model", function(exports, require, module) {
var ResultModel, _ref,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

module.exports = ResultModel = (function(_super) {
  __extends(ResultModel, _super);

  function ResultModel() {
    _ref = ResultModel.__super__.constructor.apply(this, arguments);
    return _ref;
  }

  ResultModel.prototype.urlRoot = "search";

  return ResultModel;

})(Backbone.Model);

});

;require.register("router", function(exports, require, module) {
var DoctypeNavCollectionView, Router, SearchView, _ref,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

DoctypeNavCollectionView = require('views/doctype_nav_collection_view');

SearchView = require('views/search_view');

module.exports = Router = (function(_super) {
  __extends(Router, _super);

  function Router() {
    _ref = Router.__super__.constructor.apply(this, arguments);
    return _ref;
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
    var doctypePattern, options, parsedQuery, searchView, splittedQuery;
    options = {};
    options['presentation'] = 'table';
    if (query != null) {
      splittedQuery = query.split('&&');
      doctypePattern = splittedQuery[0];
      if (!/\|/.test(decodeURIComponent(doctypePattern))) {
        options['doctypes'] = [doctypePattern];
      } else {
        options['doctypes'] = decodeURIComponent(doctypePattern).split(/\|/);
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
var DoctypeCollection, DoctypeNavCollectionView, DoctypeNavView, ViewCollection, _ref,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

ViewCollection = require('../lib/view_collection');

DoctypeCollection = require('../collections/doctype_collection');

DoctypeNavView = require('./doctype_nav_view');

module.exports = DoctypeNavCollectionView = (function(_super) {
  __extends(DoctypeNavCollectionView, _super);

  function DoctypeNavCollectionView() {
    _ref = DoctypeNavCollectionView.__super__.constructor.apply(this, arguments);
    return _ref;
  }

  DoctypeNavCollectionView.prototype.itemview = DoctypeNavView;

  DoctypeNavCollectionView.prototype.collection = new DoctypeCollection();

  DoctypeNavCollectionView.prototype.collectionEl = '#doctype-nav-collection-view';

  DoctypeNavCollectionView.prototype.el = '#doctype-nav-collection-view';

  DoctypeNavCollectionView.prototype.isMenuMinimized = false;

  DoctypeNavCollectionView.prototype.lastSlimScrolled = null;

  DoctypeNavCollectionView.prototype.events = {
    'click a': 'activateMenuElement',
    'mouseenter .doctype-list-item': 'showMinimizedMenu'
  };

  DoctypeNavCollectionView.prototype.initialize = function() {
    this.bindMenuCollapser();
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

  DoctypeNavCollectionView.prototype.showMinimizedMenu = function() {
    var jqLiContainer, jqScrollDiv, jqSubmenu;
    jqLiContainer = $(event.currentTarget);
    jqSubmenu = jqLiContainer.find(' .submenu:eq(0)');
    if (this.isMenuMinimized) {
      this.destroySlimscrolls;
      this.applySlimscroll(jqSubmenu, true);
      return jqScrollDiv = jqLiContainer.find('.slimScrollDiv');
    }
  };

  DoctypeNavCollectionView.prototype.activateMenuElement = function(event) {
    var hasSubmenu, isDirectLink, jqMenuLink, jqParentUl, jqSubmenu, parentLi, parentsLi, submenuIsVisible;
    jqMenuLink = $(event.currentTarget);
    parentLi = jqMenuLink.parent('li');
    parentsLi = jqMenuLink.parentsUntil('#doctype-nav-collection-view', 'li');
    jqSubmenu = parentLi.find('.submenu:eq(0)');
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
    this.isMenuMinimized = $('#sidebar').hasClass('menu-min');
    submenuIsVisible = jqSubmenu.is(':visible');
    if (!submenuIsVisible) {
      if (this.isMenuMinimized && jqParentUl.hasClass('nav-list')) {
        return;
      }
      jqParentUl.find('.open:eq(0)').find(' .submenu:eq(0)').each(function() {
        if ($(this) !== jqSubmenu) {
          return $(this).slideUp(200).closest('li').removeClass('open');
        }
      });
      this.applySlimscroll(jqSubmenu);
    }
    if (this.isMenuMinimized && jqParentUl.hasClass('nav-list')) {
      return false;
    }
    jqSubmenu.slideToggle(200);
    parentLi.toggleClass('open');
    $('.icon-angle-down').addClass('icon-angle-right').removeClass('icon-angle-down');
    $('.open > a > .icon-angle-right').addClass('icon-angle-down').removeClass('icon-angle-right');
    return false;
  };

  DoctypeNavCollectionView.prototype.applySlimscroll = function(jqSubmenu) {
    var bSlimScollExist, fullHeight, hasSubmenu, isFirstSubmenu, maxHeightOfMenu, menuHeight, navHeight, parentSubmenu, triggerEnter, winHeight;
    this.destroySlimscrolls();
    hasSubmenu = jqSubmenu.length > 0;
    isFirstSubmenu = hasSubmenu && jqSubmenu.parent().closest('.submenu').length === 0;
    navHeight = $('.nav-list > li').length * 46 + $('#sidebar-collapse').height() + $('.nav-search:eq(0)').height();
    if (this.isMenuMinimized) {
      navHeight = $('.nav-search:eq(0)').height() + 25;
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

  DoctypeNavCollectionView.prototype.collapseSidebar = function(collpase) {
    var icon, icon1, icon2, sidebar;
    this.destroySlimscrolls();
    collpase = collpase || false;
    sidebar = $('#sidebar');
    icon = document.getElementById('sidebar-collapse').querySelector('[class*="icon-"]');
    icon1 = icon.getAttribute('data-icon1');
    icon2 = icon.getAttribute('data-icon2');
    if (collpase) {
      sidebar.addClass('menu-min');
      $(icon).removeClass(icon1);
      $(icon).addClass(icon2);
      return this.isMenuMinimized = true;
    } else {
      sidebar.removeClass('menu-min');
      $(icon).removeClass(icon2);
      $(icon).addClass(icon1);
      return this.isMenuMinimized = false;
    }
  };

  DoctypeNavCollectionView.prototype.bindMenuCollapser = function() {
    var _this = this;
    return $('#sidebar-collapse').on('click', function() {
      _this.isMenuMinimized = $('#sidebar').hasClass('menu-min');
      return _this.collapseSidebar(!_this.isMenuMinimized);
    });
  };

  DoctypeNavCollectionView.prototype.bindMenuResponsive = function() {
    var _this = this;
    $('#menu-toggler').on('click', function() {
      $('#sidebar').toggleClass('display');
      $(this).toggleClass('display');
      return false;
    });
    return $(window).resize(function() {
      if (_this.lastSlimScrolled != null) {
        return _this.applySlimscroll(_this.lastSlimScrolled);
      }
    });
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
var DoctypeNavView, View, _ref,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

View = require('./../lib/view');

module.exports = DoctypeNavView = (function(_super) {
  __extends(DoctypeNavView, _super);

  function DoctypeNavView() {
    _ref = DoctypeNavView.__super__.constructor.apply(this, arguments);
    return _ref;
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
        origins: 'icon-map-marker'
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
var ResultCollection, ResultCollectionView, ResultView, TableResultView, ViewCollection, _ref,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

ViewCollection = require('../lib/view_collection');

ResultCollection = require('../collections/result_collection');

ResultView = require('./result_list_view');

TableResultView = require('./result_table_view');

module.exports = ResultCollectionView = (function(_super) {
  __extends(ResultCollectionView, _super);

  function ResultCollectionView() {
    _ref = ResultCollectionView.__super__.constructor.apply(this, arguments);
    return _ref;
  }

  ResultCollectionView.prototype.itemview = TableResultView;

  ResultCollectionView.prototype.collectionEl = '#result-view-as-table';

  ResultCollectionView.prototype.isLoading = false;

  ResultCollectionView.prototype.noMoreItems = false;

  ResultCollectionView.prototype.initialize = function(options) {
    var _this = this;
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
        this.collection.nbPerPage = 0;
        $('#results-list').undelegate('th .icon-eye-close', 'click');
        $('#results-list').undelegate('button.show-col', 'click');
      }
      return this.collection.fetch({
        data: $.param(this.options),
        success: function(col, data) {
          $('.loading-image').remove();
          if ((_this.options.range != null) && (_this.options.doctypes != null)) {
            if (data.length === _this.collection.nbPerPage) {
              _this.loopFirstScroll();
              $('.load-more-result').show();
            } else {
              _this.noMoreItems = true;
              $('.load-more-result').hide();
            }
          }
          if (_this.options.presentation === 'table') {
            return $('#result-view-as-table').dataTable({
              "aoColumnDefs": [
                {
                  bSortable: false,
                  aTargets: [-1]
                }
              ],
              "oColVis": {
                "iOverlayFade": 200
              },
              "sDom": '<"left"C>Rt'
            });
          }
        },
        error: function() {
          $('.loading-image').remove();
          _this.noMoreItems = true;
          return _this.displayLoadingError();
        }
      });
    }
  };

  ResultCollectionView.prototype.render = function() {
    var id, loader, view, _ref1;
    if ((this.options != null) && (this.options.doctypes != null)) {
      loader = '<div class="loading-image">';
      loader += '<img src="images/ajax-loader.gif" />';
      loader += '</div>';
      $('#all-result').append(loader);
    }
    _ref1 = this.views;
    for (id in _ref1) {
      view = _ref1[id];
      view.$el.detach();
    }
    return ResultCollectionView.__super__.render.apply(this, arguments);
  };

  ResultCollectionView.prototype.search = function(content) {
    this.options['query'] = content;
    return this.collection.fetch({
      data: $.param(this.options)
    });
  };

  ResultCollectionView.prototype.loadNextPage = function(isTriggered, callback) {
    var _this = this;
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
        success: function(col, data) {
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
            if (callback != null) {
              return callback();
            }
          } else {
            return _this.noMoreItems = true;
          }
        },
        error: function() {
          this.noMoreItems = true;
          return this.displayLoadingError();
        }
      });
    }
  };

  ResultCollectionView.prototype.loopFirstScroll = function() {
    var firstScroll,
      _this = this;
    if (!this.isLoading && !this.noMoreItems) {
      firstScroll = $(document).height() === $(window).height();
      if (firstScroll) {
        return this.loadNextPage(true, function() {
          return _this.loopFirstScroll();
        });
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

  return ResultCollectionView;

})(ViewCollection);

});

;require.register("views/result_list_view", function(exports, require, module) {
var ResultView, View, _ref,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

View = require('./../lib/view');

module.exports = ResultView = (function(_super) {
  __extends(ResultView, _super);

  function ResultView() {
    this.render = __bind(this.render, this);
    _ref = ResultView.__super__.constructor.apply(this, arguments);
    return _ref;
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

  ResultView.prototype.render = function() {
    return ResultView.__super__.render.call(this, {
      results: this.manageResultsForView()
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
    var descField, description, displayName, field, fieldName, fields, hasDisplayName, iCounter, isNativField, isSimpleObj, isSimpleType, newLi, obj, objName, settedField, simpleTypes, typeOfField, typeOfObj;
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
          if (fieldName === 'docType') {
            fields[iCounter]['cdbFieldData'] = attr.displayName || field;
          } else {
            fields[iCounter]['cdbFieldData'] = field;
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

  ResultView.prototype.template = function() {
    return require('./templates/result_list');
  };

  ResultView.prototype.blurIt = function(e) {
    return $(e.currentTarget).blur();
  };

  ResultView.prototype.showFieldDescription = function(e) {
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

  ResultView.prototype.confirmRemoveResult = function(e) {
    var data, message, that;
    that = this;
    e.preventDefault();
    message = 'Are you ABSOLUTELY sure ? ';
    message += 'It could lead to IRREVERSIBLE DAMAGES to your cozy environment.';
    data = {
      title: 'Confirmation required',
      body: message,
      confirm: 'delete permanently'
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
    var _this = this;
    this.model.set('id', this.model.get('_id'));
    return this.model.destroy({
      data: 'id=' + this.model.get('id'),
      success: function() {
        return _this.render;
      }
    });
  };

  return ResultView;

})(View);

});

;require.register("views/result_table_view", function(exports, require, module) {
var ResultTableView, View, _ref,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

View = require('./../lib/view');

module.exports = ResultTableView = (function(_super) {
  __extends(ResultTableView, _super);

  function ResultTableView() {
    this.render = __bind(this.render, this);
    _ref = ResultTableView.__super__.constructor.apply(this, arguments);
    return _ref;
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

  ResultTableView.prototype.injectThead = function(results) {
    var countCols, htmlThead, result, _i, _len, _ref1;
    countCols = 0;
    htmlThead = '<thead>';
    htmlThead += '<tr>';
    _ref1 = results['fields'];
    for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
      result = _ref1[_i];
      htmlThead += '<th>' + result.cdbFieldName + '</th>';
      countCols++;
    }
    htmlThead += '<th>&nbsp;</th>';
    htmlThead += '</tr>';
    htmlThead += '</thead>';
    return $('#result-view-as-table').prepend(htmlThead);
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
    if (currentResults.count === 1) {
      this.injectThead(currentResults);
    }
    return ResultTableView.__super__.render.call(this, {
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
    var descField, description, displayName, field, fieldName, fields, hasDisplayName, iCounter, isNativField, isSimpleObj, isSimpleType, newLi, obj, objName, settedFields, simpleTypes, typeOfField, typeOfObj;
    iCounter = 0;
    fields = [];
    settedFields = ['idField', 'count', 'descField', 'displayName'];
    simpleTypes = ['string', 'number', 'boolean'];
    for (fieldName in attr) {
      field = attr[fieldName];
      description = "";
      isNativField = ($.inArray(fieldName, settedFields)) === -1;
      if (isNativField) {
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
          if (fieldName === 'docType') {
            fields[iCounter]['cdbFieldData'] = attr.displayName || field;
          } else if (fieldName === '_id') {
            fields[iCounter]['cdbFieldData'] = '...' + field.substr(field.length - 5);
            fields[iCounter]['cdbFieldTitle'] = field;
          } else {
            fields[iCounter]['cdbFieldData'] = field;
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
    var data, message, that;
    that = this;
    e.preventDefault();
    message = 'Are you ABSOLUTELY sure ? ';
    message += 'It could lead to IRREVERSIBLE DAMAGES to your cozy environment.';
    data = {
      title: 'Confirmation required',
      body: message,
      confirm: 'delete permanently'
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
    var _this = this;
    this.model.set('id', this.model.get('_id'));
    return this.model.destroy({
      data: 'id=' + this.model.get('id'),
      success: function() {
        return _this.render;
      }
    });
  };

  return ResultTableView;

})(View);

});

;require.register("views/results_global_controls_view", function(exports, require, module) {
var DeleteAllModel, ResultsGlobalControlsView, View, app, localStore, _ref,
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
    _ref = ResultsGlobalControlsView.__super__.constructor.apply(this, arguments);
    return _ref;
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
      presentationQuery = '&&presentation=' + presentation;
      tableRoute = 'search/all/' + this.currentDoctype + presentationQuery;
      return app.router.navigate(tableRoute, {
        replace: true,
        trigger: true
      });
    }
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
      return jqObj.children('span').text('Delete all ');
    } else {
      jqObj.removeClass('btn-danger');
      return jqObj.children('span').empty();
    }
  };

  ResultsGlobalControlsView.prototype.confirmDeleteAll = function(e) {
    var data, message,
      _this = this;
    e.preventDefault();
    message = 'Are you ABSOLUTELY sure ? ';
    message += 'It could lead to IRREVERSIBLE DAMAGES ';
    message += 'to your cozy environment.';
    data = {
      title: 'Confirmation required',
      body: message,
      confirm: 'delete permanently'
    };
    $("body").prepend(this.templateModal(data));
    $("#confirmation-dialog").modal();
    $("#confirmation-dialog").modal("show");
    $("#confirmation-dialog-confirm").unbind('click');
    return $("#confirmation-dialog-confirm").bind("click", function() {
      return _this.deleteAll();
    });
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
          return location.reload();
        }
      });
    }
  };

  return ResultsGlobalControlsView;

})(View);

});

;require.register("views/results_meta_infos_view", function(exports, require, module) {
var ResultsMetaInfosView, View, localStore, _ref,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

View = require('./../lib/view');

localStore = require('./../helpers/oLocalStorageHelper');

module.exports = ResultsMetaInfosView = (function(_super) {
  __extends(ResultsMetaInfosView, _super);

  function ResultsMetaInfosView() {
    _ref = ResultsMetaInfosView.__super__.constructor.apply(this, arguments);
    return _ref;
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
var BaseView, MetaInfosModel, ResultCollectionView, ResultsGlobalControlsView, ResultsMetaInfosView, SearchView, _ref,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

BaseView = require('../lib/base_view');

ResultCollectionView = require('../views/result_collection_view');

ResultsGlobalControlsView = require('../views/results_global_controls_view');

MetaInfosModel = require('./../models/meta_infos_model');

ResultsMetaInfosView = require('../views/results_meta_infos_view');

module.exports = SearchView = (function(_super) {
  __extends(SearchView, _super);

  function SearchView() {
    this.initialize = __bind(this.initialize, this);
    _ref = SearchView.__super__.constructor.apply(this, arguments);
    return _ref;
  }

  SearchView.prototype.el = '#results-list';

  SearchView.prototype.template = require('./templates/search');

  SearchView.prototype.hasDoctype = false;

  SearchView.prototype.events = {
    'click #btn-scroll-up': 'hideThis'
  };

  SearchView.prototype.initialize = function(options) {
    var metaInfosModel,
      _this = this;
    this.options = options;
    this.hasDoctype = this.options.doctypes && this.options.doctypes.length > 0;
    this.bindSearch();
    if (this.hasDoctype) {
      this.resultCollectionView = new ResultCollectionView(this.options);
      metaInfosModel = new MetaInfosModel();
      $('#results-meta-infos').empty();
      metaInfosModel.fetch({
        data: $.param({
          doctype: this.options.doctypes[0]
        }),
        success: function(col, data) {
          _this.applyMetaInformation(data);
          return _this.applyGlobalControls();
        }
      });
      if (this.options.range != null) {
        return $(window).bind('scroll', function(e, isTriggered) {
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
        });
      }
    }
  };

  SearchView.prototype.afterRender = function() {
    var _this = this;
    if (this.hasDoctype) {
      this.resultCollectionView.render();
      $(window).bind('resize', function() {
        return _this.resultCollectionView.loopFirstScroll();
      });
      return this.bindSearch();
    }
  };

  SearchView.prototype.applyMetaInformation = function(data) {
    var resultsMetaInfosView;
    if (data && data.name && (data.application || data.metadoctype)) {
      resultsMetaInfosView = new ResultsMetaInfosView();
      resultsMetaInfosView.render(data);
      this.options['hasMetaInfos'] = true;
      this.options['displayName'] = data.displayName;
      return this.options['resultsCollection'] = this.resultCollectionView;
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

  SearchView.prototype.bindSearch = function() {
    var searchElt, searchField,
      _this = this;
    searchElt = $('#launch-search');
    searchField = $('#search-field');
    searchElt.unbind('click');
    searchField.unbind('keypress');
    searchElt.click(function() {
      return _this.resultCollectionView.search(searchField.val());
    });
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
module.exports = function anonymous(locals, attrs, escape, rethrow, merge
/**/) {
attrs = attrs || jade.attrs; escape = escape || jade.escape; rethrow = rethrow || jade.rethrow; merge = merge || jade.merge;
var buf = [];
with (locals || {}) {
var interp;
 if (value.length) {
{
buf.push('<a href="#" class="dropdown-toggle">');
 if (icons[category]) {
{
buf.push('<i');
buf.push(attrs({ "class": ("" + (icons[category]) + "") }, {"class":true}));
buf.push('></i>');
}
}
buf.push('<span class="menu-text firstLetterUp">' + escape((interp = category) == null ? '' : interp) + '</span><b class="arrow icon-angle-right"></b></a><ul class="submenu">');
 for (var index in value) {
{
 if (value[index].doctype) {
{
 displayName = value[index].displayName !== ''? value[index].displayName : value[index].doctype
buf.push('<li><a');
buf.push(attrs({ 'href':('#search/all/' + (value[index].doctype) + '') }, {"href":true}));
buf.push('><i class="icon-double-angle-right"></i>' + escape((interp = displayName) == null ? '' : interp) + '<span class="menu-little-text">&nbsp;(' + escape((interp = value[index].sum) == null ? '' : interp) + ')</span></a></li>');
}
 }
 else {
{
buf.push('<li><a href="#" class="dropdown-toggle"><i class="icon-double-angle-right"></i><span class="menu-text">' + escape((interp = value[index].key) == null ? '' : interp) + '</span><b class="arrow icon-angle-right"></b></a><ul class="submenu">');
 subValues = value[index].value
 for (var subIndex in subValues) {
{
 doctype = subValues[subIndex].doctype
 displayName = subValues[subIndex].displayName !== ''? subValues[subIndex].displayName : doctype
 sum = subValues[subIndex].sum
buf.push('<li><a');
buf.push(attrs({ 'href':('#search/all/' + (doctype) + '') }, {"href":true}));
buf.push('>' + escape((interp = displayName) == null ? '' : interp) + '<span class="menu-little-text">&nbsp;(' + escape((interp = sum) == null ? '' : interp) + ')</span></a></li>');
}
 }
buf.push('</ul></li>');
}
}
}
 }
buf.push('</ul>');
}
 }
 else {
{
buf.push('<a');
buf.push(attrs({ 'href':('#search/all/' + (name) + '') }, {"href":true}));
buf.push('>' + escape((interp = name) == null ? '' : interp) + '</a>');
}
}
}
return buf.join("");
};
});

;require.register("views/templates/modal_confirm", function(exports, require, module) {
module.exports = function anonymous(locals, attrs, escape, rethrow, merge
/**/) {
attrs = attrs || jade.attrs; escape = escape || jade.escape; rethrow = rethrow || jade.rethrow; merge = merge || jade.merge;
var buf = [];
with (locals || {}) {
var interp;
buf.push('<div id="confirmation-dialog" class="modal"><div class="modal-dialog"><div class="modal-content"><div class="modal-header"><button type="button" data-dismiss="modal" aria-hidden="true" class="close">x</button><h4 class="modal-title">' + escape((interp = title) == null ? '' : interp) + '</h4></div><div class="modal-body"><p class="modal-confirm-text">' + escape((interp = body) == null ? '' : interp) + '</p></div><div class="modal-footer"><span data-dismiss="modal" class="btn btn-link">cancel</span><span id="confirmation-dialog-confirm" data-dismiss="modal" class="btn btn-danger">' + escape((interp = confirm) == null ? '' : interp) + '</span></div></div></div></div>');
}
return buf.join("");
};
});

;require.register("views/templates/result_list", function(exports, require, module) {
module.exports = function anonymous(locals, attrs, escape, rethrow, merge
/**/) {
attrs = attrs || jade.attrs; escape = escape || jade.escape; rethrow = rethrow || jade.rethrow; merge = merge || jade.merge;
var buf = [];
with (locals || {}) {
var interp;
 if (results['no_result']) {
{
buf.push('<em>' + escape((interp = results['no_result_msg']) == null ? '' : interp) + '</em>');
}
 }
 else {
{
buf.push('<div class="panel-heading"><h4 class="panel-title"><a');
buf.push(attrs({ 'data-toggle':("collapse"), 'data-parent':("#basic-accordion"), 'href':("#collapse" + (results.count) + ""), "class": ('accordion-toggle') }, {"data-toggle":true,"data-parent":true,"href":true}));
buf.push('><i class="icon-plus-sign"></i><strong>&nbsp;' + escape((interp = results.heading.doctype) == null ? '' : interp) + '</strong>&nbsp;' + escape((interp = results.heading.field) == null ? '' : interp) + ' :\n&nbsp;' + escape((interp = results.heading.data) == null ? '' : interp) + '</a><div class="visible-md visible-lg hidden-sm hidden-xs btn-group result-buttons"><button class="btn btn-xs remove-result"><i class="icon-trash bigger-120"></i></button></div></h4></div><div');
buf.push(attrs({ 'style':("height: 0px;"), 'id':("collapse" + (results.count) + ""), "class": ('panel-collapse') + ' ' + ('collapse') }, {"style":true,"id":true}));
buf.push('><div class="panel-body"><div id="result-list" class="profile-user-info profile-user-info-striped">');
 for (var iCount = 0; iCount < results['fields'].length; iCount++) {
{
buf.push('<div class="profile-info-row"><div class="profile-info-name">' + escape((interp = results['fields'][iCount].cdbFieldName) == null ? '' : interp) + '</div><div class="profile-info-value">');
var __val__ = results['fields'][iCount].cdbFieldData
buf.push(null == __val__ ? "" : __val__);
buf.push('</div></div>');
}
 }
buf.push('</div></div></div>');
}
 }
}
return buf.join("");
};
});

;require.register("views/templates/result_table", function(exports, require, module) {
module.exports = function anonymous(locals, attrs, escape, rethrow, merge
/**/) {
attrs = attrs || jade.attrs; escape = escape || jade.escape; rethrow = rethrow || jade.rethrow; merge = merge || jade.merge;
var buf = [];
with (locals || {}) {
var interp;
 if (results['no_result']) {
{
buf.push('<em>' + escape((interp = results['no_result_msg']) == null ? '' : interp) + '</em>');
}
 }
 else {
{
 for (iCount2 = 0; iCount2 < results['fields'].length; iCount2++) {
{
 if (results['fields'][iCount2].cdbFieldTitle !== '') {
{
buf.push('<td');
buf.push(attrs({ 'title':("" + (results['fields'][iCount2].cdbFieldTitle) + "") }, {"title":true}));
buf.push('>');
var __val__ = results['fields'][iCount2].cdbFieldData
buf.push(null == __val__ ? "" : __val__);
buf.push('</td>');
}
} else {
{
buf.push('<td>');
var __val__ = results['fields'][iCount2].cdbFieldData
buf.push(null == __val__ ? "" : __val__);
buf.push('</td>');
}
}
}
}
{
buf.push('<td><button class="btn btn-xs remove-result"><i class="icon-trash bigger-120"></i></button></td>');
}
}
 }
}
return buf.join("");
};
});

;require.register("views/templates/results_global_controls", function(exports, require, module) {
module.exports = function anonymous(locals, attrs, escape, rethrow, merge
/**/) {
attrs = attrs || jade.attrs; escape = escape || jade.escape; rethrow = rethrow || jade.rethrow; merge = merge || jade.merge;
var buf = [];
with (locals || {}) {
var interp;
 if (doctype !== '') {
{
buf.push('<h4>&nbsp;&nbsp;Currently exploring :&nbsp;<em>' + escape((interp = doctype) == null ? '' : interp) + ' ' + escape((interp = range) == null ? '' : interp) + ' &nbsp;</em>');
 if (hasMetainfos) {
{
 if (isVisible) {
{
buf.push('<i class="about-doctype icon-question-sign white-and-green"></i>');
}
}
 else {
{
buf.push('<i class="about-doctype icon-question-sign"></i>');
}
}
}
 }
buf.push('&nbsp;<i');
buf.push(attrs({ "class": ('view-switcher') + ' ' + (icon_presentation) }, {"class":true}));
buf.push('></i></h4><div class="visible-md visible-lg hidden-sm hidden-xs btn-group result-buttons"><button id="delete-all" class="btn btn-xs"><span></span><i class="icon-trash bigger-120"></i></button></div>');
}
}
}
return buf.join("");
};
});

;require.register("views/templates/results_meta_infos", function(exports, require, module) {
module.exports = function anonymous(locals, attrs, escape, rethrow, merge
/**/) {
attrs = attrs || jade.attrs; escape = escape || jade.escape; rethrow = rethrow || jade.rethrow; merge = merge || jade.merge;
var buf = [];
with (locals || {}) {
var interp;
buf.push('<div class="widget-box"><div class="widget-header widget-header-small header-color-green"><h4 class="lighter"><i class="icon-question-sign"></i>');
 displayedDoctype = displayName !== '' ? displayName : name;
buf.push('&nbsp;About ' + escape((interp = displayedDoctype) == null ? '' : interp) + '</h4><div class="widget-toolbar"><span id="close-about-doctype"><i class="icon-remove"></i></span></div></div><div class="widget-body"><div class="widget-body-inner"><div class="widget-main padding-6"><div class="md-desc-wrapper">');
 if (applications && applications.length > 0) {
{
buf.push('<div class="md-desc-container"><strong>Applications using it :</strong><ul class="sober-list">');
 for (var index in applications) {
{
buf.push('<li class="firstLetterUp"><i class="icon-download-alt"></i><span>&nbsp;' + escape((interp = applications[index]) == null ? '' : interp) + '</span></li>');
}
 }
buf.push('</ul></div>');
}
}
 if (typeof(metadoctype) === 'object') {
{
buf.push('<div class="md-desc-container"><strong>Fields informations :</strong><ul class="sober-list">');
 var fields = metadoctype.fields;
 for (var obj in fields) {
{
buf.push('<li><i class="icon-tag"></i><span>&nbsp;' + escape((interp = fields[obj].displayName) == null ? '' : interp) + ' -&nbsp;<i>' + escape((interp = fields[obj].description) == null ? '' : interp) + '</i></span></li>');
}
 }
buf.push('</ul></div>');
}
 }
buf.push('</div></div><div class="clear"></div></div></div></div>');
}
return buf.join("");
};
});

;require.register("views/templates/search", function(exports, require, module) {
module.exports = function anonymous(locals, attrs, escape, rethrow, merge
/**/) {
attrs = attrs || jade.attrs; escape = escape || jade.escape; rethrow = rethrow || jade.rethrow; merge = merge || jade.merge;
var buf = [];
with (locals || {}) {
var interp;
buf.push('<div id="all-result"><div id="basic-accordion" class="accordion-style1 panel-group"></div><div id="basic-table" class="table-responsive"><table id="result-view-as-table" class="table table-striped table-bordered table-hover"><tbody></tbody></table></div><div class="load-more-result"><span>load more results&nbsp</span><br/><i class="icon-circle-arrow-down"></i></div></div>');
}
return buf.join("");
};
});

;
//@ sourceMappingURL=app.js.map