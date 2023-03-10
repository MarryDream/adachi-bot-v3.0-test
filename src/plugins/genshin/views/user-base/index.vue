<template>
	<div id="app" class="card-base" v-if="data">
		<Header
			:data="data"
			:url-params="urlParams"
			:info-list="data.statsList.base"
		/>
		<main>
			<section class="card-user">
				<article class="card-user-info">
					<section-title>数据总览</section-title>
					<div class="card-status-box">
						<StatusBox
							class="card-status-item"
							v-for="(status, index) in data.statsList.chest.concat(data.statsList.culus)"
							:key="index"
							:data="status"
						/>
					</div>
				</article>
				<article class="card-exploration">
					<section-title>世界探索</section-title>
					<div class="card-exploration-box">
						<ExplorationBox
							class="card-exploration-item"
							v-for="(exploration, index) in data.explorationsList"
							:key="index"
							:data="exploration"
						/>
					</div>
				</article>
			</section>
			<section v-if="showAvatars" class="card-character">
				<section-title showSubTitle>
					<template #default>角色展示</template>
					<template #sub>角色数量: {{ data.stats.avatarNumber }}</template>
				</section-title>
				<div class="character-line">
					<CharacterBox
						class="character-item"
						v-for="(char, charIndex) in data.avatars"
						:key="charIndex"
						:char="char"
						type="weaponA"
					/>
				</div>
			</section>
			<section class="card-home">
				<section-title showSubTitle>
					<template #default>尘歌壶</template>
					<template #sub>等级: Lv.{{ data.homesLevel }} 仙力: {{ data.maxComfort }}</template>
				</section-title>
				<div class="card-home-box">
					<home-box
						class="card-home-item"
						:class="sizeClass(data.formatHomes, index)"
						v-for="(home, index) of data.formatHomes"
						:key="index"
						:data="home"
					/>
				</div>
			</section>
			<p v-if="!showAvatars" class="empty-avatar-tip">tips：请前往米游社公开展示「角色详情数据」来展示所持有角色</p>
		</main>
		<footer>
			<p class="sign">Created by Adachi-BOT</p>
		</footer>
	</div>
</template>

<script lang="ts">
import { defineComponent, computed, onMounted, ref, Ref } from "vue";
import Header from "./header.vue";
import SectionTitle from "./section-title.vue";
import HomeBox from "#/genshin/components/home-box/index.vue";
import CharacterBox from "#/genshin/components/character-box/index.vue";
import ExplorationBox from "#/genshin/components/exploration-box/index.vue";
import StatusBox from "#/genshin/components/status-box/index.vue";
import { parseURL, request } from "#/genshin/public/js/src.js";
import { sizeClass, cardDataParser } from "#/genshin/public/js/card-data-parser.js";

export default defineComponent( {
	name: "UserBase",
	components: {
		Header,
		SectionTitle,
		HomeBox,
		CharacterBox,
		ExplorationBox,
		StatusBox,
	},
	setup() {
		const urlParams = parseURL( location.href );

		const data: Ref<Record<string, any> | null> = ref( null );

		onMounted( async () => {
			const res = await request( "/api/card", { qq: urlParams.qq } );
			res.avatars.splice( 8 );
			const parsed = cardDataParser( res );
			parsed.statsList.base = parsed.statsList.base.filter( ( { label } ) => label !== "获得角色" );
			data.value = {
				...res,
				...parsed
			}
		} );

		/* 是否显示角色列表 */
		const showAvatars = computed( () => {
			return !!data.value?.avatars?.length;
		} );

		return {
			data,
			showAvatars,
			urlParams,
			sizeClass: sizeClass( 3 ),
		};
	},
} );
</script>

<style src="../../public/styles/reset.css"></style>

<style lang="scss" scoped>
#app {
	width: 800px;
}

/* 通用 */
.card-base {
	--border-color: #cbc0a9;
	--background-color: #fff;
}

.medium {
	min-width: 200px !important;
}

.large {
	min-width: 320px !important;
}

/* 整体布局 */
.card-base {
	position: relative;
	display: flex;
	flex-direction: column;
	background-color: #f8f5f1;
	border-radius: 12px;
	overflow: hidden;

	main {
		padding-top: 54px;
		border-style: solid;
		border-width: 0 50px 50px 50px;
		border-image: url("https://adachi-bot.oss-cn-beijing.aliyuncs.com/images/card/card-base-bg.png") 70 fill;

		> section {
			&:last-of-type {
				margin-bottom: 0;
			}

			/* 用户信息页 */
			&.card-user {
				.card-user-info {
					overflow: hidden;

					.card-status-box {
						display: grid;
						grid-template-columns: repeat(3, auto);
						grid-row-gap: 8px;
						justify-content: space-between;
						padding: 8px;
						margin-bottom: 15px;
						border: 1px solid var(--border-color);
						border-radius: 4px;
						background-color: var(--background-color);
						list-style: none;
						font-size: 30px;
						line-height: 56px;

						.card-status-item {
							font-size: 7.639px;
						}
					}
				}

				/* 区域探索 */
				.card-exploration {
					margin-top: 24px;

					.card-exploration-box {
						display: flex;
						justify-content: space-between;
						flex-wrap: wrap;
						margin: 0 -6px;

						.card-exploration-item {
							flex: 1;
							margin: 0 6px 10px;
							min-width: 288px;
							font-size: 8px;
						}
					}
				}
			}

			/* 角色 */
			&.card-character {
				.card-character-title {
					margin: 0 auto 30px auto;
					padding: 12px 0;
					border-bottom: 4px solid #d6c2b1;
					font-size: 36px;
					text-align: center;
					color: #666;
				}

				.character-line {
					padding: 0 20px;
					display: grid;
					grid-template-columns: repeat(4, auto);
					grid-row-gap: 15px;
					justify-content: space-between;

					.character-item {
						box-shadow: 2px 2px 4px #d1d9e6, -2px -2px 4px rgba(255, 255, 255, 0.6);
						font-size: 9px;
					}
				}
			}

			/* 家园 */
			&.card-home {
				margin-bottom: 20px;

				.card-home-box {
					display: flex;
					flex-wrap: wrap;
					margin: 0 -6px;

					.card-home-item {
						flex: 1;
						margin: 0 6px 10px;
						height: 120px;
						border-radius: 4px;
						font-size: 9px;

						::v-deep(.box-block) {
							height: 100%;
						}
					}
				}
			}
		}

		.empty-avatar-tip {
			margin: 10px 0 -10px;
			color: #666;
			text-align: center;
		}
	}

	/* 作者 */
	footer {
		padding-bottom: 12px;
		font-size: 18px;
		color: #636363;
		text-align: center;
	}
}
</style>
