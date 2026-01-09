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

import { WikiFilterDemo } from '@/components/wiki/demos/WikiFilterDemo.js'
import { WikiSearchDemo } from '@/components/wiki/demos/WikiSearchDemo.js'
import { WikiTopBarDemo } from '@/components/wiki/demos/WikiTopBarDemo.js'
import { WikiCardDemo } from '@/components/wiki/demos/WikiCardDemo.js'

const selectedDemo = ref('WikiFilter')

const demos = computed(() => {
  return {
    WikiFilterDemo,
    WikiSearchDemo,
    WikiCardDemo,
    WikiTopBarDemo,
  }
})
</script>
