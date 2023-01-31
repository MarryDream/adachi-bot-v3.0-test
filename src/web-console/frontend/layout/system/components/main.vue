<template>
	<section class="main-view">
		<transition name="fade-transform" mode="out-in" appear>
			<router-view />
		</transition>
	</section>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent( {
	name: "MainView"
} );
</script>

<style lang="scss" scoped>
.main-view {
	position: relative;
	padding: 12px;
	box-sizing: border-box;
	overflow: hidden;
}
</style>