import pluginSetting from "./setting";
import { Renderer } from "@/modules/renderer";
import { BOT } from "@/modules/bot";
import { PluginSetting } from "@/modules/plugin";
import * as m from "./module";

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

export async function init( bot: BOT ): Promise<PluginSetting> {
	/* 实例化渲染器 */
	renderer = bot.renderer.register( "/genshin", 5173, "#app" );
	
	return pluginSetting;
}