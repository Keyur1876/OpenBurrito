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

<script>
import { computed, ref } from 'vue'
import { DoxenSidebar, VueDoxen } from 'vue-doxen'

import 'vue-doxen/vue-doxen.css'

import EditorView from '@/views/EditorView.vue'
import MapView from '@/views/MapView.vue'

export default {
  name: 'DocumentationPage',
  components: {
    DoxenSidebar,
    VueDoxen,
  },
  setup: function () {
    const selectedDemo = ref('EditorView')

    const demos = computed(() => {
      return {
        EditorView,
        MapView,
      }
    })

    return {
      demos,
      selectedDemo,
    }
  },
}
</script>
