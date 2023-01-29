<template>
	<div class="floor">
		<p class="floor-number">{{ floor }}</p>
		<main>
			<template v-for="r in 3" :key="r">
				<abyss-room v-if="data.data.levels[r - 1]" :roomData="data.data.levels[r - 1]"
				           :floor="floor"/>
			</template>
		</main>
	</div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import AbyssRoom from "./room.vue";

export default defineComponent( {
	name: "AbyssFloor",
	components: {
		AbyssRoom
	},
	props: {
		data: {
			type: Object,
			default: () => ( {} )
		}
	},
	setup( { data } ) {
		const floor = parseInt( data.floor );

		return {
			floor
		}
	}
} );
</script>

<style lang="scss" scoped>
.floor {
	position: relative;

	.floor-number {
		position: absolute;
		top: 135px;
		left: 50%;
		transform: translateX(-50%);
		width: 150px;
		height: 150px;
		border-radius: 50%;
		border: 10px solid rgba(75, 75, 136, 0.4);
		background-color: rgba(32, 32, 63, 0.8);
		font-size: 80px;
		line-height: 150px;
		color: #fff;
		text-align: center;
	}

	main {
		padding-top: 335px;

		.abyss-room {
			margin-bottom: 50px;

			&:last-child {
				margin-bottom: 0;
			}
		}
	}
}
</style>