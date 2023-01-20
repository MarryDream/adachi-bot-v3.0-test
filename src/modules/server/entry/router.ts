import {
    createRouter as _createRouter,
    createWebHistory,
    createMemoryHistory
} from "vue-router";
import { RenderRoutes } from "@/types/render";

export function createRouter() {
	const routes: Array<RenderRoutes> = globalThis.__ADACHI_ROUTES__ || [];
    return _createRouter({
        history: globalThis.global
            ? createMemoryHistory()
            : createWebHistory(),
        routes: routes.map( ({ path, componentData: { plugin, renderDir, fileName } }) => {
			// vite 使用 @rollup/plugin-dynamic-import-vars 对包含连接的字符串的 import 导入进行了限制，参考地址：
			// https://github.com/rollup/plugins/tree/master/packages/dynamic-import-vars#limitations
	        return {
		        path,
		        component: () => import(`../../../plugins/${plugin}/${renderDir}/${fileName}.vue`)
	        }
        })
    })
}