import app from "./application";
import "./styles/app.styl";

window.app = app;
window.cozy = new Cozy({});

$(() => app.initialize());
