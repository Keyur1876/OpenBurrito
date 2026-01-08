<template>
  <h1>Wiki</h1>
  <DataView :value="wikiStore.entries">
    <template #list="s">
      <div v-for="(item, index) in s.items" :key="index">
        {{ item }}
      </div>
    </template>
  </DataView>
</template>

<script setup>
import DataView from 'primevue/dataview'
import { useWikiStore } from '@/stores/wiki'

const wikiStore = useWikiStore()
</script>

<style scoped></style>
