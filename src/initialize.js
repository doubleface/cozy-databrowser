import app from "./application";
import "./styles/app.styl";
import "../node_modules/font-awesome/css/font-awesome.min.css";

window.app = app;

$(() => app.initialize());
