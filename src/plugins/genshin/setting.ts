import { OrderConfig } from "@/modules/command";
import { PluginSetting } from "@/modules/plugin";
import { Router } from "express";
import * as r from "./routes";

const information: OrderConfig = {
	type: "order",
	cmdKey: "silvery-star.information",
	desc: [ "信息", "[角色|武器名|圣遗物] (-skill)" ],
	headers: [ "info" ],
	regexps: [ "[\\w\\u4e00-\\u9fa5]+", "(-skill)?" ],
	main: "achieves/info",
	detail: "使用 -skill 来查看角色元素战技与元素爆发详情\n" +
		"武器与圣遗物不可使用该配置项"
};

const serverRouters: Record<string, Router> = {
	"/api/info": r.InfoRouter
}

export default <PluginSetting>{
	pluginName: "genshin",
	cfgList: [ information ],
	render: {
		dirname: "views"
	},
	server: {
		routers: serverRouters
	}
};