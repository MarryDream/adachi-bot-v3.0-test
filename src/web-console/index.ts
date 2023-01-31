import { resolve } from "path";
import { scheduleJob } from "node-schedule";
import { createServer } from "net";
import { expressjwt as jwt } from "express-jwt";
import BotConfig from "@/modules/config";
import useWebsocket from "express-ws";
import express, { Express } from "express";
import { Router } from 'express-serve-static-core';
import * as r from "./backend/routes";
import { getTokenByRequest } from "./backend/utils/request";
import { createServer as createViteServer } from "vite";
import fs from "fs";

export default class WebConsole {
	private readonly app: Express;
	private readonly secret: string;
	private isFirstListen: boolean = true;
	
	constructor( config: BotConfig ) {
		const cfg = config.webConsole;
		
		this.secret = cfg.jwtSecret;
		if ( !this.secret ) {
			console.log( "请检查 setting.yml 中是否正确填写 jwtSecret 验证秘钥（6~16 位的字母或数字）" );
			process.exit( 0 );
		}
		
		this.app = express();
		this.createConsole( cfg.consolePort, cfg.tcpLoggerPort );
	}
	
	private async createConsole( port: number, tcp: number ) {
		const vite = await createViteServer( {
			base: "/",
			root: __dirname,
			server: { middlewareMode: true },
			appType: "custom"
		} );
		
		this.app.use( vite.middlewares );
		this.app.use( express.static( resolve( __dirname, "./frontend" ) ) );
		this.app.use( express.json() );
		this.app.use( express.urlencoded( { extended: false } ) );
		
		/* 创建接口 */
		this.useApi( "/api/check", r.CheckRouter, false );
		this.useApi( "/api/login", r.LoginRouter, false );
		this.useApi( "/api/bot", r.BaseRouter );
		this.useApi( "/api/log", r.LogRouter );
		this.useApi( "/api/user", r.UserRouter );
		this.useApi( "/api/group", r.GroupRouter );
		this.useApi( "/api/message", r.MessageRouter );
		this.useApi( "/api/config", r.ConfigRouter );
		
		/* 捕获错误 */
		this.app.use( WebConsole.ApiErrorCatch );
		
		this.app.use( '*', async ( req, res, next ) => {
			const url = req.originalUrl;
			
			try {
				let template = fs.readFileSync( resolve( __dirname, "index.html" ), "utf-8" );
				template = await vite.transformIndexHtml( url, template );
				const { render } = await vite.ssrLoadModule( "/frontend/server.ts" );
				const appHtml: string = await render( url );
				const html = template
					.replace( `<!--adachi-template-slot-->`, appHtml );
				
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
		
		useWebsocket( this.app );
		createServer( socket => {
			let messageCache: string = "";
			socket.setEncoding( "utf-8" );
			socket.on( "data", res => {
				messageCache += res;
			} );
			
			// @ts-ignore
			this.app.ws( "/ws/log", ( ws, req ) => {
				messageCache = "";
				const cron: string = "*/2 * * * * ?";
				const job = scheduleJob( cron, () => {
					if ( messageCache.length !== 0 ) {
						const data = messageCache.split( "__ADACHI__" )
							.filter( el => el.length !== 0 )
							.map( el => JSON.parse( el ) );
						ws.send( JSON.stringify( data ) );
						messageCache = "";
					}
				} );
				ws.on( "close", () => job.cancel() && ws.close() );
			} );
			if ( this.isFirstListen ) {
				this.isFirstListen = false;
				this.app.listen( port, () => {
					console.log( `网页控制台已启动，请浏览器打开 http://127.0.0.1:${ port } 查看，若为云服务器，请将 127.0.0.1 替换为服务器的公网ip。` )
				} );
			}
		} ).listen( tcp );
	}
	
	private static ApiErrorCatch( err, req, res, next ) {
		switch ( err.name ) {
			case "UnauthorizedError":
				res.status( 401 ).send( {
					code: 401,
					msg: "Please login.",
					data: 0
				} );
				break;
		}
	}
	
	/* 此处没有用 app.use+jwt.unless 进行全局隔离 */
	
	/* WebSocket 疑似无法被过滤 所有 ws 连接被拦截 */
	private static JWT( secret: string ) {
		return jwt( {
			secret,
			algorithms: [ "HS256" ],
			getToken( req ) {
				return getTokenByRequest( req );
			}
		} );
	}
	
	private useApi( path: string, router: Router, token: boolean = true ): void {
		if ( token ) {
			this.app.use( path, WebConsole.JWT( this.secret ), router );
		} else {
			this.app.use( path, router );
		}
	}
}