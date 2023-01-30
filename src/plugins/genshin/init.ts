import pluginSetting from "./setting";
import { Renderer } from "@/modules/renderer";
import { BOT } from "@/modules/bot";
import { PluginSetting, PluginSubSetting, SubInfo } from "@/modules/plugin";
import GenshinConfig from "./module/config";
import * as m from "./module";

export let config: GenshinConfig;
export let renderer: Renderer;
export const artClass = new m.ArtClass();
export const cookies = new m.Cookies();
export const typeData = new m.TypeData();
export const aliasClass = new m.AliasClass();
export const almanacClass = new m.AlmanacClass();
export const wishClass = new m.WishClass();
export const dailyClass = new m.DailyClass();
export const slipClass = new m.SlipClass();
export const privateClass = new m.PrivateClass();
export const characterID = new m.CharacterId();

/* 删除好友后清除订阅服务 */
async function decreaseFriend( userId: number, { redis }: BOT ) {
	await privateClass.delBatchPrivate( userId );
	await redis.deleteKey( `silvery-star.daily-sub-${ userId }` );
}

export async function subs( { redis }: BOT ): Promise<SubInfo[]> {
	const dailySub: string[] = await redis.getKeysByPrefix( "silvery-star.daily-sub-" );
	const dailySubUsers: number[] = dailySub.map( el => {
		return parseInt( <string>el.split( "-" ).pop() );
	} );
	
	return [ {
		name: "私人服务",
		users: privateClass.getUserIDList()
	}, {
		name: "素材订阅",
		users: dailySubUsers
	} ]
}

export async function subInfo(): Promise<PluginSubSetting> {
	return {
		subs: subs,
		reSub: decreaseFriend
	}
}

export async function init( { file, renderer: botRenderer, refresh, config: botConfig }: BOT ): Promise<PluginSetting> {
	/* 加载 genshin.yml 配置 */
	const configData = botConfig.register( file, "genshin", GenshinConfig.init );
	config = new GenshinConfig( configData );
	/* 实例化渲染器 */
	renderer = botRenderer.register( "/genshin", "#app" );
	
	refresh.registerRefreshableFile( "genshin", config );
	refresh.registerRefreshableFile( "cookies", cookies );
	
	return pluginSetting;
}