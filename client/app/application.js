import MenuView from "views/menu";
import MainView from "views/main";

var Router = Backbone.Router.extend({
    routes: {
        "doctype/:doctype": "onDoctype"
    },
    onDoctype(doctype){
        this.app.views.main.setDoctype(doctype);
        this.app.views.menu.select(doctype);
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

        $("[formaction='drawer/toggle']").on("click", () => {
            const $aside = $("aside")
            const isExpanded = $aside.attr("aria-expanded") === "true" ? "false" : "true";
            $aside.attr("aria-expanded", isExpanded);
        });
    }
}

var router = new Router();

export default app

