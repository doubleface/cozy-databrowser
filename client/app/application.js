import MenuView from "views/menu";
import MainView from "views/main";

var Router = Backbone.Router.extend({
    routes: {
        "doctype/:doctype": "onDoctype"
    },
    onDoctype(doctype){
        this.app.views.main.setDoctype(doctype);
    }

});

var app = {
    initialize() {
        this.views = {
            menu: new MenuView(),
            main: new MainView()
        };
        this.views.menu.$el.appendTo("#container");
        this.views.main.$el.appendTo("#container");
        this.router = new Router({
            app: this
        });
        this.router.app = this;
        Backbone.history.start();
    }
}

var router = new Router();

export default app

