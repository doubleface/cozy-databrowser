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
    options = _.extend({}, {
      model: model
    }, this.itemViewOptions(model));
    view = new this.itemview(options);
    this.views[model.cid] = view.render();
    this.appendView(view);
    return this.onChange(this.views);
  };

  ViewCollection.prototype.removeItem = function(model) {
    this.views[model.cid].remove();
    delete this.views[model.cid];
    return this.onChange(this.views);
  };

  return ViewCollection;

})(BaseView);

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

;require.register("router", function(exports, require, module) {
var AppView, DoctypeCollectionView, DoctypesView, Router, dcView, doctypesView, _ref,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

AppView = require('views/app_view');

DoctypesView = require('views/doctypes_view');

DoctypeCollectionView = require('views/doctype_collection_view');

module.exports = Router = (function(_super) {
  __extends(Router, _super);

  function Router() {
    _ref = Router.__super__.constructor.apply(this, arguments);
    return _ref;
  }

  Router.prototype.routes = {
    '': 'main',
    'doctypes': 'doctypes'
  };

  Router.prototype.main = function() {
    var mainView;
    mainView = new AppView();
    return mainView.render();
  };

  Router.prototype.doctypes = function() {};

  return Router;

})(Backbone.Router);

doctypesView = new DoctypesView();

doctypesView.render();

dcView = new DoctypeCollectionView();

dcView.render();

});

;require.register("views/app_view", function(exports, require, module) {
var AppView, BaseView, _ref,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

BaseView = require('../lib/base_view');

module.exports = AppView = (function(_super) {
  __extends(AppView, _super);

  function AppView() {
    _ref = AppView.__super__.constructor.apply(this, arguments);
    return _ref;
  }

  AppView.prototype.el = 'body.application';

  AppView.prototype.template = require('./templates/home');

  AppView.prototype.afterRender = function() {
    return console.log("write more code here !");
  };

  return AppView;

})(BaseView);

});

;require.register("views/doctype_collection_view", function(exports, require, module) {
var DoctypeCollection, DoctypeCollectionView, DoctypeView, ViewCollection, _ref,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

ViewCollection = require('../lib/view_collection');

DoctypeCollection = require('../collections/doctype_collection');

DoctypeView = require('./doctype_view');

module.exports = DoctypeCollectionView = (function(_super) {
  __extends(DoctypeCollectionView, _super);

  function DoctypeCollectionView() {
    _ref = DoctypeCollectionView.__super__.constructor.apply(this, arguments);
    return _ref;
  }

  DoctypeCollectionView.prototype.itemview = DoctypeView;

  DoctypeCollectionView.prototype.collection = new DoctypeCollection();

  DoctypeCollectionView.prototype.initialize = function() {
    this.collectionEl = '#doctypes-list';
    DoctypeCollectionView.__super__.initialize.apply(this, arguments);
    this.collection.fetch();
    this.views = {};
    return this.listenTo(this.collection, "reset", this.onReset);
  };

  return DoctypeCollectionView;

})(ViewCollection);

});

;require.register("views/doctype_view", function(exports, require, module) {
var DoctypeView, View, _ref,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

View = require('./../lib/view');

module.exports = DoctypeView = (function(_super) {
  __extends(DoctypeView, _super);

  function DoctypeView() {
    _ref = DoctypeView.__super__.constructor.apply(this, arguments);
    return _ref;
  }

  DoctypeView.prototype.tagName = 'tr';

  DoctypeView.prototype.className = 'doctype-list-item';

  DoctypeView.prototype.render = function() {
    return DoctypeView.__super__.render.call(this, {
      name: this.model.get("name"),
      metadoctype: this.model.get("metadoctype"),
      sum: this.model.get("sum")
    });
  };

  DoctypeView.prototype.template = function() {
    return require('./templates/doctype');
  };

  return DoctypeView;

})(View);

});

;require.register("views/doctypes_view", function(exports, require, module) {
var BaseView, DoctypeCollectionView, DoctypesView, _ref,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

BaseView = require('../lib/base_view');

DoctypeCollectionView = require('views/doctype_collection_view');

module.exports = DoctypesView = (function(_super) {
  __extends(DoctypesView, _super);

  function DoctypesView() {
    _ref = DoctypesView.__super__.constructor.apply(this, arguments);
    return _ref;
  }

  DoctypesView.prototype.el = '#content';

  DoctypesView.prototype.template = require('./templates/doctypes');

  return DoctypesView;

})(BaseView);

});

;require.register("views/templates/doctype", function(exports, require, module) {
module.exports = function anonymous(locals, attrs, escape, rethrow, merge) {
attrs = attrs || jade.attrs; escape = escape || jade.escape; rethrow = rethrow || jade.rethrow; merge = merge || jade.merge;
var buf = [];
with (locals || {}) {
var interp;
buf.push('<td> ');
 if (typeof(metadoctype) === 'object'){
{
buf.push('<span class="label label-primary">more info</span>');
}
 }
buf.push('</td><td class="full"><a href="/#research">' + escape((interp = name) == null ? '' : interp) + '</a></td><td> ');
 if (typeof(metadoctype) === 'object'){
{
buf.push('<span>' + escape((interp = sum) == null ? '' : interp) + '</span>');
}
 }
buf.push('</td>');
}
return buf.join("");
};
});

;require.register("views/templates/doctypes", function(exports, require, module) {
module.exports = function anonymous(locals, attrs, escape, rethrow, merge) {
attrs = attrs || jade.attrs; escape = escape || jade.escape; rethrow = rethrow || jade.rethrow; merge = merge || jade.merge;
var buf = [];
with (locals || {}) {
var interp;
buf.push('<div class="container"><div class="row"><div class="span12"><h3 class="title">My current doctype list			</h3><div id="doctypes-container"><table class="table"><thead>						<th>description</th><th>Name</th><th>entry</th></thead><tbody id="doctypes-list"></tbody></table></div></div></div></div>');
}
return buf.join("");
};
});

;require.register("views/templates/home", function(exports, require, module) {
module.exports = function anonymous(locals, attrs, escape, rethrow, merge) {
attrs = attrs || jade.attrs; escape = escape || jade.escape; rethrow = rethrow || jade.rethrow; merge = merge || jade.merge;
var buf = [];
with (locals || {}) {
var interp;
buf.push('<div id="content"><h1>Cozy template</h1><h2>Welcome</h2><ul><li> <a href="https://github.com/mycozycloud/cozy-setup/wiki">Documentation</a></li><li> <a href="https://github.com/mycozycloud/cozy-setup/wiki/Getting-started">Getting Started</a></li><li> <a href="https://github.com/mycozycloud">Github</a></li></ul></div>');
}
return buf.join("");
};
});

;
//@ sourceMappingURL=app.js.map