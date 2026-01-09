<template>
  <IconField class="search-bar" :pt="pt">
    <InputIcon>
      <i class="pi pi-search" />
    </InputIcon>
    <InputText v-model="wiki.search" placeholder="Search" :pt="ptSearch"/>
  </IconField>
</template>

<script setup>
import { useWikiStore } from '@/stores/wiki'
import { InputText, IconField, InputIcon } from 'primevue'

const wiki = useWikiStore()

const pt = {
  root: {
    style: 'max-width:40%',
  },
}

const ptSearch = {
  root: {
    style: 'width:100%',
  },
}
</script>

<style scoped>
</style>
