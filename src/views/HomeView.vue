<script setup>
// Main map view displaying all locations.
// Integrates Leaflet, search dropdown,
// and marker interaction.

import { onMounted, onActivated, nextTick, ref, computed, watch } from "vue";
import L from "leaflet";
import SearchBar from "@/components/SearchBar.vue";
import "leaflet/dist/leaflet.css";
import iconUrl from "leaflet/dist/images/marker-icon.png";
import iconRetinaUrl from "leaflet/dist/images/marker-icon-2x.png";
import shadowUrl from "leaflet/dist/images/marker-shadow.png";
import { refDebounced } from "@vueuse/core";
import { useLocations } from "@/composables/useLocations";
import { useLocationStore } from "@/stores/location";
import { useRouter } from "vue-router";

const geo = useLocationStore();
const { locations, loading, errorMsg, reload } = useLocations();
const router = useRouter();
const fallbackCenter = [50.9619, 14.0732];
const searchBarRef = ref(null);

// SEARCH
const query = ref("");
const debouncedQuery = refDebounced(query, 250);
const showDropdown = ref(false);
const USER_ZOOM = 13; 

const filteredLocations = computed(() => {
  const q = debouncedQuery.value.trim().toLowerCase();
  if (!q) return [];

  return (locations.value || []).filter((l) => {
    const haystack = [l.name, l.city, l.label, l.type]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();
    return haystack.includes(q);
  });
});

// LEAFLET
let map;
let markerLayer;
const markersById = new Map();

function esc(s) {
  const str = s ? String(s) : "";
  return str.replace(/[&<>"']/g, (c) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;",
  }[c]));
}


function buildPopupHtml(l) {
  return `
    <div class="loc-popup" style="max-width:260px">

      ${
        l.image_url
          ? `
          <div style="margin-bottom:8px">
            <img
              src="${esc(l.image_url)}"
              alt="${esc(l.name)}"
              style="width:100%; border-radius:12px;"
            />
          </div>
        `
          : ""
      }

      <div style="font-weight:700; font-size:15px; margin-bottom:4px;">
        ${esc(l.name)}
      </div>

      ${
        l.city
          ? `<div style="font-size:12px; opacity:.75; margin-bottom:6px;">
              ${esc(l.city)}
            </div>`
          : ""
      }

      <div style="display:flex; gap:6px; flex-wrap:wrap; margin-bottom:8px;">
        ${
          l.type
            ? `<span style="border:1px solid rgba(0,0,0,.15); padding:2px 8px; border-radius:999px; font-size:12px;">
                ${esc(l.type)}
              </span>`
            : ""
        }
        ${
          l.label
            ? `<span style="border:1px solid rgba(0,0,0,.15); padding:2px 8px; border-radius:999px; font-size:12px;">
                ${esc(l.label)}
              </span>`
            : ""
        }
        ${
          l.length
            ? `<span style="border:1px solid rgba(0,0,0,.15); padding:2px 8px; border-radius:999px; font-size:12px;">
                ${esc(l.length)} m
              </span>`
            : ""
        }
      </div>

      ${
        l.first_ascent
          ? `<div style="font-size:12px; margin-bottom:6px;">
              <strong>First ascent:</strong> ${esc(l.first_ascent)}
            </div>`
          : ""
      }

      ${
        l.description
          ? `<div style="font-size:12px; line-height:1.35; margin-bottom:10px;">
              ${esc(l.description)}
            </div>`
          : ""
      }

      <button
        type="button"
        class="wiki-open-btn"
        data-wiki-id="${esc(l.id)}"
        style="
          width:100%;
          padding:8px 10px;
          border-radius:12px;
          border:1px solid rgba(0,0,0,.15);
          background:#fff;
          font-size:13px;
          font-weight:600;
          cursor:pointer;
        "
      >
        Open in Wiki →
      </button>

    </div>
  `;
}

function renderMarkers() {
  if (!map || !markerLayer) return;

  markerLayer.clearLayers();
  markersById.clear();

  const bounds = L.latLngBounds([]);

  for (const l of locations.value || []) {
    if (typeof l.lat !== "number" || typeof l.lng !== "number") continue;

    const marker = L.marker([l.lat, l.lng]).addTo(markerLayer);

    marker.bindPopup(buildPopupHtml(l), {
      className: "leaflet-popup--loc",
      maxWidth: 360,
      autoPanPadding: [20, 20],
      autoPan: true,
      autoPanPaddingTopLeft: [0, 160], // leaves room for your top panel
      autoPanPaddingBottomRight: [20, 80]
    });

    marker.on("popupopen", (e) => {
    const el = e.popup.getElement();
    if (!el) return;

    const btn = el.querySelector(".wiki-open-btn");
    if (!btn) return;

    // Avoid stacking listeners if popup opens multiple times
    if (btn.dataset.bound === "1") return;
    btn.dataset.bound = "1";

    btn.addEventListener("click", (ev) => {
      ev.preventDefault();
      ev.stopPropagation();

      const id = btn.dataset.wikiId;
      if (!id) return;

      router.push({ name: "wiki-detail", params: { id } });
    });
  });
    markersById.set(l.id, marker);
    bounds.extend([l.lat, l.lng]);
  }

  const hasDevice = typeof geo.lat === "number" && typeof geo.lng === "number";
  if (!hasDevice && bounds.isValid()) {
    map.fitBounds(bounds, { padding: [30, 30] });
  }

}

