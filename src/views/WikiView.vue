<template>
  <h1>Wiki</h1>
  <IconField>
    <InputIcon>
      <i class="pi pi-search" />
    </InputIcon>
    <InputText v-model="search" placeholder="Search Wiki" />
  </IconField>
  <DataView :value="filteredEntries">
    <template #list="{ items }">
      <WikiCard v-for="i in items" :entry="i"> </WikiCard>
      <div v-for="item in items" :key="item.id">
        {{ item.name }}
      </div>
    </template>
  </DataView>
</template>

<script setup>
import { useWikiStore } from '@/stores/wiki'
import { DataView, Card, DataTable, Column, InputText, IconField, InputIcon } from 'primevue'
import WikiCard from '@/components/WikiCard.vue'
import { ref, computed } from 'vue'

const wikiStore = useWikiStore()
const search = ref('')

const filteredEntries = computed(() => {
  if (!search.value) return wikiStore.entries

  const q = search.value.toLowerCase()

  return wikiStore.entries.filter(
    (entry) => entry.name.toLowerCase().includes(q) || entry.type.toLowerCase().includes(q),
  )
})
</script>

<style scoped></style>
