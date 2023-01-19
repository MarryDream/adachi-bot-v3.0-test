import { renderToString } from 'vue/server-renderer'
import { createApp } from './main';
import { RouteRecordRaw } from "vue-router";

export async function render( url: string, routers: Array<RouteRecordRaw> ) {
	const { app, router } = createApp();
	
	// routers.forEach( r => {
	// 	router.addRoute( r );
	// } )
	//
	// console.log(router.getRoutes())
	
	await router.push( url );
	await router.isReady();
	
	const ctx = {}
	const html = await renderToString( app, ctx );
	
	return html;
}