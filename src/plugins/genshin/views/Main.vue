<template>
    <div class="Main">main</div>
</template>

<script lang="ts">
import {defineComponent, onMounted} from "vue";

export default defineComponent({
    name: "Main",
    setup() {
        onMounted(async () => {
            const res = await fetch("/genshin/api/info");
            console.log(await res.json());
        })
    }
})
</script>

<style lang="scss">
.Main {
    color: #f00;
}
</style>
