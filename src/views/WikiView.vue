<template>
  <WikiTopBar />
  <h1>Wiki</h1>
  <DataView :value="entries">
    <template #list="{ items }">
      <WikiCard v-for="i in items" :entry="i"> </WikiCard>
    </template>
  </DataView>
</template>

<script setup>
import { useWikiStore } from '@/stores/wiki'
import { DataView } from 'primevue'
import WikiCard from '@/components/WikiCard.vue'
import { ref, computed } from 'vue'
import WikiSearch from '@/components/WikiSearch.vue'
import WikiTopBar from '@/components/WikiTopBar.vue'

const wiki = useWikiStore()

const entries = computed(() => {
  const q = wiki.search.toLowerCase()

  return wiki.entries.filter((e) => e.name.toLowerCase().includes(q))
})
</script>

<style scoped></style>
