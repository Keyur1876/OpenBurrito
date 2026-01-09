<template>
  <div>
    <DoxenSidebar v-model="selectedDemo" :demos="demos" />
    <VueDoxen v-model="selectedDemo" :demos="demos" />
    <link
      href="https://unpkg.com/highlightjs/styles/ir-black.css"
      rel="stylesheet"
      type="text/css"
    />
  </div>
</template>

<script setup>
import { DoxenSidebar, VueDoxen } from 'vue-doxen'
import { computed, ref } from 'vue'

import { WikiFilter, WikiSearch, WikiTopBar, WikiCard } from '@/components/wiki'

defineOptions({
  name: 'Doc',
})

const selectedDemo = ref('WikiFilter')

const demos = computed(() => {
  return {
    WikiFilter,
    WikiSearch,
    WikiTopBar,
    WikiCard,
  }
})
</script>
