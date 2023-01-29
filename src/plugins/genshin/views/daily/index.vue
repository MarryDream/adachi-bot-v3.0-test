<template>
	<div id="app" class="daily-app" v-if="data">
		<Header :week="week" :show-event="showEvent" :sub-state="subState" :user="user" />
		<Material v-if="showMaterial" :data="data" />
		<Event :show-event="showEvent" :show-material="showMaterial" :events="data.event" />
	</div>
</template>

<script lang="ts">
import "moment/dist/locale/zh-cn";
import { defineComponent, computed, onMounted, ref, Ref } from "vue";
import { parseURL, request } from "#/genshin/public/js/src";
import Header from "./header.vue";
import Material from "./material.vue";
import Event from "./event.vue";

export default defineComponent( {
	name: "DailyApp",
	components: {
		Header,
		Material,
		Event
	},
	setup() {
		const urlParams = parseURL( location.href );
		const user = urlParams.id;

		const data: Ref<Record<string, any> | null> = ref(null);

		const week = urlParams.week;
		const subState = computed( () => urlParams.type === "sub" );

		const objHasValue = params => {
			const d = data.value;
			if ( !d || !d[params] || typeof d[params] !== "object" ) return false;
			return Object.keys( d[params] ).length !== 0;
		}

		/* 是否显示素材（素材空） */
		const showMaterial = computed( () => objHasValue( "character" ) || objHasValue( "weapon" ) );

		/* 是否显示活动日历 */
		const showEvent = computed( () => week === "today" && data.value?.event.length !== 0 );

		onMounted(async () => {
			data.value = await request( "/api/daily", { id: user } );
		});

		return {
			data,
			week,
			user,
			subState,
			showMaterial,
			showEvent
		};
	}
} );
</script>

<style src="../../public/styles/reset.css"></style>

<style lang="scss">
#app {
	width: 1180px;
	--primary-base: #F9F5F1;
	--primary-dark: #886444;
	--shadow-base: rgba(136, 100, 68, 0.2);
	--shadow-dark: rgba(136, 100, 68, 1);
}
</style>