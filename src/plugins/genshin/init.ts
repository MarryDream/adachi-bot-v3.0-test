import { PluginSetting } from "@/modules/plugin";
import {Router} from "express";
import * as r from "./routes";

const serverRouters: Record<string, Router> = {
	"/api/info": r.InfoRouter
}

export async function init(): Promise<PluginSetting> {
	return {
		name: "genshin",
		render: {
			dirname: "views"
		},
		server: {
			routers: serverRouters
		}
	}
}