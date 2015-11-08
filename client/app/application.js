import MenuView from "views/menu";
import MainView from "views/main";

export default {
    initialize() {
        this.views = {
            menu: new MenuView(),
            main: new MainView()
        };
        this.views.menu.$el.appendTo("#container");
        this.views.main.$el.appendTo("#container");
    }
}

