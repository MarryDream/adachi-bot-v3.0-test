import { PluginSetting } from "@/modules/plugin";

export async function init(): Promise<PluginSetting> {
	return {
		name: "genshin",
		renderDir: "views"
	}
}