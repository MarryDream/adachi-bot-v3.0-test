<template>
	<div class="abyss-base">
		<span class="uid">{{ uid }}</span>
		<slot/>
		<p class="footer">Created by Adachi-BOT</p>
	</div>
</template>

<script lang="ts">
import { defineComponent, computed } from "vue";

export default defineComponent( {
	name: "AbyssBase",
	props: {
		data: {
			type: Object,
			default: () => ( {} )
		}
	},
	setup( props ) {
		const info = props.data.info;
		const uid = computed( () => info.split( "-" ).join( " " ) );

		return {
			uid
		}
	}
} );
</script>

<style lang="scss" scoped>
.abyss-base {
	position: relative;
	background: url("https://adachi-bot.oss-cn-beijing.aliyuncs.com/Version2/abyss/top-background.jpg") top #13132b no-repeat;
	background-size: contain;
	overflow: hidden;

	&::before {
		content: "";
		position: absolute;
		left: 0;
		top: 0;
		right: 0;
		bottom: 0;
		border: 70px solid;
		border-image-source: url('https://adachi-bot.oss-cn-beijing.aliyuncs.com/images/card/card-base-bg.png');
		border-image-slice: 70 fill;
		filter: brightness(200%);
		opacity: 0.6;
	}

	.uid {
		position: absolute;
		font-size: 20px;
		color: #fff;
		left: 64px;
		top: 60px;
	}

	.footer {
		margin: 42px 62px;
		font-size: 24px;
		color: #fff;
		text-align: right;
	}
}
</style>