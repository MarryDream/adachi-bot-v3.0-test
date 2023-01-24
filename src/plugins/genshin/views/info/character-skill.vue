<template>
	<div class="character-skill">
		<info-card class="skill-card">
			<h3 class="skill-card-title">{{ skill.title }}</h3>
			<div class="skill-card-content" v-html="skill.description"></div>
		</info-card>
		<info-card class="burst-card">
			<h3 class="skill-card-title">{{ burst.title }}</h3>
			<div class="skill-card-content" v-html="burst.description"></div>
		</info-card>
	</div>
</template>

<script lang="ts">
import InfoLine from "./info-line.vue";
import InfoCard from "./info-card.vue";
import MaterialsList from "./materials-list.vue"

import { defineComponent, computed, toRefs } from "vue";

export default defineComponent( {
	name: "CharacterSkill",
	components: {
		InfoLine,
		InfoCard,
		MaterialsList,
	},
	props: {
		data: {
			type: Object,
			default: () => ( {
				birthday: "",
				element: "",
				cv: "",
				constellationName: "",
				rarity: null,
				mainStat: "",
				mainValue: "",
				baseHP: null,
				baseATK: null,
				baseDEF: null,
				ascensionMaterials: [],
				levelUpMaterials: [],
				talentMaterials: [],
				constellations: [],
				time: ""
			} )
		}
	},
	setup( props ) {
		const data = props.data;
		const starIcon = computed( () => {
			return `https://adachi-bot.oss-cn-beijing.aliyuncs.com/Version2/info/icon/BaseStar${ data.rarity }.png`;
		} );
		const numCN = [ "壹", "贰", "肆", "陆" ];

		const materialsTitle = `材料消耗${ data.time }`;

		const baseInfo = [
			{
				生日: data.birthday,
				神之眼: data.element
			},
			{
				声优: data.cv
			},
			{
				命之座: data.constellationName
			}
		];

		const dataBlockInfo = [
			{
				生命: data.baseHP,
				防御: data.baseDEF
			},
			{
				攻击: data.baseATK,
				[data.mainStat]: data.mainValue
			}
		];

		const materialsInfo = [
			{
				label: "升级",
				value: data.levelUpMaterials,
				showTitle: false,
			},
			{
				label: "天赋",
				value: data.talentMaterials,
				showTitle: true,
			},
			{
				label: "突破",
				value: data.ascensionMaterials,
				showTitle: false,
			},
		];

		return {
			...toRefs( data ),
			materialsTitle,
			starIcon,
			baseInfo,
			dataBlockInfo,
			materialsInfo,
			numCN
		}
	}
} );
</script>

<style lang="scss" scoped>
.character-skill {
	display: flex;
	justify-content: space-between;
	padding-bottom: 30px;

	.info-card {
		width: 400px;

		&.skill-card > .card-content,
		&.burst-card > .card-content {
			padding: 20px;
			height: 100%;
			min-height: 415px;
		}

		.skill-card-title {
			margin-bottom: 10px;
			font-size: 24px;
			font-weight: 500;
			color: var(--light-color);
		}

		.skill-card-content {
			word-break: break-all;
			font-size: 14px;
			color: #666;

			span[style] {
				margin: 4px 0;
				display: inline-block;
				font-size: 16px;
				color: var(--light-color) !important;
			}

			ul {
				margin: 1em 0;
				padding-left: 40px;
			}
		}
	}
}
</style>