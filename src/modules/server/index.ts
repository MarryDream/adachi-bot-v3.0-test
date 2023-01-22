import fs from "fs";
import { resolve } from "path";
import express from "express";
import { createServer as createViteServer } from "vite";
import { RenderRoutes, ServerRouters } from "@/types/render";

export default class RenderServer {
	
	private renderRoutes: Array<RenderRoutes>;
	private readonly serverRouters: Array<ServerRouters>;
	
	constructor( renderRoutes: Array<RenderRoutes>, serverRouters: Array<ServerRouters> ) {
		this.renderRoutes = renderRoutes;
		this.serverRouters = serverRouters;
		this.createServer().catch();
	}
	
	public addRoutes( routes: Array<RenderRoutes> ) {
		this.renderRoutes = this.renderRoutes.concat( routes );
	}
	
	public async createServer() {
		const app = express();
		
		globalThis.__ADACHI_ROUTES__ = this.renderRoutes;
		// 以中间件模式创建 Vite 应用，这将禁用 Vite 自身的 HTML 服务逻辑
		// 并让上级服务器接管控制
		// 执行此方法后将会调用指定 root 目录下的 vite.config.ts
		const vite = await createViteServer( {
			base: "/",
			root: __dirname,
			server: { middlewareMode: true },
			appType: "custom"
		} );
		
		// 使用 vite 的 Connect 实例作为中间件
		// 如果你使用了自己的 express 路由（express.Router()），你应该使用 router.use
		app.use( vite.middlewares );
		
		// 遍历注册插件 express 路由
		for ( const r of this.serverRouters ) {
			app.use( r.path, r.router );
		}
		
		console.log( this.serverRouters )
		
		app.use( '*', async ( req, res, next ) => {
			// 服务 index.html - 下面我们来处理这个问题
			const url = req.originalUrl;
			
			try {
				// 1. 读取 index.html
				let template = fs.readFileSync( resolve( __dirname, "index.html" ), "utf-8" );
				
				// 2. 应用 Vite HTML 转换。这将会注入 Vite HMR 客户端，
				//    同时也会从 Vite 插件应用 HTML 转换。
				//    例如：@vitejs/plugin-react 中的 global preambles
				template = await vite.transformIndexHtml( url, template );
				
				// 3. 加载服务器入口。vite.ssrLoadModule 将自动转换
				//    你的 ESM 源码使之可以在 Node.js 中运行！无需打包
				//    并提供类似 HMR 的根据情况随时失效。
				
				const { render } = await vite.ssrLoadModule( "/entry/server.ts" );
				
				// 4. 渲染应用的 HTML。这假设 entry-server.js 导出的 `render`
				//    函数调用了适当的 SSR 框架 API。
				//    例如 ReactDOMServer.renderToString()
				const appHtml: string = await render( url );
				
				// 5. 注入渲染后的应用程序 HTML 到模板中。
				const html = template
					.replace( `<!--adachi-template-slot-->`, appHtml )
					.replace( `<!--adachi-routes-->`, `window.__ADACHI_ROUTES__ = ${ JSON.stringify( this.renderRoutes ) }` );
				
				// 6. 返回渲染后的 HTML。
				res.status( 200 ).set( { "Content-Type": "text/html" } ).end( html );
			} catch ( e ) {
				// 如果捕获到了一个错误，让 Vite 来修复该堆栈，这样它就可以映射回
				// 你的实际源码中。
				const err: Error = <Error>e;
				vite.ssrFixStacktrace( err );
				console.log( err.stack );
				res.status( 500 ).end( err.stack );
			}
		} );
		app.listen( 5173 );
	}
}