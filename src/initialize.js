import app from "./application";
import "./styles/app.styl";

window.app = app;

$(() => app.initialize());
