<template>
  <Card @click="opened = true" class="overflow-hidden cursor-pointer">
    <template #header>
      <div class="h-20 overflow-hidden">
        <Image :src="entry.image_url" />
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
import { ref, computed } from 'vue'
import { Entry, EntryHeader } from '@/components/wiki'

const opened = ref(false)

const props = defineProps({
  entry: {
    type: Object,
    default: {
      id: 1,
      name: 'Lokomotive Rock',
      city: 'Dresden',
      lat: 50.96658,
      lng: 14.08351,
      type: 'boulder',
      length: '30',
      first_ascent: 'Adam Ondra',
      description:
        'A distinctive sandstone formation near Kurort Rathen. Popular in the Saxon Switzerland area for traditional climbing and bouldering-style problems on solid sandstone.',
      image_url:
        'https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fgripped.com%2Fwp-content%2Fuploads%2F2024%2F03%2Fbosiburden.jpg&f=1&nofb=1&ipt=d6450989fa320bb5fee6702ad00e25b19e161bc20cd721b3be02f1b205dca09a',
    },
  },
})

const isBoulder = computed(() => {
  return props.entry.type.toLowerCase() === 'boulder'
})
</script>
