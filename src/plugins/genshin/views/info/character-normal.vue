<template>
	<div class="character-normal">
		<div class="info-top">
			<div class="info-top-base">
				<info-line title="基本信息" :data="baseInfo"></info-line>
				<info-line title="基本属性" :data="dataBlockInfo"></info-line>
			</div>
			<info-card class="materials-card" :title="materialsTitle">
				<materials-list v-for="(d, dKey) of materialsInfo" :key="dKey" :data="d"></materials-list>
			</info-card>
		</div>
		<div class="info-bottom">
			<info-card class="talents-card" title="天赋信息" direction="row">
				<p class="talents-item" v-for="(t, tKey) of talents" :key="tKey">{{ t }}</p>
			</info-card>
			<info-card class="constellations-card" title="命座信息" direction="row">
				<div class="constellations-item" v-for="i in 4" :key="i">
					<p class="level">{{ numCN[i - 1] }}</p>
					<p class="content">{{ constellations[i - 1] }}</p>
				</div>
			</info-card>
		</div>
	</div>
</template>

<script lang="ts">
import InfoLine from "./info-line.vue";
import InfoCard from "./info-card.vue";
import MaterialsList from "./materials-list.vue"

import { defineComponent, computed, toRefs } from "vue";

export default defineComponent( {
	name: "CharacterNormal",
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
.character-normal {
	.info-top {
		display: flex;
		justify-content: space-between;

		.info-top-base {
			.info-line {
				margin-bottom: 48px;

				&:last-child {
					margin-bottom: 0;
				}
			}
		}

		.materials-card {
			.materials-list {
				&:last-child {
					.list-data {
						&::after {
							display: none;
						}
					}
				}
			}
		}
	}

	.info-bottom {
		display: flex;
		margin-top: 54px;

		.info-card {
			flex: 1;
			margin-right: 54px;

			&:last-child {
				margin-right: 0;
			}

			::v-deep(.card-content) {
				display: flex;
				flex-direction: column;
				justify-content: space-around;
			}
		}

		.talents-card {
			.talents-item {
				padding: 10px 20px;
				font-size: 16px;
				line-height: 19px;
				color: #666;
			}
		}

		.constellations-card {
			.constellations-item {
				position: relative;
				padding: 10px 20px 10px 50px;

				.level {
					position: absolute;
					top: 6px;
					left: 10px;
					font-size: 38px;
					color: #666;
				}

				.content {
					position: relative;
					padding-left: 5px;
					min-height: 48px;
					vertical-align: middle;
					font-size: 16px;
					color: #666;
					line-height: 19px;
				}
			}
		}
	}
}

@font-face {
	font-family: HuaWen;
	src: url("../../public/fonts/HWXingKai.ttf");
}
</style>