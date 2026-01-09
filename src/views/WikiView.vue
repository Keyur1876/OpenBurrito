<template>
  <h1>Wiki</h1>
  <DataTable
    :value="wikiStore.entries"
    v-model:filters="filters"
    filterDisplay="row"
    :globalFilterFields="['name', 'type']"
  >
    <template #empty> No wiki entries found. </template>
    <template #loading> Loading wiki entries. Please wait. </template>
    <template #header>
      <IconField>
        <InputIcon>
          <i class="pi pi-search" />
        </InputIcon>
        <InputText v-model="filters['global'].value" placeholder="Search Wiki" />
      </IconField>
    </template>
    <Column field="name"> </Column>
    <Column field="type"/>
  </DataTable>
</template>

<script setup>
import { useWikiStore } from '@/stores/wiki'
import { DataTable, Column, InputText, IconField, InputIcon } from 'primevue'
import WikiCard from '@/components/WikiCard.vue'
import { ref } from 'vue'

const wikiStore = useWikiStore()
const filters = ref({ global: { value: null, matchMode: 'contains' } })
</script>

<style scoped></style>
