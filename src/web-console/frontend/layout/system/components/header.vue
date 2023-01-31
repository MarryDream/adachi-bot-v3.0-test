<template>
	<header class="header-view">
		<div class="header-menu">
			<div class="nav-left">
				<div class="nav-btn" @click="toggle">
					<i :class="isOpen ? 'icon-close' : 'icon-open'"></i>
				</div>
				<el-breadcrumb separator="/">
					<transition-group name="breadcrumb-transform">
						<el-breadcrumb-item v-for="(b, bKey) of breadcrumbs" :key="bKey">
							<span v-if="bKey === breadcrumbs.length - 1">{{ b.meta?.title }}</span>
							<a v-else @click="toLink(b)">{{ b.meta?.title }}</a>
						</el-breadcrumb-item>
					</transition-group>
				</el-breadcrumb>
			</div>
			<ul class="nav-right">
				<el-button type="primary" :loading="refreshLoading" @click="configRefresh" link>刷新配置</el-button>
				<el-button type="primary" :loading="restartLoading" @click="botRestart" link>重启BOT</el-button>
				<li class="nav-btn" @click="accountLogout">
					<i class="icon-exit"></i>
				</li>
			</ul>
		</div>
		<Tabs/>
	</header>
</template>

<script lang="ts">
import { defineComponent, ref, watch, inject, reactive, toRefs } from "vue";
import Tabs from "./tabs.vue";
import { useRouter, useRoute } from "vue-router";
import { ElNotification, ElMessageBox } from "element-plus";

interface IState {
	breadcrumbs: any[];
	refreshLoading: boolean;
	restartLoading: boolean;
}

export default defineComponent( {
	name: "NavView",
	components: {
		Tabs
	},
	emits: [ "toggle" ],
	props: {
		isOpen: {
			type: Boolean,
			default: false
		}
	},
	setup( props, { emit } ) {
		const router = useRouter();
		const route = useRoute();
		const { USER_LOGOUT } = inject( "user" );
		const { CONFIG_REFRESH, BOT_RESTART } = inject( "app" );

		const state: IState = reactive( {
			breadcrumbs: [],
			refreshLoading: false,
			restartLoading: false
		} );

		/* 判断当前路由是否为 home 页 */
		function isHomeRoute( currenRoute ) {
			return currenRoute.name?.trim().toLocaleLowerCase() === "Home".toLocaleLowerCase();
		}

		/* 获取面包屑数组 */
		function getBreadcrumb() {
			let matched: any[] = route.matched.filter( r => r.meta?.title );
			const first = matched[0];
			if ( !isHomeRoute( first ) ) {
				matched = [ { path: "/system/home", meta: { title: '首页' } } ].concat( matched );
			}
			state.breadcrumbs = matched.filter( ( item ) => {
				return item.meta?.title && item.meta?.breadcrumb !== false
			} )
		}

		/* 退出登录 */
		function accountLogout() {
			USER_LOGOUT().then( () => {
				router.push( "/login" );
			} )
		}

		/* 切换开关状态 */
		function toggle() {
			emit( "toggle", !props.isOpen );
		}

		watch( () => route.path, () => {
			getBreadcrumb();
		}, { immediate: true } )

		/* 点击跳转 */
		function toLink( { redirect, path } ) {
			if ( redirect ) {
				router.push( redirect );
			} else {
				router.push( path );
			}
		}

		/* 刷新配置 */
		function configRefresh() {
			state.refreshLoading = true;
			CONFIG_REFRESH().then( () => {
				ElNotification( {
					title: "成功",
					message: "刷新配置成功。",
					type: "success",
					duration: 2000
				} );
				state.refreshLoading = false;
			} ).catch( error => {
				ElNotification( {
					title: "失败",
					message: error.message,
					type: "error",
					duration: 2000
				} );
				state.refreshLoading = false;
			} )
		}

		/* 重启bot */
		function botRestart() {
			state.restartLoading = true;
			BOT_RESTART().then( () => {
				ElMessageBox.alert( "重启成功，页面将在10秒后自动刷新。", "提示", {
					confirmButtonText: "确定",
					type: "warning",
					center: true
				} );
				setTimeout( () => {
					location.reload();
				}, 10000 );
			} ).catch( error => {
				ElNotification( {
					title: "失败",
					message: error.message,
					type: "error",
					duration: 2000
				} );
				state.restartLoading = false;
			} )
		}

		return {
			...toRefs( state ),
			toLink,
			toggle,
			configRefresh,
			botRestart,
			accountLogout
		}
	}
} );
</script>

<style lang="scss" scoped>
.header-view {
	position: relative;
	user-select: none;
	flex-shrink: 0;
	box-shadow: 0 1px 2px rgba(0, 0, 0, 0.15);
	z-index: 100;

	.header-menu {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 0 18px;
		height: var(--header-height);

		.nav-left {
			display: flex;
			align-items: center;

			.el-breadcrumb {
				margin-left: 18px;

				.el-breadcrumb__inner {
					span,
					a {
						font-size: 14px;
						line-height: 20px;
						font-weight: 500;
						color: #666;
					}
				}
			}
		}

		/* 头部按钮样式 */
		.nav-right {
			display: flex;
			align-items: center;
			column-gap: 10px;

			.nav-btn {
				padding: 7px;
				border-radius: 4px;
				cursor: pointer;
				transition: background-color .3s;

				&:hover {
					background-color: #f0f2f5;
				}

				> i {
					font-size: 20px;
					font-weight: 300;
				}
			}
		}
	}
}
</style>