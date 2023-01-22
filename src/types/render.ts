export interface RenderRoutes {
	path: string;
	componentData: {
		plugin: string;
		renderDir: string;
		fileDir?: string;
		fileName: string;
	};
}