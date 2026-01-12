<script setup>
import { useRouter } from 'vue-router'
import { Button } from 'primevue'

const router = useRouter()

const buttons = [
  { icon: 'pi pi-plus', route: '/add' },
  { icon: 'pi pi-map', route: '/' },
  { icon: 'pi pi-book', route: '/wiki' },
  { icon: 'pi pi-user', route: '/' },
]
</script>

<template>
  <nav class="flex justify-around items-center h-15 fixed bottom-0 z-1000 w-screen bg-white">
    <Button v-for="i in buttons" :icon="i.icon" class="h-10 w-10" @click="router.push(i.route)" />
  </nav>
</template>
