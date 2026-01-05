<script setup>
import { useRouter } from "vue-router";
import TopBar from "@/components/TopBar.vue";
import BottomBar from "@/components/BottomBar.vue";

const router = useRouter();

function handleGo(name) {
  router.push({ name }); // assumes your routes have "name"
}
</script>

<template>
  <TopBar />

  <!-- Your routed views -->
  <RouterView />

  <BottomBar @go="handleGo" />
</template>

<style>
html, body, #app {
  height: 100%;
  margin: 0;
}

.leaflet-bottom.leaflet-right {
  margin-bottom: 80px; /* bottom bar + breathing room */
}

.leaflet-control-zoom {
  border-radius: 12px;
  overflow: hidden;
}
</style>
