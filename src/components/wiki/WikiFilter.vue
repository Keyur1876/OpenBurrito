<template>
  <SelectButton class="select" v-model="wiki.filter" :options="filters" :allowEmpty="false"/>
</template>

<script setup>
import { useWikiStore } from '@/stores/wiki'
import { SelectButton } from 'primevue'

const wiki = useWikiStore()

const filters = ['All', ...wiki.entryTypes]
</script>

<style scoped></style>
