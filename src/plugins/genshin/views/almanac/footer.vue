<template>
	<div class="almanac-footer">
		<img class="dire-title" src="../../public/images/almanac/direction.svg" alt="ERROR"/>
		<div class="dire-content">
			<p>面朝{{ d }}玩原神<br/>稀有掉落概率up</p>
		</div>
		<p class="design">Designed by genshin.pub</p>
		<p class="author">Created by Adachi-BOT</p>
	</div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent( {
	name: "AlmanacFooter",
	props: {
		data: String
	}
} );
</script>

<style lang="scss" scoped>
.dire-title {
	position: relative;
	margin: 10px auto 0 auto;
}

.dire-content {
	position: relative;
	width: 250px;
	height: 140px;
	background: url("../../public/images/almanac/direction-bg.png");
	background-size: 250px;
	margin: auto;

	p {
		position: absolute;
		width: calc(100% - 40px);
		height: 50px;
		text-align: center;
		font-size: 20px;
		margin: 45px 20px;
		color: rgb(117, 104, 75);
	}
}

.author, .design {
	position: relative;
	display: inline-block;
	bottom: 7px;
	font-size: 14.5px;
	color: rgb(117, 97, 65);
	width: 202px;
}

.design {
	padding-left: 8px;
}

.author {
	padding-right: 8px;
	text-align: right;
}
</style>