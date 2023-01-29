<template>
	<div class="character-item">
		<div class="avatar-box" :style="{'background-image': getRarityBg(char.rarity)}">
			<img class="profile" :src="char.icon" alt="ERROR"/>
		</div>
		<p class="detail">
			<span class="level">{{ getStr(char) }}</span>
		</p>
	</div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent( {
	name: "AbyssCharacterItem",
	props: {
		char: Object,
		type: String
	},
	setup( props ) {
		/* 针对埃洛伊处理 */
		function getRarityBg( rarity ) {
			rarity = rarity === 105 ? "5a" : rarity;
			return `url(https://adachi-bot.oss-cn-beijing.aliyuncs.com/images/rarity_bg/Background_Item_${ rarity }_Star.png)`;
		}

		const getStr = ( char ) => {
			return props.type === "level" ? "Lv." + char.level : char.value + "次";
		};

		return {
			getStr,
			getRarityBg
		}
	}
} );
</script>

<style lang="scss" scoped>
.character-item {
	display: inline-flex;
	flex-direction: column;
	align-items: center;
	width: 15.9em;
	min-height: 19.2em;
	border-radius: 0.8em;
	background-color: #e9e5dc;
	box-sizing: border-box;
	color: rgb(64, 64, 64);
	font-size: 10px;
	/* 头像 */
	.avatar-box {
		background-repeat: no-repeat;
		background-size: cover;
		border-radius: 0.6em 0.6em 3.2em 0;
		overflow: hidden;
		z-index: 10;

		.profile {
			width: 100%;
			z-index: 10;
		}
	}

	/* lv */
	.detail {
		width: 100%;
		text-align: center;

		.level {
			font-size: 1.8em;
			line-height: 1.85em;
			margin-bottom: 0.25em;
			vertical-align: middle;
		}
	}
}
</style>