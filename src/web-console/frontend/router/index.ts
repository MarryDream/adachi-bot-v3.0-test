import {
	createRouter as _createRouter,
	createWebHistory,
	createMemoryHistory
} from "vue-router";
import systemRouters from "./system.js";
import { RouteRecordRaw } from "vue-router";

const routes: Array<RouteRecordRaw> = [
	{
		path: "/",
		redirect: "/login"
	}, {
		path: "/login",
		name: "Login",
		component: () => import( "&/views/login.vue" ),
		meta: { title: "登录", noAuth: true }
	},
	...systemRouters,
	{
		path: '/:catchAll(.*)',
		name: '404',
		meta: { title: '404', noAuth: true },
		component: () => import('&/views/not-found.vue')
	}
];

export function createRouter() {
	return _createRouter( {
		history: globalThis.global
			? createMemoryHistory()
			: createWebHistory(),
		routes
	});
}
