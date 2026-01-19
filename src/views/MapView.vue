<script setup>
// Fullscreen map view with UI overlay.
// Loads locations and displays them as markers.

import { onMounted} from "vue";
import L from "leaflet";
import SearchBar from "@/components/SearchBar.vue";

import "leaflet/dist/leaflet.css";
import iconUrl from "leaflet/dist/images/marker-icon.png";
import iconRetinaUrl from "leaflet/dist/images/marker-icon-2x.png";
import shadowUrl from "leaflet/dist/images/marker-shadow.png";

import { useOnline, useDocumentVisibility } from "@vueuse/core";
import { useLocations } from "@/composables/useLocations";

const fallbackCenter = [50.9619, 14.0732];

//Composer Toolbox quest
const { locations, loading, errorMsg, reload } = useLocations();

// VueUse: reactive online/offline state
const isOnline = useOnline();

// VueUse: track browser tab visibility
const visibility = useDocumentVisibility();

let map;

//expose
defineExpose({
  getMap: () => map,
});

onMounted(async () => {
  // 1) Create map (assign to outer variable, do NOT redeclare)
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

  // 3) Load locations via composable (shared across components)
  await reload();

  // 4) Add markers
  const bounds = [];

  for (const loc of locations.value) {
    const position = [loc.lat, loc.lng];
    bounds.push(position);

    const safe = (v) => (v ? String(v) : "");

    const popupHtml = `
      <div style="max-width:240px">
        <div style="font-weight:700; font-size:14px; margin-bottom:6px;">
          ${safe(loc.name)}
        </div>

        ${
          loc.image_url
            ? `<img src="${safe(loc.image_url)}" alt="${safe(
                loc.name
              )}" style="width:100%; border-radius:10px; margin-bottom:8px;" />`
            : ""
        }

        <div style="font-size:12px; opacity:.85; margin-bottom:6px;">
          ${safe(loc.city)}
        </div>

        <div style="display:flex; gap:6px; flex-wrap:wrap; margin-bottom:8px;">
          ${
            loc.type
              ? `<span style="border:1px solid #ccc; padding:2px 8px; border-radius:999px; font-size:12px;">${safe(
                  loc.type
                )}</span>`
              : ""
          }
          ${
            loc.label
              ? `<span style="border:1px solid #ccc; padding:2px 8px; border-radius:999px; font-size:12px;">${safe(
                  loc.label
                )}</span>`
              : ""
          }
          ${
            loc.length
              ? `<span style="border:1px solid #ccc; padding:2px 8px; border-radius:999px; font-size:12px;">${safe(
                  loc.length
                )} m</span>`
              : ""
          }
        </div>

        ${
          loc.first_ascent
            ? `<div style="font-size:12px; margin-bottom:6px;">
                <strong>First ascent:</strong> ${safe(loc.first_ascent)}
              </div>`
            : ""
        }

        ${
          loc.description
            ? `<div style="font-size:12px; line-height:1.3;">
                ${safe(loc.description)}
              </div>`
            : ""
        }
      </div>
    `;

    L.marker(position).addTo(map).bindPopup(popupHtml);
  }

  // 5) Fit map to markers (if we have any)
  if (bounds.length > 0) {
    map.fitBounds(bounds, { padding: [30, 30] });
  } else {
    map.setView(fallbackCenter, 8);
  }
});
</script>

<template>
  <div class="map-page">
    <!-- MAP -->
    <div id="map"></div>

    <!-- UI OVERLAY -->
    <div class="overlay">
      <!-- EXIT BUTTON -->
      <button class="exit-button">Exit</button>

      <!-- Komponenten Quest -->
      <SearchBar v-model="mapSearch" placeholder="Search..." />
      <!-- FILTER TAGS -->
      <div class="filter-row">
        <button class="filter-tag">🧗</button>
        <button class="filter-tag">5–10 km</button>
        <button class="filter-tag">Filters</button>
      </div>

      <div v-if="loading" class="status">Loading locations…</div>
      <div v-if="errorMsg" class="status error">{{ errorMsg }}</div>

      <footer class="bottom-nav">
        <button class="nav-btn">＋</button>
        <router-link to="/map" class="nav-btn active">🗺️</router-link>
        <button class="nav-btn">📘</button>
        <button class="nav-btn">👤</button>
      </footer>
      <!-- VueUse status indicators -->
        <div class="status" v-if="!isOnline">
          You are offline – map data may be outdated.
        </div>

        <div class="status" v-else-if="visibility === 'hidden'">
          Tab is not active.
        </div>
    </div>
  </div>
</template>

<style scoped>
/* PAGE LAYOUT */
.map-page {
  width: 100%;
  height: 100vh;
  position: relative;
}

/* MAP FULLSCREEN */
#map {
  width: 100%;
  height: 100%;
}

/* UI OVER MAP */
.overlay {
  position: absolute;
  inset: 0;
  z-index: 500;        /* <-- keeps UI always above the map */
  pointer-events: none; /* default: let map capture events */
}

/* Allow UI elements to be clicked */
.search-bar,
.filter-row,
.exit-button,
.bottom-nav {
  pointer-events: auto;
}

/* EXIT BUTTON */
.exit-button {
  position: absolute;
  top: 80px;
  left: 12px;
  padding: 6px 12px;
  font-size: 14px;
  border: 1px solid #333;
  background: white;
  border-radius: 6px;
}

/* SEARCH BAR */
.search-bar input {
  flex: 1;
  border: none;
  background: transparent;
  font-size: 14px;
  margin-left: 6px;
  outline: none;
}

/* FILTER TAGS */
.filter-row {
  margin-top: 8px;
  padding: 0 20px;
  display: flex;
  gap: 8px;
}

.filter-tag {
  padding: 4px 10px;
  background: #eee;
  border: 1px solid #bbb;
  border-radius: 6px;
  font-size: 13px;
}

.status {
  position: absolute;
  top: 140px;
  left: 12px;
  right: 12px;
  margin: 0 auto;
  max-width: 420px;
  background: rgba(255, 255, 255, 0.92);
  border: 1px solid #ddd;
  border-radius: 10px;
  padding: 8px 10px;
  font-size: 13px;
}

.status.error {
  border-color: #ffb3b3;
  background: rgba(255, 230, 230, 0.95);
}

.bottom-nav {
  position: absolute;
  bottom: 20px;
  width: 100%;
  display: flex;
  justify-content: space-around;
}

.nav-btn {
  font-size: 26px;
  background: none;
  border: none;
}

.active {
  font-weight: bold;
  transform: scale(1.2);
}
</style>
