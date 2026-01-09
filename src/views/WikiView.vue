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
    <Column field="name">
      <template #filter="{ filterModel, filterCallback }">
        <InputText type="search" v-model="filterModel.value" @input="filterCallback()"/>
      </template>
    </Column>
    <Column field="type" filter />
  </DataTable>
</template>

<script setup>
import { useWikiStore } from '@/stores/wiki'
import { DataTable, Column, InputText } from 'primevue'
import WikiCard from '@/components/WikiCard.vue'
import { ref } from 'vue'

const wikiStore = useWikiStore()

const filters = ref({
  name: { value: null, matchMode: 'contains' },
  type: { value: null, matchMode: 'contains' },
  global: { value: null, matchMode: 'contains' },
})
</script>

<style scoped></style>
