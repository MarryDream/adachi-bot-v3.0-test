import FileManagement from "./file";
import RenderServer from "./server";
import Plugin from "./plugin";

/**
 * @interface
 * BOT 工具类
 * @file 文件管理
 * */
export interface BOT {
	readonly root: string;
	readonly file: FileManagement;
}

export default class Adachi {
	public readonly bot: BOT;
	
	constructor( root: string ) {
		/* 初始化运行环境 */
		const file = new FileManagement( root );
		
		this.bot = {
			root,
			file
		};
	}
	
	public run(): BOT {
		Plugin.load( this.bot ).then( ( { renderRoutes, serverRouters } ) => {
			new RenderServer( renderRoutes, serverRouters );
		} );
		return this.bot;
	}
}