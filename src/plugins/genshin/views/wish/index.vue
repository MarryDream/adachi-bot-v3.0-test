<template>
	<div v-if="data" id="app" class="wish">
		<img class="background" src="/genshin/public/images/item/background.png" alt="ERROR"/>
		<p class="time">@{{ data.nickname }} at {{ fullDate }}</p>
		<div class="wish-list">
			<WishBox v-for="d in data.result"
			         :d="d"
			></WishBox>
		</div>
	</div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref, Ref } from "vue";
import { getFullDate, parseURL, request } from "#/genshin/public/js/src";
import WishBox from "./box.vue";

export default defineComponent( {
	name: "Wish",
	components: {
		WishBox
	},
	setup() {
		const urlParams = parseURL( location.href );

		const data: Ref<Record<string, any> | null> = ref( null );

		const fullDate = getFullDate();

		onMounted( async () => {
			const dataRes = await request( "/api/wish/result", { qq: urlParams.qq } );
			const weapon = await request( "/api/wish/config", { type: "weapon" } );
			const character = await request( "/api/wish/config", { type: "character" } );

			const type = dataRes.type;
			const nickname = dataRes.name;
			const result = dataRes.data;

			for ( let key in result ) {
				if ( result.hasOwnProperty( key ) ) {
					const elType = result[key].type;
					const typeConfig = elType === "武器" ? weapon : character;
					result[key].el = typeConfig[result[key].name];
				}
			}

			result.sort( ( x, y ) => {
				const xType = x.type === "武器" ? 0 : 1;
				const yType = y.type === "武器" ? 0 : 1;
				if ( xType === yType ) {
					return y.rank - x.rank;
				} else {
					return yType - xType;
				}
			} );

			data.value = {
				type,
				nickname,
				result
			};
		} );

		return {
			data,
			fullDate
		}
	}
} );
</script>

<style src="../../public/styles/reset.css"></style>

<style lang="scss" scoped>
#app {
	width: 1056px;
	height: 594px;
}

.wish {
	position: absolute;

	.background {
		position: absolute;
	}

	.time {
		position: absolute;
		margin: 8px;
		width: 800px;
		color: rgb(235, 235, 235);
		font-size: 22px;
	}

	.wish-list {
		position: absolute;
		display: flex;
		top: 38px;
		left: 98px;
	}
}
</style>