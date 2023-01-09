import { defineConfig } from "vite"
import vue from "@vitejs/plugin-vue"

// https://vitejs.dev/config/
export default ( env: any ) => {
	console.log( env );
	
	return defineConfig( {
		plugins: [ vue() ]
	} )
}
