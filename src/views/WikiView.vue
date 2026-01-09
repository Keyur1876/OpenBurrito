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
import { ref, computed } from 'vue'
import { WikiCard, WikiSearch, WikiTopBar } from '@/components/wiki'

const wiki = useWikiStore()

const entries = computed(() => {
  function filter(e) {
    const s = wiki.search.toLowerCase()
    const f = wiki.filter.toLowerCase()

    const matchSearch = e.name.toLowerCase().includes(s)
    const matchFilter = e.type.toLowerCase() === f || f === 'all'

    return matchSearch && matchFilter
  }

  return wiki.entries.filter(filter)
})
</script>

<style scoped></style>
