<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <div class="entry-detail">

    <!-- Image -->
    <Image
      v-if="entry.image_url"
      :src="entry.image_url"
      imageClass="w-full rounded-xl mb-3"
    />

    <!-- Title -->
    <h2 class="text-2xl font-bold mb-1">
      {{ entry.name }}
    </h2>

    <!-- City -->
    <div v-if="entry.city" class="text-sm opacity-70 mb-3">
      📍 {{ entry.city }}
    </div>

    <!-- Meta -->
    <div class="flex gap-2 flex-wrap mb-3">
      <span v-if="entry.type" class="chip">{{ entry.type }} - {{ entry.label }} - {{ entry.length }} m</span>
    </div>

    <!-- Description -->
    <Fieldset legend="Description">
      {{ entry.description }}
    </Fieldset>

  </div>
</template>

<script setup>
import { Image, Fieldset } from "primevue";

defineProps({
  entry: {
    type: Object,
    required: true,
  },
});
</script>

<style scoped>
.chip {
  padding: 4px 10px;
  border-radius: 999px;
  font-size: 12px;
  border: 1px solid rgba(0,0,0,.15);
}
</style>
