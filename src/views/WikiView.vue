<!-- eslint-disable vue/valid-v-for -->
<template>
  <h1 class="font-black text-5xl text-center m-2">Wiki</h1>
  <WikiTopBar class="sticky top-0" />

  <!-- NORMAL VIEW stays unchanged: grid always shows -->
  <DataView :value="entries" layout="grid">
    <template #grid="{ items }">
      <div class="grid place-item-center gap-5 m-5 grid-cols-[repeat(auto-fit,minmax(20rem,1fr))]">
        <WikiCard
          v-for="i in items"
          :key="i.id"
          :entry="i"
          @open="openEntry"
        />
      </div>
    </template>
  </DataView>

  <!-- SINGLE dialog for both /wiki and /wiki/:id -->
  <Dialog
    v-model:visible="dialogOpen"
    modal
    dismissableMask
    :header="selectedEntry?.name || 'Details'"
    style="width:min(900px, 95vw)"
    @hide="onDialogHide"
  >
    <div v-if="selectedEntry">
      <Entry :entry="selectedEntry" />
    </div>
    <div v-else>
      Loading…
    </div>
  </Dialog>
</template>

<script setup>
import { computed, onMounted, ref, watch, reactive } from "vue"; // ✅ add reactive
import { useRoute, useRouter } from "vue-router";
import { DataView } from "primevue";
import Dialog from "primevue/dialog";

import { useWikiStore } from "@/stores/wiki";
import { useLocations } from "@/composables/useLocations";

import { WikiCard, WikiTopBar } from "@/components/wiki";
import Entry from "@/components/wiki/Entry.vue";

const wiki = useWikiStore();
const { locations, reload } = useLocations();

const route = useRoute();
const router = useRouter();

const dialogOpen = ref(false);
const selectedId = ref(null);

const ui = reactive({
  dialogOpen: false,
  selectedId: null,
});

const debugState = reactive({
  mountedAt: null,
  lastRouteId: null,
});

onMounted(async () => {
  debugState.mountedAt = Date.now();
  await reload();
});

/** Your existing filter logic (unchanged) */
const entries = computed(() => {
  const s = (wiki.search || "").toLowerCase();
  const f = (wiki.filter || "all").toLowerCase();

  function filter(e) {
    const matchSearch = e.name.toLowerCase().includes(s);
    const matchFilter = e.type.toLowerCase() === f || f === "all";
    return matchSearch && matchFilter;
  }

  return (locations.value || []).filter(filter);
});

const selectedEntry = computed(() => {
  if (!selectedId.value) return null;
  return (locations.value || []).find((l) => String(l.id) === String(selectedId.value)) || null;
});

watch(
  () => route.params.id,
  (id) => {
    debugState.lastRouteId = id ?? null;

    if (id) {
      selectedId.value = id;
      dialogOpen.value = true;
    } else {
      dialogOpen.value = false;
      selectedId.value = null;
    }
  },
  { immediate: true }
);

watch(
  dialogOpen,
  (v) => {
    ui.dialogOpen = v;
  },
  { immediate: true }
);

watch(
  selectedId,
  (v) => {
    ui.selectedId = v;
  },
  { immediate: true }
);

function openEntry(entry) {
  router.push({ name: "wiki-detail", params: { id: entry.id } });
}

function onDialogHide() {
  if (route.params.id) {
    router.replace({ name: "wiki" }); // or router.replace("/wiki")
  }
}
</script>
