<template>
  <IconField class="search-bar">
    <InputIcon>
      <i class="pi pi-search" />
    </InputIcon>
    <InputText v-model="wiki.search" placeholder="Search Wiki" />
  </IconField>
</template>

<script setup>
import { useWikiStore } from '@/stores/wiki'
import { InputText, IconField, InputIcon } from 'primevue'

const wiki = useWikiStore()
</script>

<style scoped>
.search-bar {
  position: absolute;
  z-index: 500;
}
</style>
