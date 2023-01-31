<template>
	<el-button type="primary" size="small" @click="$router.push('/')">回到首页</el-button>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent( {
	name: "NotFound"
} );
</script>

<style lang="scss">

</style>