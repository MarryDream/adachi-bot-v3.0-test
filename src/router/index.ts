import {
    createRouter as _createRouter,
    createWebHistory,
    createMemoryHistory,
    RouteRecordRaw
} from "vue-router";

const routes: Array<RouteRecordRaw> = [
    {
        path: "/",
        component: () => import("@/views/Main.vue")
    },
    {
        path: "/test",
        component: () => import("@/views/Test.vue")
    }
];

export function createRouter() {
    return _createRouter({
        history: import.meta.env.SSR
            ? createMemoryHistory()
            : createWebHistory(),
        routes
    })
}