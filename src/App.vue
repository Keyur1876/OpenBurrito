<script setup>
import { useRouter, useRoute } from 'vue-router'
import {BottomBar} from '@/components'
import { Toast } from 'primevue'

const router = useRouter()
const route = useRoute()

function handleGo(name) {
  router.push({ name }) // assumes your routes have "name"
}
</script>

<template>
  <RouterView />

  <BottomBar @go="handleGo" v-if="route.name !== 'doc'" />
</template>
