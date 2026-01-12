<template>
  <Toolbar class="toolbar">
    <template #start><WikiFilter /></template>
    <template #end><WikiSearch /></template>
  </Toolbar>
</template>

<script setup>
import { WikiSearch, WikiFilter } from '@/components/wiki'
import { Toolbar } from 'primevue'
</script>

<style scoped>
.toolbar {
  background: transparent;
  border: none;

  z-index: 1000;
}
</style>
