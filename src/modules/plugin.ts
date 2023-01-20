import { BOT } from "@/modules/bot";
import { extname } from "path";
import { RenderRoutes } from "@/types/render";

export interface PluginSetting {
	name: string;
	renderDir?: string;
}

export default class Plugin {
	public static async load( bot: BOT ): Promise<Array<RenderRoutes>> {
		const plugins: string[] = bot.file.getDirFiles( "", "plugin" );
		const routers: Array<RenderRoutes> = [];
		
		/* 从 plugins 文件夹从导入 init.ts 进行插件初始化 */
		for ( let plugin of plugins ) {
			const { init } = await import( `#/${ plugin }/init.ts` );
			try {
				const { name, renderDir }: PluginSetting = await init( bot );
				if ( renderDir ) {
					const views = bot.file.getDirFiles( `${ plugin }/${ renderDir }`, "plugin" );
					views.filter( v => {
						return extname( v ) === ".vue";
					} ).forEach( v => {
						const fileName: string = v.replace( /\.vue$/, "" );
						routers.push( {
							path: `/${ plugin }/${ fileName }`,
							componentData: {
								plugin,
								renderDir,
								fileName
							}
						} );
					} );
				}
				console.log( `插件 ${ name } 加载完成` );
			} catch ( error ) {
				console.log( `插件加载异常: ${ <string>error }` );
			}
		}
		return routers;
	}
}