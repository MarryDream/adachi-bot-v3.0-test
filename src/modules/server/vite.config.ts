import { defineConfig } from "vite"
import vue from "@vitejs/plugin-vue"
import { fileURLToPath } from "url";
import path from "path";
const __dirname = path.dirname( fileURLToPath( import.meta.url ) );

// https://vitejs.dev/config/
export default ( env: any ) => {
	console.log( env );
	
	return defineConfig( {
		plugins: [ vue() ]
	} )
}
