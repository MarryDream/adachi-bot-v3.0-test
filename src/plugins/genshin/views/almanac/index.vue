<template>
	<div v-if="data" id="app" class="almanac">
		<almanac-header/>
		<div class="today-fortune">
			<div class="container">
				<almanac-fortune :data="data.auspicious" :isTop="true"/>
				<almanac-fortune :data="data.inauspicious"/>
			</div>
		</div>
		<almanac-footer :d="data.direction"/>
	</div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref, Ref } from "vue";
import { request } from "#/genshin/public/js/src.js";
import AlmanacHeader from "./header.vue";
import AlmanacFortune from "./fortune.vue";
import AlmanacFooter from "./footer.vue";

export default defineComponent( {
	name: "Almanac",
	components: {
		AlmanacHeader,
		AlmanacFortune,
		AlmanacFooter
	},
	setup() {
		const data: Ref<Record<string, any> | null> = ref( null );

		onMounted( async () => {
			data.value = await request( "/api/almanac" );
		} );

		return { data };
	}
} );
</script>

<style src="../../public/styles/reset.css"></style>

<style lang="scss" scoped>
#app {
	width: 440px;
	height: 650px;
}

.almanac {
	position: relative;
	width: 100%;
	height: 100%;
	border: 10px solid rgb(214, 208, 192);
	border-radius: 10px;
	background-color: rgb(252, 253, 250);
	box-sizing: border-box;
}

.today-fortune {
	position: relative;
	height: 280px;
	width: calc(100% - 40px);
	margin: 20px auto 0 auto;
	border: 1.5px solid rgb(129, 118, 96);
	box-sizing: border-box;
}

.container {
	position: relative;
	margin: 5px;
	width: calc(100% - 10px);
	height: calc(100% - 10px);
	border: 1px solid rgb(161, 159, 147);
}
</style>