<template>
  <Form v-slot="$form" :initalValues="init" @submit="onFormSubmit">
    <InputText name="name" type="text" placeholder="Burden of Dreams" />
    <Button type="submit" severity="secondary" label="Submit" />
  </Form>
</template>

<script setup>
import { Form } from '@primevue/forms'
import { InputText, Button } from 'primevue'
import { ref } from 'vue'

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
