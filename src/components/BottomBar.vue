<script setup>
import { useRouter } from 'vue-router'
import { Button } from 'primevue'

const router = useRouter()
</script>

<template>
  <nav class="flex justify-around items-center h-15 fixed bottom-0 z-1000 w-screen bg-white">
    <Button icon="pi pi-plus" class="h-10 w-10" @click="router.push('/add')" />
    <Button icon="pi pi-map" class="h-10 w-10" @click="router.push('/')" />
    <Button icon="pi pi-book" class="h-10 w-10" @click="router.push('/wiki')" />
    <Button icon="pi pi-user" class="h-10 w-10" @click="router.push('/')" />
  </nav>
</template>
