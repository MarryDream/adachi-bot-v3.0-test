<template>
	<div id="app">
		<info-base v-if="data" :data="data">
			<info-character v-if="data.type === '角色'" :data="data" :skill="skill"></info-character>
			<info-weapon v-else :data="data"></info-weapon>
		</info-base>
	</div>
</template>

<script lang="ts">
import { defineComponent, onMounted, Ref, ref } from "vue";
import axios from "axios";
import { parseURL, request } from "#/genshin/public/js/src";
import { initBaseColor } from "#/genshin/public/js/info-data-parser";
import InfoBase from "./base.vue";
import InfoWeapon from "./weapon.vue";
import InfoCharacter from "./character.vue";

export default defineComponent( {
	name: "Info",
	components: {
		InfoBase,
		InfoWeapon,
		InfoCharacter
	},
	setup() {
		const urlParams = parseURL( location.search );
		const skill = urlParams.skill === "true";

		const data: Ref<null | {}> = ref( null );

		onMounted( () => {
			getPageData( urlParams.name );
		} )


		function getPageData( name: string ) {
			axios( `/genshin/api/info?name=${ name }` ).then( res => {
				data.value = res.data;
				initBaseColor( data.value );
			} )
		}

		return {
			skill,
			data
		}
	}
} );
</script>

<style lang="scss">
* {
	margin: 0;
	padding: 0;
}

img {
	display: block;
}

html {
	height: 100%;
	font-family: GenshinUsedFont, monospace;
}

@font-face {
	font-family: GenshinUsedFont;
	src: url("../../public/fonts/HYWenHei-85W.ttf");
}
</style>

<style lang="scss" scoped>
#app {
	width: 1440px;
}
</style>