<template>
    <div>嵌套根组件</div>
    <comp />
</template>

<script lang="ts">
import { defineComponent } from "vue";
import Comp from "./Comp.vue";

export default defineComponent({
    name: "Nest",
    components: {
        Comp
    }
})
</script>

<style lang="scss" scoped>

</style>