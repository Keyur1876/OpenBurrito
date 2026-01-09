<template>
  <header>
    <WikiFilter />
    <WikiSearch />
  </header>
</template>

<script setup>
  import WikiSearch from '@/components/WikiSearch.vue'
  import WikiFilter from '@/components/WikiFilter.vue'
</script>

<style scoped>
header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;

  height: 10vh;

  display: flex;
  justify-content: space-around;
  align-items: center;

  background: transparent;

  z-index: 1000;
}
</style>
