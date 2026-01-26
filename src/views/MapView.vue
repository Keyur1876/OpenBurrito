<script setup>
// Fullscreen map view with UI overlay.
// Loads locations and displays them as markers.

import { ref, onMounted, watch } from "vue";
import L from "leaflet";
import SearchBar from "@/components/SearchBar.vue";

import "leaflet/dist/leaflet.css";
import iconUrl from "leaflet/dist/images/marker-icon.png";
import iconRetinaUrl from "leaflet/dist/images/marker-icon-2x.png";
import shadowUrl from "leaflet/dist/images/marker-shadow.png";

import { useOnline, useDocumentVisibility } from "@vueuse/core";
import { useLocations } from "@/composables/useLocations";
import { useLocationStore } from "@/stores/location";


const fallbackCenter = [50.9619, 14.0732];

const isPopupOpen = ref(false);

// Locations composable
const { locations, loading, errorMsg, reload } = useLocations();

// VueUse: reactive online/offline state
const isOnline = useOnline();

// VueUse: track browser tab visibility
const visibility = useDocumentVisibility();

// Search state (was missing before)
const mapSearch = ref("");

// Leaflet refs
let map;
let markerLayer; // holds all current markers

defineExpose({
  getMap: () => map,
});


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

function buildPopupHtml(loc) {
  return `
    <div style="max-width:240px">
      <div style="font-weight:700; font-size:14px; margin-bottom:6px;">
        ${esc(loc.name)}
      </div>

      ${
        loc.image_url
          ? `<img
              src="${esc(loc.image_url)}"
              alt="${esc(loc.name)}"
              style="width:100%; border-radius:10px; margin-bottom:8px;"
            />`
          : ""
      }

      ${
        loc.city
          ? `<div style="font-size:12px; opacity:.85; margin-bottom:6px;">
              ${esc(loc.city)}
            </div>`
          : ""
      }

      <div style="display:flex; gap:6px; flex-wrap:wrap; margin-bottom:8px;">
        ${
          loc.type
            ? `<span style="border:1px solid #ccc; padding:2px 8px; border-radius:999px; font-size:12px;">
                ${esc(loc.type)}
              </span>`
            : ""
        }
        ${
          loc.label
            ? `<span style="border:1px solid #ccc; padding:2px 8px; border-radius:999px; font-size:12px;">
                ${esc(loc.label)}
              </span>`
            : ""
        }
        ${
          loc.length
            ? `<span style="border:1px solid #ccc; padding:2px 8px; border-radius:999px; font-size:12px;">
                ${esc(loc.length)} m
              </span>`
            : ""
        }
      </div>

      ${
        loc.first_ascent
          ? `<div style="font-size:12px; margin-bottom:6px;">
              <strong>First ascent:</strong> ${esc(loc.first_ascent)}
            </div>`
          : ""
      }

      ${
        loc.description
          ? `<div style="font-size:12px; line-height:1.3; margin-bottom:10px;">
              ${esc(loc.description)}
            </div>`
          : ""
      }

      <button
        type="button"
        class="wiki-open-btn"
        data-wiki-id="${esc(loc.id)}"
        style="
          width:100%;
          padding:8px 10px;
          border-radius:12px;
          border:1px solid rgba(0,0,0,.12);
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

function matchesSearch(loc, q) {
  if (!q) return true;
  const haystack = [
    loc.name,
    loc.city,
    loc.label,
    loc.type,
    loc.description,
    loc.first_ascent,
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();

  return haystack.includes(q);
}

const geo = useLocationStore();

function renderMarkers() {
  if (!map || !markerLayer) return;

  markerLayer.clearLayers();

  const q = mapSearch.value.trim().toLowerCase();
  const bounds = [];

  for (const loc of locations.value || []) {
    if (!matchesSearch(loc, q)) continue;

    // Guard against missing coordinates
    if (loc.lat == null || loc.lng == null) continue;

    const position = [loc.lat, loc.lng];
    bounds.push(position);

    const popupHtml = buildPopupHtml(loc);

    const marker = L.marker(position).addTo(markerLayer);
    
    marker.bindPopup(popupHtml, {
      autoPan: true,
      autoPanPaddingTopLeft: [0, 160], // leaves room for your top panel
      autoPanPaddingBottomRight: [20, 80]
    });


    marker.on("popupopen", (e) => {
      const el = e.popup.getElement();
      if (!el) return;

      const btn = el.querySelector(".wiki-open-btn");
      if (!btn) return;

      if (btn.dataset.bound === "1") return;
      btn.dataset.bound = "1";

      btn.addEventListener("click", (ev) => {
        ev.preventDefault();
        ev.stopPropagation();

        const id = btn.dataset.wikiId;
        if (!id) return;

        router.push({ name: "wiki-detail", params: { id } });
      });

      marker.on("popupopen", () => (isPopupOpen.value = true));
    });


  }
  const hasDevice = typeof geo.lat === "number" && typeof geo.lng === "number";

  if (!hasDevice && bounds.isValid()) {
    map.fitBounds(bounds, { padding: [30, 30] });
  }

}

onMounted(async () => {
  // 1) Create map
  map = L.map("map", {
    center: fallbackCenter,
    zoom: 8,
  });

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
    attribution: "&copy; OpenStreetMap contributors",
  }).addTo(map);

  // 2) Fix default marker icon (Leaflet + bundlers)
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

  // 3) Dedicated marker layer so we can re-render
  markerLayer = L.layerGroup().addTo(map);

  // 4) Load locations
  await reload();

  // 5) Render markers (initial)
  if ((locations.value || []).length > 0) {
    renderMarkers();
  } else {
    map.setView(fallbackCenter, 5);
  }

  geo.setToDeviceLocation();

  watch(
    () => [geo.lat, geo.lng],
    ([lat, lng]) => {
      if (typeof lat === "number" && typeof lng === "number") {
        map.setView(
          [lat, lng],
          Math.max(map.getZoom() - 1, 11),
          { animate: true }
  );
      }
    }
  );

});

// Re-render markers whenever search changes or locations reload
watch(mapSearch, () => renderMarkers());
watch(
  () => locations.value,
  () => renderMarkers(),
  { deep: true }
);

import { useRouter } from "vue-router";
const router = useRouter();
</script>

<template>
  <div class="map-page">
    <!-- MAP -->
    <div id="map"></div>

    <!-- UI OVERLAY -->
    <div class="overlay">
      <!-- TOP PANEL -->
      <div class="top-panel" :class="{ 'is-hidden': isPopupOpen }">
        <button class="exit-button" type="button" @click="router.push('/profile')">
          Exit
        </button>

        <div class="search-wrap">
          <SearchBar v-model="mapSearch" placeholder="Search boulders..." />
        </div>

        <div class="filter-row">
          <button class="filter-tag" type="button">🧗</button>
          <button class="filter-tag" type="button">5–10 km</button>
          <button class="filter-tag" type="button">Filters</button>
        </div>
      </div>

      <div v-if="loading" class="status">Loading locations…</div>
      <div v-if="errorMsg" class="status error">{{ errorMsg }}</div>

      <!-- VueUse status indicators -->
      <div class="status warn" v-if="!isOnline">
        You are offline – map data may be outdated.
      </div>
      <div class="status warn" v-else-if="visibility === 'hidden'">
        Tab is not active.
      </div>

      <footer class="bottom-nav">
        <button class="nav-btn" type="button">＋</button>
        <router-link to="/map" class="nav-btn active">🗺️</router-link>
        <button class="nav-btn" type="button">📘</button>
        <button class="nav-btn" type="button">👤</button>
      </footer>
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

/* overlay stays above map, but doesn’t block map clicks by default */
.overlay {
  position: absolute;
  inset: 0;
  z-index: 500;
  pointer-events: none;
}

.is-hidden {
  opacity: 0;
  pointer-events: none;
}

/* Panels/buttons are clickable */
.top-panel,
.status,
.bottom-nav {
  pointer-events: auto;
}

/* Top panel: nice “floating card” UI */
.top-panel {
  position: absolute;
  top: 14px;
  left: 12px;
  right: 12px;
  max-width: 520px;
  margin: 0 auto;
  padding: 10px;
  border-radius: 18px;
  background: rgba(255, 255, 255, 0.92);
  border: 1px solid rgba(0, 0, 0, 0.08);
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.08);
}

/* Exit button (small, clean) */
.exit-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 6px 10px;
  font-size: 13px;
  border: 1px solid rgba(0, 0, 0, 0.12);
  background: white;
  border-radius: 12px;
  margin-bottom: 10px;
}

/* wrapper around SearchBar so we don't depend on its internal class name */
.search-wrap {
  width: 100%;
}

/* Filter tags */
.filter-row {
  margin-top: 10px;
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.filter-tag {
  padding: 6px 10px;
  background: rgba(0, 0, 0, 0.04);
  border: 1px solid rgba(0, 0, 0, 0.10);
  border-radius: 999px;
  font-size: 13px;
}

/* Status messages */
.status {
  position: absolute;
  top: 140px;
  left: 12px;
  right: 12px;
  margin: 0 auto;
  max-width: 520px;
  background: rgba(255, 255, 255, 0.92);
  border: 1px solid rgba(0, 0, 0, 0.10);
  border-radius: 14px;
  padding: 8px 10px;
  font-size: 13px;
}

.status.error {
  border-color: rgba(255, 80, 80, 0.35);
  background: rgba(255, 230, 230, 0.95);
}

.status.warn {
  top: 190px;
}

/* Bottom nav */
.bottom-nav {
  position: absolute;
  bottom: 18px;
  left: 12px;
  right: 12px;
  max-width: 520px;
  margin: 0 auto;
  display: flex;
  justify-content: space-around;
  padding: 10px 12px;
  border-radius: 18px;
  background: rgba(255, 255, 255, 0.92);
  border: 1px solid rgba(0, 0, 0, 0.08);
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.08);
}

.nav-btn {
  font-size: 24px;
  background: none;
  border: none;
}

.active {
  font-weight: bold;
  transform: scale(1.08);
}
</style>
