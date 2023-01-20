import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import path from "path";

// https://vitejs.dev/config/
export default ( env: any ) => {
	console.log( env );
	
	return defineConfig( {
		plugins: [ vue() ],
		resolve: {
			alias: {
				"@": path.resolve(__dirname, "../../../src"),
				"#": path.resolve(__dirname, "../../../src/plugins")
			}
		}
	} )
}
