<template>
  <Image :src="props.entry.image" preview width="100%"/>
  <Fieldset legend="Description">
    <p>{{ entry.description }}</p>
  </Fieldset>
  <OrderList v-if="isBoulder" v-model="relatedClimbs" dataKey="id">
    <template #option="{ option }">
      {{ option.name }}
    </template>
  </OrderList>
</template>

<script setup>
import { Image, OrderList, Fieldset } from 'primevue'
import { ref } from 'vue'
import { useWikiStore } from '@/stores/wiki'

const wiki = useWikiStore()

const props = defineProps({
  entry: {
    type: Object,
  },
})

const isBoulder = props.entry.type.toLowerCase() === 'boulder'

// WARN: undefined for climbs
const relatedClimbs = wiki.entries.filter((i) => i.location === props.entry.id)

const init = ref({
  name: 'Test',
})

const onFormSubmit = ({ valid }) => {
  if (valid) {
    console.log('Tes')
  }
}
</script>

<style scoped></style>
