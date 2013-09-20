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
      return globals.require(absolute);
    };
  };

  var initModule = function(name, definition) {
    var module = {id: name, exports: {}};
    definition(module.exports, localRequire(name), module);
    var exports = cache[name] = module.exports;
    return exports;
  };

  var require = function(name) {
    var path = expand(name, '.');

    if (has(cache, path)) return cache[path];
    if (has(modules, path)) return initModule(path, modules[path]);

    var dirIndex = expand(path, './index');
    if (has(cache, dirIndex)) return cache[dirIndex];
    if (has(modules, dirIndex)) return initModule(dirIndex, modules[dirIndex]);

    throw new Error('Cannot find module "' + name + '"');
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

  globals.require = require;
  globals.require.define = define;
  globals.require.register = define;
  globals.require.brunch = true;
})();

window.require.register("application", function(exports, require, module) {
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
window.require.register("collections/doctype_collection", function(exports, require, module) {
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
window.require.register("collections/result_collection", function(exports, require, module) {
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

    ResultCollection.prototype.url = function() {
      return 'search?page=' + this.page + '&nbperpage=' + this.nbPerPage;
    };

    ResultCollection.prototype.page = 1;

    ResultCollection.prototype.nbPerPage = 10;

    return ResultCollection;

  })(Backbone.Collection);
  
});
window.require.register("initialize", function(exports, require, module) {
  var app;

  app = require('application');

  $(function() {
    require('lib/app_helpers');
    return app.initialize();
  });
  
});
window.require.register("lib/app_helpers", function(exports, require, module) {
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
window.require.register("lib/base_view", function(exports, require, module) {
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
window.require.register("lib/view", function(exports, require, module) {
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
window.require.register("lib/view_collection", function(exports, require, module) {
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
window.require.register("models/doctype_model", function(exports, require, module) {
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
window.require.register("models/result_model", function(exports, require, module) {
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
window.require.register("router", function(exports, require, module) {
  var DoctypeCollectionView, DoctypesView, NavView, ResultCollectionView, Router, SearchView, _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  NavView = require('views/nav_view');

  DoctypesView = require('views/doctypes_view');

  DoctypeCollectionView = require('views/doctype_collection_view');

  SearchView = require('views/search_view');

  ResultCollectionView = require('views/result_collection_view');

  module.exports = Router = (function(_super) {
    __extends(Router, _super);

    function Router() {
      _ref = Router.__super__.constructor.apply(this, arguments);
      return _ref;
    }

    Router.prototype.routes = {
      '': 'doctypes',
      'doctypes': 'doctypes',
      'search': 'search',
      'search/all/:doctype': 'search'
    };

    Router.prototype.redirectToDoctypes = function() {
      return this.navigate("/doctypes", true);
    };

    Router.prototype.doctypes = function() {
      var dcView, doctypesView, navView;
      navView = new NavView();
      doctypesView = new DoctypesView();
      doctypesView.render();
      dcView = new DoctypeCollectionView();
      return dcView.render();
    };

    Router.prototype.search = function(doctype) {
      var navView, options, searchView;
      navView = new NavView();
      options = {};
      if (doctype != null) {
        options['range'] = 'all';
        options['docType'] = doctype;
      }
      searchView = new SearchView(options);
      return searchView.render();
    };

    return Router;

  })(Backbone.Router);
  
});
window.require.register("views/doctype_collection_view", function(exports, require, module) {
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
window.require.register("views/doctype_view", function(exports, require, module) {
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
        sum: this.model.get("sum"),
        app: this.model.get("app")
      });
    };

    DoctypeView.prototype.template = function() {
      return require('./templates/doctype');
    };

    DoctypeView.prototype.events = {
      'click .more-info': 'showDescription'
    };

    DoctypeView.prototype.showDescription = function(e) {
      var descWrapper, jqObj, newTd, newTr;
      jqObj = $(e.currentTarget);
      if (jqObj.hasClass('label-primary')) {
        descWrapper = jqObj.parent().children('.md-desc-wrapper');
        newTd = $(document.createElement('td')).attr('colspan', '3');
        newTr = $(document.createElement('tr')).addClass('bg-gray');
        descWrapper.appendTo(newTd).show();
        newTd.appendTo(newTr);
        jqObj.closest("." + this.className).after(newTr);
        return jqObj.removeClass('label-primary').addClass('label-danger').empty().append(' Hide info <i class="icon-minus-sign"></i> ');
      } else {
        descWrapper = jqObj.closest("." + this.className).next("tr").find('.md-desc-wrapper').hide();
        jqObj.parent().append(descWrapper);
        jqObj.closest("." + this.className).next("tr").remove();
        return jqObj.removeClass('label-danger').addClass('label-primary').empty().append(' More info <i class="icon-plus-sign"></i> ');
      }
    };

    return DoctypeView;

  })(View);
  
});
window.require.register("views/doctypes_view", function(exports, require, module) {
  var BaseView, DoctypesView, _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  BaseView = require('../lib/base_view');

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
window.require.register("views/nav_view", function(exports, require, module) {
  var BaseView, NavView, _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  BaseView = require('../lib/base_view');

  module.exports = NavView = (function(_super) {
    __extends(NavView, _super);

    function NavView() {
      _ref = NavView.__super__.constructor.apply(this, arguments);
      return _ref;
    }

    NavView.prototype.el = 'body.application';

    NavView.prototype.titles = {
      '': '#doctypes',
      'doctypes': '#doctypes',
      'search': '#search',
      'searchAllByDoctype': '#search'
    };

    NavView.prototype.initialize = function() {
      return Backbone.history.on('route', function(source, path) {
        return this.render(path);
      }, this);
    };

    NavView.prototype.render = function(path) {
      var that;
      that = this;
      return $('.nav > li').each(function() {
        $(this).removeClass('active');
        $(this).children('a').blur();
        if ($(this).children('a').attr('href') === that.titles[path]) {
          return $(this).addClass('active');
        }
      });
    };

    return NavView;

  })(BaseView);
  
});
window.require.register("views/result_collection_view", function(exports, require, module) {
  var ResultCollection, ResultCollectionView, ResultView, ViewCollection, _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  ViewCollection = require('../lib/view_collection');

  ResultCollection = require('../collections/result_collection');

  ResultView = require('./result_view');

  module.exports = ResultCollectionView = (function(_super) {
    __extends(ResultCollectionView, _super);

    function ResultCollectionView() {
      _ref = ResultCollectionView.__super__.constructor.apply(this, arguments);
      return _ref;
    }

    ResultCollectionView.prototype.itemview = ResultView;

    ResultCollectionView.prototype.collectionEl = '#basic-accordion';

    ResultCollectionView.prototype.isLoading = false;

    ResultCollectionView.prototype.noMoreItems = false;

    ResultCollectionView.prototype.initialize = function() {
      var that;
      that = this;
      this.collection = new ResultCollection();
      ResultCollectionView.__super__.initialize.apply(this, arguments);
      return this.collection.fetch({
        data: $.param(this.options),
        success: function(col, data) {
          if ((that.options.range != null) && (that.options.docType != null)) {
            if (data.length === that.collection.nbPerPage) {
              that.loopFirstScroll();
              return $('.load-more-result').show();
            } else {
              that.noMoreItems = true;
              return $('.load-more-result').hide();
            }
          }
        },
        error: function() {
          return that.displayLoadingError();
        }
      });
    };

    ResultCollectionView.prototype.search = function(content) {
      var that;
      that = this;
      this.options['query'] = content;
      return this.collection.fetch({
        data: $.param(this.options)
      });
    };

    ResultCollectionView.prototype.loadNextPage = function(isTriggered, callback) {
      var that;
      that = this;
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
            if (!isTriggered) {
              $('.load-more-result .spinner').hide();
              $('.load-more-result i, .load-more-result span').show();
            }
            that.noMoreItems = data.length < that.collection.nbPerPage;
            if (that.noMoreItems) {
              $('.load-more-result').hide();
            }
            that.isLoading = false;
            if (callback != null) {
              return callback();
            }
          },
          error: function() {
            return that.displayLoadingError();
          }
        });
      }
    };

    ResultCollectionView.prototype.loopFirstScroll = function() {
      var firstScroll, that;
      that = this;
      if (!this.isLoading && !this.noMoreItems) {
        firstScroll = $(document).height() === $(window).height();
        if (firstScroll) {
          return this.loadNextPage(true, function() {
            return that.loopFirstScroll();
          });
        }
      }
    };

    ResultCollectionView.prototype.displayLoadingError = function() {
      $('.load-more-result').css({
        'color': '#AF4434'
      });
      $('.load-more-result i').hide();
      $('.load-more-result span').text('An error occurs during the loading process');
      return $('.load-more-result').show();
    };

    return ResultCollectionView;

  })(ViewCollection);
  
});
window.require.register("views/result_view", function(exports, require, module) {
  var ResultView, View, _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  View = require('./../lib/view');

  module.exports = ResultView = (function(_super) {
    __extends(ResultView, _super);

    function ResultView() {
      _ref = ResultView.__super__.constructor.apply(this, arguments);
      return _ref;
    }

    ResultView.prototype.tagName = 'div';

    ResultView.prototype.className = 'accordion-group';

    ResultView.prototype.render = function() {
      var that;
      that = this;
      return ResultView.__super__.render.call(this, {
        results: that.manageResultsForView(this.model.attributes, this.model.get("count"))
      });
    };

    ResultView.prototype.manageResultsForView = function(attr, count) {
      var field, iCounter, obj, results;
      results = {};
      if (attr.no_result != null) {
        $('#all-result .accordion').empty();
        results['no_result'] = true;
        return results;
      } else {
        results['no_result'] = false;
        results['count'] = count;
        results['heading'] = {
          'field': attr.idField != null ? attr.idField : 'id',
          'data': attr.idField != null ? attr[attr.idField] : attr._id
        };
        results['fields'] = [];
        iCounter = 0;
        for (field in attr) {
          if (field !== 'idField' && field !== 'count' && field !== 'descField') {
            results['fields'][iCounter] = {
              'cdbFieldDescription': "",
              'cdbFieldName': field,
              'cdbFieldData': "",
              'cdbLabelClass': "label-secondary"
            };
            if ((attr.descField != null) && (attr.descField[field] != null)) {
              if (attr.descField[field].description != null) {
                results['fields'][iCounter]['cdbFieldDescription'] = attr.descField[field].description;
              }
              if ((attr.descField[field].displayName != null) && attr.descField[field].displayName !== "") {
                results['fields'][iCounter]['cdbFieldName'] = attr.descField[field].displayName;
                if (field === results['heading']['field']) {
                  results['heading']['field'] = attr.descField[field].displayName;
                }
              }
            }
            if (typeof attr[field] === 'string' || typeof attr[field] === 'number' || typeof attr[field] === 'boolean') {
              results['fields'][iCounter]['cdbFieldData'] = attr[field];
            } else if ((attr[field] != null) && typeof attr[field] === 'object') {
              results['fields'][iCounter]['cdbFieldData'] = '<ul class="sober-list">';
              for (obj in attr[field]) {
                if (typeof attr[field][obj] === 'string' || typeof attr[field][obj] === 'number' || typeof attr[field][obj] === 'boolean') {
                  results['fields'][iCounter]['cdbFieldData'] += '<li>' + obj + ' : <i>' + attr[field][obj] + '</i></li>';
                } else if ((attr[field][obj] != null) && typeof attr[field][obj] === 'object') {
                  results['fields'][iCounter]['cdbFieldData'] += '<li>' + obj + ' : <i>' + $.stringify(attr[field][obj]) + '</i></li>';
                } else {
                  results['fields'][iCounter]['cdbFieldData'] += '<li><i>empty</i></li>';
                  results['fields'][iCounter]['cdbLabelClass'] = 'label-danger';
                }
              }
              results['fields'][iCounter]['cdbFieldData'] += '</ul>';
            } else {
              results['fields'][iCounter]['cdbFieldData'] = '<i>empty</i>';
              results['fields'][iCounter]['cdbLabelClass'] = 'label-danger';
            }
          }
          iCounter++;
        }
        return results;
      }
    };

    ResultView.prototype.template = function() {
      return require('./templates/result');
    };

    ResultView.prototype.templateModal = require('./templates/modal_confirm');

    ResultView.prototype.events = {
      'click .accordion-toggle': 'blurIt',
      'mouseenter .label': 'showFieldDescription',
      'mouseleave .label': 'showFieldDescription',
      'click .remove-result': 'confirmRemoveResult'
    };

    ResultView.prototype.blurIt = function(e) {
      return $(e.currentTarget).blur();
    };

    ResultView.prototype.showFieldDescription = function(e) {
      var jqObj, left, top;
      jqObj = $(e.currentTarget);
      if (jqObj.attr("data-title") !== "") {
        if (e.type === 'mouseenter') {
          left = jqObj.offset().left - $('#basic-accordion.accordion').offset().left - 5;
          top = jqObj.offset().top - $('#basic-accordion.accordion').offset().top - 7;
          $('.info-box .field-title').css({
            'padding-left': jqObj.width() + 18
          });
          $('.info-box .field-description').empty().html(jqObj.attr("data-title"));
          $('.info-box').css({
            'z-index': '5',
            'left': left,
            'top': top
          });
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
      var data, that;
      that = this;
      e.preventDefault();
      data = {
        title: 'Confirmation required',
        body: 'Are you sure ? This can\'t be undone, and will erase definitly the data from the database.',
        confirm: 'delete permanently'
      };
      $("body").prepend(this.templateModal(data));
      $("#confirmation-dialog").modal();
      $("#confirmation-dialog").modal("show");
      return $("#confirmation-dialog-confirm").bind("click", function() {
        return that.removeResult();
      });
    };

    ResultView.prototype.removeResult = function() {
      this.model.set('id', this.model.get('_id'));
      this.model.destroy({
        data: 'id=' + this.model.get('id')
      });
      return $(window).resize();
    };

    return ResultView;

  })(View);
  
});
window.require.register("views/search_view", function(exports, require, module) {
  var BaseView, ResultCollectionView, SearchView, _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  BaseView = require('../lib/base_view');

  ResultCollectionView = require('../views/result_collection_view');

  module.exports = SearchView = (function(_super) {
    __extends(SearchView, _super);

    function SearchView() {
      _ref = SearchView.__super__.constructor.apply(this, arguments);
      return _ref;
    }

    SearchView.prototype.el = '#content';

    SearchView.prototype.template = require('./templates/search');

    SearchView.prototype.initialize = function() {
      var that;
      that = this;
      this.rcView = new ResultCollectionView(this.options);
      if (this.options.range != null) {
        return $(window).bind('scroll', function(e, isTriggered) {
          if (!that.rcView.isLoading && !that.rcView.noMoreItems) {
            if ($(window).scrollTop() + $(window).height() === $(document).height()) {
              return that.loadMore(isTriggered);
            }
          }
        });
      }
    };

    SearchView.prototype.afterRender = function() {
      var that;
      that = this;
      this.rcView.render();
      return $(window).bind('resize', function() {
        return that.rcView.loopFirstScroll();
      });
    };

    SearchView.prototype.loadMore = function(isTriggered) {
      return this.rcView.loadNextPage(isTriggered);
    };

    SearchView.prototype.events = {
      'click #launch-search': 'launchSearch'
    };

    SearchView.prototype.launchSearch = function() {
      return this.rcView.search($('#search-field').val());
    };

    return SearchView;

  })(BaseView);
  
});
window.require.register("views/templates/doctype", function(exports, require, module) {
  module.exports = function anonymous(locals, attrs, escape, rethrow, merge) {
  attrs = attrs || jade.attrs; escape = escape || jade.escape; rethrow = rethrow || jade.rethrow; merge = merge || jade.merge;
  var buf = [];
  with (locals || {}) {
  var interp;
  buf.push('<td class="full firstLetterUp"><a');
  buf.push(attrs({ 'href':('#search/all/' + (name) + '') }, {"href":true}));
  buf.push('>' + escape((interp = name) == null ? '' : interp) + '</a></td><td>');
   if (typeof(sum) === 'number'){
  {
  buf.push('<span>' + escape((interp = sum) == null ? '' : interp) + '</span>');
  }
   }
  buf.push('</td><td> ');
   if (typeof(metadoctype) === 'object' || app.length > 0){
  {
  buf.push('<span class="label label-primary more-info">More info <i class="icon-plus-sign"> </i></span><div class="md-desc-wrapper"><h5> <i class="icon-question-sign"> </i>&nbsp;&nbsp;About ' + escape((interp = name) == null ? '' : interp) + '</h5>');
   if (app.length > 0) {
  {
  buf.push('<div class="md-desc-container"><strong>Applications using it :</strong><ul class="sober-list">');
   for (var index in app) {
  {
  buf.push('<li class="firstLetterUp"><i class="icon-download-alt"></i><span>' + escape((interp = app[index]) == null ? '' : interp) + '</span></li>');
  }
   }
  buf.push('</ul></div>');
  }
  }
   if (typeof(metadoctype) === 'object') {
  {
  buf.push('<div class="md-desc-container"><strong>Fields informations :</strong><ul class="sober-list">');
   var fields = metadoctype.fields[0];
   for (var obj in fields) {
  {
  buf.push('<li><i class="icon-tag"></i><span>' + escape((interp = fields[obj].displayName) == null ? '' : interp) + ' - <i>' + escape((interp = fields[obj].description) == null ? '' : interp) + ' </i></span></li>');
  }
   }
  buf.push('</ul></div>');
  }
   }
  buf.push('</div>');
  }
   }
   else {
  {
  buf.push('<i>No information available</i>');
  }
   }
  buf.push('</td>');
  }
  return buf.join("");
  };
});
window.require.register("views/templates/doctypes", function(exports, require, module) {
  module.exports = function anonymous(locals, attrs, escape, rethrow, merge) {
  attrs = attrs || jade.attrs; escape = escape || jade.escape; rethrow = rethrow || jade.rethrow; merge = merge || jade.merge;
  var buf = [];
  with (locals || {}) {
  var interp;
  buf.push('<div id="masthead"><div class="container"><div class="masthead-pad">           <div class="masthead-text"><h2>Doctypes</h2><p>Here you can find the full list of document types present on your cozy</p></div></div></div></div><div class="container"><div class="row"><div class="span12"><h3 class="title">My current doctype list	</h3></div><div class="span11 offset1">	<div id="doctypes-container"><table class="table"><thead>						<th>Name</th><th>Number of documents</th><th>About that doctype</th></thead><tbody id="doctypes-list"></tbody></table></div></div></div></div>');
  }
  return buf.join("");
  };
});
window.require.register("views/templates/modal_confirm", function(exports, require, module) {
  module.exports = function anonymous(locals, attrs, escape, rethrow, merge) {
  attrs = attrs || jade.attrs; escape = escape || jade.escape; rethrow = rethrow || jade.rethrow; merge = merge || jade.merge;
  var buf = [];
  with (locals || {}) {
  var interp;
  buf.push('<div id="confirmation-dialog" class="modal"><div class="modal-dialog"><div class="modal-content"><div class="modal-header"><button type="button" data-dismiss="modal" aria-hidden="true" class="close">x</button><h4 class="modal-title">' + escape((interp = title) == null ? '' : interp) + '</h4></div><div class="modal-body"><p>' + escape((interp = body) == null ? '' : interp) + '</p></div><div class="modal-footer"><span data-dismiss="modal" class="btn btn-link">cancel</span><span id="confirmation-dialog-confirm" data-dismiss="modal" class="btn btn-cozy">' + escape((interp = confirm) == null ? '' : interp) + '</span></div></div></div></div>');
  }
  return buf.join("");
  };
});
window.require.register("views/templates/result", function(exports, require, module) {
  module.exports = function anonymous(locals, attrs, escape, rethrow, merge) {
  attrs = attrs || jade.attrs; escape = escape || jade.escape; rethrow = rethrow || jade.rethrow; merge = merge || jade.merge;
  var buf = [];
  with (locals || {}) {
  var interp;
   if (results['no_result']) {
  buf.push('<em>No results for now.</em>');
   }
   else {
  buf.push('<div class="accordion-heading"><a');
  buf.push(attrs({ 'data-toggle':("collapse"), 'data-parent':("#basic-accordion"), 'href':("#collapse" + (results.count) + ""), "class": ('accordion-toggle') }, {"data-toggle":true,"data-parent":true,"href":true}));
  buf.push('><i class="icon-plus-sign"></i>&nbsp;' + escape((interp = results.heading.field) == null ? '' : interp) + ' :\n&nbsp;' + escape((interp = results.heading.data) == null ? '' : interp) + '</a><div class="remove-result">Remove&nbsp;&nbsp;<i class="icon-remove-sign"></i></div></div><div');
  buf.push(attrs({ 'style':("height: 0px;"), 'id':("collapse" + (results.count) + ""), "class": ('accordion-body') + ' ' + ('collapse') }, {"style":true,"id":true}));
  buf.push('><div class="accordion-inner"><table id="result-list" class="table">');
   for (var iCount = 0; iCount < results['fields'].length; iCount++) {
  {
  buf.push('<tr>	<td> <span');
  buf.push(attrs({ 'data-title':("" + (results['fields'][iCount].cdbFieldDescription) + ""), "class": ('label') + ' ' + ("" + (results['fields'][iCount].cdbLabelClass) + "") }, {"class":true,"data-title":true}));
  buf.push('>&nbsp;' + escape((interp = results['fields'][iCount].cdbFieldName) == null ? '' : interp) + '&nbsp; ');
   if (results['fields'][iCount].cdbFieldDescription!== "") {
  {
  buf.push('<i class="icon-question-sign"></i>');
  }
  }
  buf.push('</span></td><td>');
  var __val__ = results['fields'][iCount].cdbFieldData
  buf.push(null == __val__ ? "" : __val__);
  buf.push('</td></tr>');
  }
   }
  buf.push('</table></div></div>');
   }
  }
  return buf.join("");
  };
});
window.require.register("views/templates/search", function(exports, require, module) {
  module.exports = function anonymous(locals, attrs, escape, rethrow, merge) {
  attrs = attrs || jade.attrs; escape = escape || jade.escape; rethrow = rethrow || jade.rethrow; merge = merge || jade.merge;
  var buf = [];
  with (locals || {}) {
  var interp;
  buf.push('<div id="masthead"><div class="container"><div class="masthead-pad">           <div class="masthead-text"><h2>Search Engine</h2><p>Here you can prepare and launch your search</p></div><div class="masthead-text"><span id="search-label" class="search-label">My search</span><input type="text" id="search-field"/><button id="launch-search" class="btn btn-tertiary"><i class="icon-search"></i></button></div><div class="masthead-text"><span class="label-search">My options</span></div></div></div></div><div class="container"><div class="row"><div class="span12">		<h3 class="title">Results of my previous search</h3><div id="all-result"><div id="basic-accordion" class="accordion"></div><div class="info-box"><span class="field-title">&nbsp;About this field</span><span class="field-description"><em>no information</em></span></div><div class="load-more-result"> <span>load more results&nbsp</span><br/><i class="icon-circle-arrow-down"></i></div></div></div></div></div>');
  }
  return buf.join("");
  };
});
