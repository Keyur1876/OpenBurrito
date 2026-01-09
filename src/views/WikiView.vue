<template>
  <h1>Wiki</h1>
  <IconField>
    <InputIcon>
      <i class="pi pi-search" />
    </InputIcon>
    <InputText v-model="wiki.search" placeholder="Search Wiki" />
  </IconField>
  <DataView :value="entries">
    <template #list="{ items }">
      <WikiCard v-for="i in items" :entry="i"> </WikiCard>
    </template>
  </DataView>
</template>

<script setup>
import { useWikiStore } from '@/stores/wiki'
import { DataView, InputText, IconField, InputIcon } from 'primevue'
import WikiCard from '@/components/WikiCard.vue'
import { ref, computed } from 'vue'

const wiki = useWikiStore()

const entries = computed(() => {
  const q = wiki.search.toLowerCase()

  return wiki.entries.filter((e) => e.name.toLowerCase().includes(q))
})
</script>

<style scoped></style>
