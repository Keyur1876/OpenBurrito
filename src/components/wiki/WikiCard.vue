<template>
  <Card @click="opened = true" class="overflow-hidden cursor-pointer">
    <template #header>
      <div class="h-20 overflow-hidden">
        <Image :src="entry.image" />
      </div>
    </template>
    <template #title>{{ entry.name }}</template>
  </Card>
  <Dialog
    v-model:visible="opened"
    modal
    :header="entry.name"
    maximizable
    :breakpoints="{ '1199px': '75vw', '575px': '90vw' }"
  >
    <template #header>
      <EntryHeader :entry="entry" />
    </template>
    <Entry :entry="entry" />
  </Dialog>
</template>

<script setup>
import { Card, Dialog, Image } from 'primevue'
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

<style module></style>
