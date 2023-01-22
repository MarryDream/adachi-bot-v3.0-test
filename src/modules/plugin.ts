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
					views.forEach( v => {
						const route = setRenderRoute( bot, plugin, renderDir, v );
						if ( route ) {
							routers.push( route );
						}
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

/* 获取插件渲染页的路由对象 */
function setRenderRoute( bot: BOT, plugin: string, renderDir: string, view: string ): RenderRoutes | null {
	let route: RenderRoutes | null = null;
	const ext: string = extname( view );
	if ( ext === ".vue" ) {
		// 加载后缀名为 vue 的文件
		const fileName: string = view.replace( /\.vue$/, "" );
		route = {
			path: `/${ plugin }/${ fileName }`,
			componentData: {
				plugin,
				renderDir,
				fileName
			}
		}
	} else if ( !ext ) {
		// 后缀名不存在且为目录时，加载目录下的 index.vue 文件
		const fileType = bot.file.getFileType( `${ plugin }/${ renderDir }/${ view }`, "plugin" );
		if ( fileType === "directory" ) {
			const path: string = bot.file.getFilePath( `${ plugin }/${ renderDir }/${ view }/index.vue`, "plugin" );
			// 判断目录下是否存在 index.vue
			const isExist: boolean = bot.file.isExist( path );
			if ( isExist ) {
				route = {
					path: `/${ plugin }/${ view }`,
					componentData: {
						plugin,
						renderDir,
						fileDir: view,
						fileName: "index"
					}
				}
			}
		}
	}
	
	return route;
}