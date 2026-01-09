<template>
  <Card>
    <template #header>
      <img alt="img" :src="entry.image" />
    </template>
    <template #title>{{ entry.name }}</template>
  </Card>
</template>

<script setup>
import { Card } from 'primevue'

defineProps({ entry: Object })
</script>

<style scoped>
img {
  width: 100%;
}
</style>
