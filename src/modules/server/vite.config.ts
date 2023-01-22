import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import path from "path";

// https://vitejs.dev/config/
export default ( env: any ) => {
	console.log( env );
	
	return defineConfig( {
		root: __dirname,
		plugins: [ vue() ],
		resolve: {
			alias: {
				"ROOT": path.resolve( __dirname, "../../app.ts" ),
				"@": path.resolve( __dirname, "../../../src" ),
				"#": path.resolve( __dirname, "../../../src/plugins" )
			}
		}
	} )
}
