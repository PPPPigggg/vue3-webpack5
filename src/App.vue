<template>
  <div id="app">
    {{ text }}
    <div class="box"></div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
const text = ref<string>("hello");

console.log("%c Line:13 🥛", "color:#f5ce50", process.env);
// window.console.log("%c Line:13 🥛", "color:#f5ce50", process.env);
</script>

<style scoped lang="less">
.box {
  opacity: 0;
}
</style>
