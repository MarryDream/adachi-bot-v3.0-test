<template>
	<div v-if="data" id="app" class="statistic-box">
		<p class="time">@{{ data.nickname }} at {{ fullDate }}</p>
		<span class="main-title">祈愿统计</span>
		<span class="total">总计： {{ data.total }} 抽</span>
		<div
			v-show="data.character.length !== 0"
			class="gotten"
		>
			<p class="title">抽中角色: {{ data.charCount }}</p>
			<div class="box">
				<StatisticItem v-for="el in data.character" :data="el"/>
			</div>
		</div>
		<div
			v-show="data.weapon.length !== 0"
			class="gotten"
		>
			<p class="title">抽中武器: {{ data.weaponCount }}</p>
			<div class="box">
				<StatisticItem v-for="el in data.weapon" :data="el"/>
			</div>
		</div>
		<p class="author">Created by Adachi-BOT</p>
	</div>
</template>

<script lang="ts">
import { defineComponent, ref, Ref, onMounted } from "vue";
import { getFullDate, parseURL, request } from "#/genshin/public/js/src";
import StatisticItem from "./item.vue";

export default defineComponent( {
	name: "WishStatistic",
	components: {
		StatisticItem
	},
	setup() {
		const urlParams = parseURL( location.href );
		const data: Ref<Record<string, any> | null> = ref( null );

		const fullDate = getFullDate();

		onMounted( async () => {
			const res = await request( "/api/wish/statistic", { qq: urlParams.qq } );
			data.value = {
				...res,
				weaponCount: res.weapon.reduce( ( pre, cur ) => pre + cur.count, 0 ),
				charCount: res.character.reduce( ( pre, cur ) => pre + cur.count, 0 )
			}
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
	width: 888px;
}

.statistic-box {
	position: relative;
	display: inline-block;
	width: 97%;
	background-color: #F3EFEA;
	border-radius: 6px;
	padding: 1% 1.5%;

	.main-title {
		display: inline-block;
		font-size: 1.25em;
		margin: 3px 0;
		color: #867962;
		width: 100%;
		text-align: center;
	}
}

.total {
	position: absolute;
	right: 0;
	top: 0;
	color: #494338;
	margin: 1.6% 2.8%;
	font-size: 1rem;
}

.title {
	font-size: 1rem;
	width: 96%;
	color: #494338;
	margin: 12px 2% 0 12px;
	padding: 1.1% 0 1.5% 1.5%;
	border-top: 1px #a99c7d solid;
}

.box {
	min-height: 78px;
	width: 96%;
	margin: 0 2%;
}

.author {
	position: relative;
	font-size: 0.8rem;
	color: rgb(36, 36, 36);
	text-align: right;
}

.time {
	position: absolute;
	left: 0;
	top: 0;
	color: #494338;
	margin: 1.9% 2.8%;
	font-size: 0.85rem;
}
</style>