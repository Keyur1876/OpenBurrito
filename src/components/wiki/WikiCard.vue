<template>
  <Card @click="opened = true">
    <template #header>
      <img alt="img" :src="entry.image" />
    </template>
    <template #title>{{ entry.name }}</template>
  </Card>
  <Dialog v-model:visible="opened" modal :header="entry.name">
    <template #header>
      <EntryHeader :entry="entry"/>
    </template>
    <Entry />
  </Dialog>
</template>

<script setup>
import { Card, Dialog } from 'primevue'
import { ref } from 'vue'
import { Entry, EntryHeader } from '@/components/wiki'

const opened = ref(false)

defineProps({
  entry: {
    type: Object,
    default: {
      id: 1,
      type: 'Boulder',
      name: 'Lokomotive Rock',
      lat: 50.96658,
      lng: 14.08351,
      image: '/images/istockphoto1.jpg',
      description:
        'A distinctive sandstone formation near Kurort Rathen. Popular in the Saxon Switzerland area for traditional climbing and bouldering-style problems on solid sandstone.',
    },
  },
})
</script>

<style scoped>
img {
  width: 100%;
}
</style>
