<template>
  <header>
    <WikiSearch />
  </header>
</template>

<script setup>
  import WikiSearch from '@/components/WikiSearch.vue'
</script>

<style scoped>
header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;

  height: 10vh;

  display: flex;
  align-items: center;
  justify-content: center;

  background: transparent;

  z-index: 1000;
}
</style>
