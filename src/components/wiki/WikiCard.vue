<template>
  <div class="wiki-card" @click="$emit('open', entry)">
    <img v-if="entry.image_url" :src="entry.image_url" class="thumb" />
    <div class="body">
      <div class="title">{{ entry.name }}</div>
      <div class="subtitle" v-if="entry.city">{{ entry.city }}</div>
      <div class="meta">{{ entry.type }}</div>
    </div>
  </div>
</template>

<script setup>
defineEmits(["open"]);

defineProps({
  entry: {
    type: Object,
    required: true,
  },
});
</script>

<style scoped>
.wiki-card {
  width: 100%;
  border-radius: 16px;
  overflow: hidden;
  border: 1px solid rgba(0,0,0,.12);
  background: white;
  cursor: pointer;
  transition: transform .08s ease;
}
.wiki-card:hover {
  transform: scale(1.01);
}
.thumb {
  width: 100%;
  height: 180px;
  object-fit: cover;
}
.body {
  padding: 10px 12px;
}
.title {
  font-weight: 800;
  font-size: 16px;
}
.subtitle {
  opacity: 0.7;
  font-size: 13px;
  margin-top: 2px;
}
.meta {
  margin-top: 6px;
  font-size: 12px;
  opacity: 0.7;
}
</style>
