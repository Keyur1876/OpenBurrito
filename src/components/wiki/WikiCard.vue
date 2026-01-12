<template>
  <Card @click="opened = true" class="overflow-hidden cursor-pointer">
    <template #header>
      <div class="h-20 overflow-hidden">
        <Image :src="entry.image" />
      </div>
    </template>
    <template #title>
      <div class="flex items-center">
        <i v-if="isBoulder" class="pi pi-sort-up-fill" />
        <i v-else class="pi pi-flag-fill" />
        <h3 class="pl-5">{{ entry.name }}</h3>
      </div>
    </template>
  </Card>

  <Dialog v-model:visible="opened" modal :breakpoints="{ '1199px': '75vw', '575px': '90vw' }">
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

const props = defineProps({
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

const isBoulder = props.entry.type.toLowerCase() === 'boulder'
</script>
