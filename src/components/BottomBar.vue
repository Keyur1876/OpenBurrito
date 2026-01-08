<script setup>
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()

function go(name) {
  router.push({ name })
}

function isActive(name) {
  return route.name === name
}
</script>

<template>
  <nav class="bottom-bar">
    <!-- ADD -->
    <button class="icon-btn" @click="go('add')">➕</button>

    <!-- MAP (HOME) -->
    <button class="icon-btn" :class="{ active: isActive('home') }" @click="go('home')">🗺️</button>

    <!-- CHAT / NOTES -->
    <button class="pi pi-check" @click="go('wiki')" />

    <!-- PROFILE -->
    <button class="icon-btn" @click="go('profile')">👤</button>
  </nav>
</template>

<style scoped>
button {
  font-size: 2rem;
}
.bottom-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;

  height: 64px;
  display: flex;
  justify-content: space-around;
  align-items: center;

  background: rgba(240, 240, 240, 0.95);
  backdrop-filter: blur(6px);
  border-top: 1px solid #ccc;

  z-index: 1000;
}

.icon-btn {
  width: 44px;
  height: 44px;

  display: flex;
  align-items: center;
  justify-content: center;

  background: white;
  border-radius: 12px;
  border: 1px solid #bbb;

  font-size: 20px;
  cursor: pointer;
  transition:
    transform 0.15s ease,
    box-shadow 0.15s ease;
}

.icon-btn:hover {
  transform: scale(1.05);
}

.icon-btn.active {
  box-shadow: 0 0 0 2px #000;
}
</style>