function selectLocation(loc) {
  query.value = loc.name;
  showDropdown.value = false;

  const marker = markersById.get(loc.id);
  if (!marker) return;

  map.setView([loc.lat, loc.lng], USER_ZOOM, { animate: true });

  marker.openPopup();
}

function clearSearch() {
  query.value = "";
  showDropdown.value = false;

  searchBarRef.value?.focusInput?.();
}

onMounted(async () => {
  // ask device location (async store)
  geo.setToDeviceLocation();

  // create map with safe center (fallback)
  map = L.map("map", {
    center: fallbackCenter,
    zoom: 12,
    zoomControl: false,
  });

  L.control.zoom({ position: "bottomright" }).addTo(map);

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
    attribution: "&copy; OpenStreetMap contributors",
  }).addTo(map);

  // marker icon fix
  const DefaultIcon = L.icon({
    iconUrl,
    iconRetinaUrl,
    shadowUrl,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
  });
  L.Marker.prototype.options.icon = DefaultIcon;

  // layer for markers
  markerLayer = L.layerGroup().addTo(map);

  // load locations using composable (single source of truth)
  await reload();

  // center to device location once (if available)
 watch(
  () => [geo.lat, geo.lng],
  ([lat, lng]) => {
    if (typeof lat === "number" && typeof lng === "number") {
      map.setView([lat, lng], USER_ZOOM, { animate: true });
    }
  }
);

  renderMarkers();
  recenterToMe();

  map.on("click", () => {
    showDropdown.value = false;
  });
});

// if locations change (reload), rebuild markers
watch(
  () => locations.value,
  () => renderMarkers(),
  { deep: true }
);

function recenterToMe() {
  const { lat, lng } = geo;
  if (typeof lat === "number" && typeof lng === "number") {
    map.setView([lat, lng], USER_ZOOM, { animate: true });
  } else {
    geo.setToDeviceLocation(); // try again if not ready
  }
}

onActivated(async () => {
  await nextTick();
  map?.invalidateSize();
  recenterToMe();
});

</script>

<template>
  <div class="map-page">
    <div id="map"></div>

    <div class="overlay">
      <div class="overlay-inner">
      <div class="search-wrap">
        <SearchBar
          ref="searchBarRef"
          v-model="query"
          placeholder="Search boulders..."
          @focus="showDropdown = true"
          @clear="clearSearch"
        />

        <div v-if="loading" class="mini-status">Loading…</div>
        <div v-if="errorMsg" class="mini-status error">{{ errorMsg }}</div>

        <!-- DROPDOWN -->
        <div v-if="showDropdown && query.trim()" class="dropdown" @mousedown.prevent>
          <template v-if="filteredLocations.length">
            <button
              v-for="b in filteredLocations"
              :key="b.id"
              type="button"
              class="dropdown-item"
              @click="selectLocation(b)"
            >
              <div class="name">{{ b.name }}</div>
              <div class="city">{{ b.city }}</div>
            </button>
          </template>

          <div v-else class="dropdown-empty">No results</div>
        </div>
      </div>
    </div>
  </div>
  </div>
</template>

<style scoped>
.map-page {
  width: 100%;
  height: 100vh;
  position: relative;
}

#map {
  width: 100%;
  height: 100%;
}

.overlay {
  position: absolute;
  inset: 0;
  z-index: 500;
  pointer-events: none;
  box-sizing: border-box;
}

/* new inner wrapper that can have padding */
.overlay-inner {
  height: 100%;
  padding-top: 56px;
  padding-bottom: 64px;
  box-sizing: border-box;
}


/* SEARCH AREA */
.search-wrap {
  pointer-events: auto;
  width: calc(100% - 40px);
  margin: 12px auto 0 auto;
  position: relative;
}

/* MINI STATUS */
.mini-status {
  margin-top: 8px;
  padding: 8px 10px;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.92);
  border: 1px solid rgba(0, 0, 0, 0.10);
  font-size: 12px;
}
.mini-status.error {
  border-color: rgba(255, 80, 80, 0.35);
  background: rgba(255, 230, 230, 0.95);
}

/* DROPDOWN */
.dropdown {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  margin-top: 8px;
  background: white;
  border-radius: 14px;
  border: 1px solid rgba(0, 0, 0, 0.12);
  overflow: hidden;
  box-shadow: 0 10px 28px rgba(0, 0, 0, 0.18);
  max-height: 280px;
  overflow-y: auto;
  z-index: 9999;
}

.dropdown-empty {
  padding: 10px 12px;
  color: rgba(0, 0, 0, 0.7);
  font-size: 13px;
}

.dropdown-item {
  width: 100%;
  text-align: left;
  border: none;
  background: white;
  padding: 10px 12px;
  cursor: pointer;
}

.dropdown-item:hover {
  background: rgba(0, 0, 0, 0.04);
}

.name {
  font-weight: 700;
  font-size: 14px;
}

.city {
  font-size: 12px;
  opacity: 0.7;
}
</style>
