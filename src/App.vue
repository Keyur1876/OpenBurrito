<script setup>
import { useRouter, useRoute } from 'vue-router'
import { BottomBar } from '@/components'
import { Toast } from 'primevue'

const router = useRouter()
const route = useRoute()

</script>

<template>
  <Toast />
  <RouterView />

  <BottomBar v-if="route.name !== 'doc'" />
</template>
