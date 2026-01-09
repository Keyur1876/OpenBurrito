<template>
  <h1>Wiki</h1>
  <DataTable
    :value="wikiStore.entries"
    v-model:filters="filters"
    :globalFilterFields="['name', 'type']"
    showHeaders="false"
    size="large"
  >
    <template #empty> No wiki entries found. </template>
    <template #loading> Loading wiki entries. Please wait. </template>
    <template #header>
      <IconField>
        <InputIcon>
          <i class="pi pi-search" />
        </InputIcon>
        <InputText v-model="filters['global'].value" placeholder="Search Wiki" size="large" />
      </IconField>
    </template>
    <Column field="name"> </Column>
  </DataTable>
</template>

<script setup>
import { useWikiStore } from '@/stores/wiki'
import { Card, DataTable, Column, InputText, IconField, InputIcon } from 'primevue'
import WikiCard from '@/components/WikiCard.vue'
import { ref, computed } from 'vue'

const wikiStore = useWikiStore()
const filters = ref({ global: { value: null, matchMode: 'contains' } })
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
