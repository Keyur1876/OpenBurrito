<script setup>
import { onMounted } from "vue";
import L from "leaflet";

import "leaflet/dist/leaflet.css";
import iconUrl from "leaflet/dist/images/marker-icon.png";
import iconRetinaUrl from "leaflet/dist/images/marker-icon-2x.png";
import shadowUrl from "leaflet/dist/images/marker-shadow.png";

const center = [50.9619, 14.0732];

onMounted(() => {
  const map = L.map("map", {
    center,
    zoom: 10,
  });

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
    attribution: "&copy; OpenStreetMap contributors",
  }).addTo(map);

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

  L.marker(center).addTo(map).bindPopup("Example location");
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

      <!-- SEARCH BAR -->
      <div class="search-bar">
        <span class="search-icon">🔍</span>
        <input type="text" placeholder="Search" />
      </div>

      <!-- FILTER TAGS -->
      <div class="filter-row">
        <button class="filter-tag">🧗</button>
        <button class="filter-tag">5–10 km</button>
        <button class="filter-tag">Filters</button>
      </div>

      <!-- BOTTOM NAV -->
      <footer class="bottom-nav">
        <button class="nav-btn">＋</button>

        <router-link to="/map" class="nav-btn active">🗺️</router-link>

        <button class="nav-btn">📘</button>
        <button class="nav-btn">👤</button>
      </footer>
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
.search-bar {
  margin-top: 40px;
  width: calc(100% - 40px);
  margin-left: auto;
  margin-right: auto;
  padding: 8px 12px;
  background: #ddd;
  border-radius: 8px;
  display: flex;
  align-items: center;
}

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

/* BOTTOM NAV */
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
