<template>
  <Card>
    <template #header>
      <img alt="img" :src="entry.image"/>
    </template>
    <template #title>{{ entry.name }}</template>
    <template #content>Content</template>
  </Card>
</template>

<script setup>
import Card from 'primevue/card'

defineProps({ entry: Object })
</script>

<style scoped>
img {
  width: 100%;
}
</style>
