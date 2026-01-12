<template>
  <Avatar v-if="isBoulder" icon="pi pi-sort-up-fill" />
  <Avatar v-else icon="pi pi-flag-fill" />
  <div class="heading">
    <h2 class="font-bold text-3">{{ entry.name }}</h2>
    <p v-if="isBoulder">lat: {{ entry.location[0] }}, lng: {{ entry.location[1] }}</p>
    <p v-else>{{ relatedBoulder.name }}</p>
  </div>
</template>

<script setup>
import { Avatar } from 'primevue'
import { computed } from 'vue'
import { useWikiStore } from '@/stores/wiki'

const wiki = useWikiStore()

const props = defineProps({
  entry: {
    type: Object,
  },
})

const isBoulder = computed(() => {
  props.entry.type.toLowerCase() === 'boulder'
})

// WARN: undefined for boulders
const relatedBoulder = wiki.entries.find((i) => i.id === props.entry.location)
</script>

<style scoped></style>
