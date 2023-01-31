import { createSSRApp } from "vue";
import { createRouter } from "./router";
import App from "./App.vue";
import ElementPlus from "element-plus";
import "element-plus/dist/index.css";
import "./assets/styles/index.scss";
import "./permission";

export function createApp() {
	const app = createSSRApp( App );
	const router = createRouter();
	app.use( router )
		.use( ElementPlus );
	return { app, router };
}
