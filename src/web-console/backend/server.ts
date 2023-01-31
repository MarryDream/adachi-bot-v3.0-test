import { renderToString } from 'vue/server-renderer'
import { createApp } from '../frontend/main';

export async function render( url: string ) {
	const { app, router } = createApp();
	
	await router.push( url );
	await router.isReady();
	
	const ctx = {}
	const html = await renderToString( app, ctx );
	
	return html;
}