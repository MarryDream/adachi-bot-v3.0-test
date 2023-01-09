import {
	createRouter as _createRouter,
	createMemoryHistory,
	createWebHistory
} from "vue-router";

export function createRouter() {
    return _createRouter({
        history: import.meta.env.SSR
            ? createMemoryHistory()
            : createWebHistory(),
        routes: []
    })
}