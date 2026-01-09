<template>
  <IconField class="search-bar" >
    <InputIcon>
      <i class="pi pi-search" />
    </InputIcon>
    <InputText v-model="wiki.search" placeholder="Search" />
  </IconField>
</template>

<script setup>
import { useWikiStore } from '@/stores/wiki'
import { InputText, IconField, InputIcon } from 'primevue'

const wiki = useWikiStore()
</script>

<style scoped>
</style>
