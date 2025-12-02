<script setup>
import { onMounted } from 'vue'
import L from 'leaflet'

// Fix default icon paths so markers show correctly with Vite
import 'leaflet/dist/leaflet.css'
import iconUrl from 'leaflet/dist/images/marker-icon.png'
import iconRetinaUrl from 'leaflet/dist/images/marker-icon-2x.png'
import shadowUrl from 'leaflet/dist/images/marker-shadow.png'

//center
const center = [50.9619, 14.0732] 

onMounted(() => {
  const map = L.map('map', {
    center,
    zoom: 10
  })

  // Tile layer from OpenStreetMap
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; OpenStreetMap contributors'
  }).addTo(map)

  // Fix default marker icons
  const DefaultIcon = L.icon({
    iconUrl,
    iconRetinaUrl,
    shadowUrl,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  })
  L.Marker.prototype.options.icon = DefaultIcon

  // Example marker (can later loop over your boulderLocations)
  L.marker(center).addTo(map).bindPopup('Example location').openPopup()
})
</script>

<template>
  <div class="map-page">
    <header class="map-header">
      <h1>Map</h1>
    </header>

    <div id="map"></div>
  </div>
</template>

<style scoped>
.map-page {
  width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: column;
}

.map-header {
  padding: 8px 12px;
  background: #ffffff;
  border-bottom: 1px solid #ddd;
}

#map {
  flex: 1;
  width: 100%;
}
</style>
