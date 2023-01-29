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
		const urlParams = parseURL( location.href );
		const skill = urlParams.skill === "true";

		const data: Ref<Record<string, any> | null> = ref( null );

		onMounted( async () => {
			const res = await request( "/api/info", { name: urlParams.name } );
			initBaseColor( res );
			data.value = res;
		} )

		return {
			skill,
			data
		}
	}
} );
</script>

<style src="../../public/styles/reset.css"></style>

<style lang="scss" scoped>
#app {
	width: 1440px;
}
</style>