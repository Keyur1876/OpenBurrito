<template>
  <h1 class="font-black text-5xl text-center m-2">Wiki</h1>
  <WikiTopBar class="sticky top-0" />
  <DataView :value="entries" layout="grid">
    <template #grid="{ items }">
      <div class="grid place-item-center gap-5 m-5 grid-cols-[repeat(auto-fit,minmax(20rem,1fr))]">
        <WikiCard v-for="i in items" :entry="i"> </WikiCard>
      </div>
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
