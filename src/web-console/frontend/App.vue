<template>
	<component :is="layout"></component>
</template>

<script lang="ts">
import * as l from "./layout/index.js";
import { useAppStore, useUserStore } from "./store/index.js";

import { defineComponent, onBeforeMount, onUnmounted, computed, provide } from "vue";
import { useRoute } from "vue-router";

export default defineComponent( {
	name: "App",
	components: {
		BlankLayout: l.BlankLayout,
		SystemLayout: l.SystemLayout
	},
	setup() {
		const route = useRoute();
		const layout = computed( () => `${ route.meta.layout || "blank" }-layout` );

		const appStore = useAppStore();

		/* 挂载store */
		provide( "app", appStore );
		provide( "user", useUserStore() );

		function onLayoutResize() {
			/* 移动端地址栏问题 */
			const height = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
			const width = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;

			const device = width <= 768 ? "mobile" : "desktop";
			if ( appStore.device.value !== device ) {
				appStore.SET_DEVICE( device );
			}
			if ( appStore.deviceWidth.value !== width ) {
				appStore.SET_DEVICE_WIDTH( width );
			}
			if ( appStore.deviceHeight.value !== height ) {
				document.documentElement.style.setProperty( "--app-height", `${ height }px` );
				appStore.SET_DEVICE_HEIGHT( height );
			}
		}

		onBeforeMount( () => {
			onLayoutResize();
			window.addEventListener( "resize", onLayoutResize );
		} )

		onUnmounted( () => {
			window.removeEventListener( "resize", onLayoutResize );
		} );

		return { layout };
	}
} );
</script>