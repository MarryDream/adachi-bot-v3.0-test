<template>
	<Base v-if="data" :data="data" id="app">
		<AbyssOverview v-if="data.floor === '0'" :data="data"/>
		<AbyssFloor v-else :data="data"/>
	</Base>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref, Ref } from "vue";
import { parseURL, request } from "#/genshin/public/js/src.js";
import Base from "./base.vue";
import AbyssFloor from "./floor.vue";
import AbyssOverview from "./overview.vue";

export default defineComponent( {
	name: "Abyss",
	components: {
		AbyssFloor,
		AbyssOverview,
		Base
	},
	setup() {
		const urlParams = parseURL( location.href );

		const data: Ref<Record<string, any> | null> = ref( null );

		onMounted( async () => {
			data.value = await request( "/api/abyss", {
				qq: urlParams.qq,
				floor: urlParams.floor
			} );
		} )

		return { data }
	}
} );
</script>

<style src="../../public/styles/reset.css"></style>

<style lang="scss" scoped>
#app {
	width: 1000px;
}
</style>