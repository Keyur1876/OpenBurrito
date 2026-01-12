<script setup>
import { onMounted, ref, computed, watch } from 'vue'
import L from 'leaflet'
import { supabase } from '@/lib/supabase'

import 'leaflet/dist/leaflet.css'
import iconUrl from 'leaflet/dist/images/marker-icon.png'
import iconRetinaUrl from 'leaflet/dist/images/marker-icon-2x.png'
import shadowUrl from 'leaflet/dist/images/marker-shadow.png'

import { useLocationStore } from '@/stores/location'

const geo = useLocationStore()

// DB LOCATIONS
const locations = ref([])

// SEARCH STATE
const query = ref('')
const showDropdown = ref(false)

// SEARCH FILTER (case-insensitive)
const filteredLocations = computed(() => {
  const q = query.value.trim().toLowerCase()
  if (!q) return []
  return locations.value.filter((l) =>
    l.name?.toLowerCase().includes(q)
  )
})

// LEAFLET
let map
const markersById = new Map()

function selectLocation(loc) {
  query.value = loc.name
  showDropdown.value = false

  const marker = markersById.get(loc.id)
  if (!marker) return

  map.setView([loc.lat, loc.lng], Math.max(map.getZoom(), 14), {
    animate: true,
  })
  marker.openPopup()
}

function clearSearch() {
  query.value = ''
  showDropdown.value = false
}

onMounted(async () => {
  // watch geo location once
  watch(
    () => [geo.lat, geo.lng],
    ([lat, lng]) => map.setView([lat, lng]),
    { once: true },
  )

  geo.setToDeviceLocation()

  // create map
  map = L.map('map', {
    center: [geo.lat, geo.lng],
    zoom: 12,
    zoomControl: false,
  })

  L.control.zoom({ position: 'bottomleft' }).addTo(map)

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; OpenStreetMap contributors',
  }).addTo(map)

  // marker icon fix
  const DefaultIcon = L.icon({
    iconUrl,
    iconRetinaUrl,
    shadowUrl,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
  })
  L.Marker.prototype.options.icon = DefaultIcon

  // fetch locations from Supabase
  const { data, error } = await supabase
    .from('locations')
    .select('id, name, city, lat, lng, description')
    .order('name')

  if (error) {
    console.error(error)
    return
  }

  locations.value = (data ?? []).filter(
    (l) => typeof l.lat === 'number' && typeof l.lng === 'number'
  )

  const bounds = L.latLngBounds([])

  locations.value.forEach((l) => {
    const marker = L.marker([l.lat, l.lng]).addTo(map)

    marker.bindPopup(`
      <div style="min-width:180px">
        <strong>${l.name}</strong><br/>
        <small>${l.city ?? ''}</small><br/>
        <div style="margin-top:6px">${l.description ?? ''}</div>
      </div>
    `)

    markersById.set(l.id, marker)
    bounds.extend([l.lat, l.lng])
  })

  if (bounds.isValid()) {
    map.fitBounds(bounds, { padding: [30, 30] })
  }

  map.on('click', () => {
    showDropdown.value = false
  })
})
</script>

<template>
  <div class="map-page">
    <div id="map"></div>

    <div class="overlay">
      <div class="search-wrap">
        <div class="search-bar">
          <span class="search-icon">🔍</span>

          <input
            v-model="query"
            type="text"
            placeholder="Search boulders..."
            @focus="showDropdown = true"
            @input="showDropdown = true"
            @keydown.esc="clearSearch"
          />

          <button v-if="query" class="clear-btn" @click="clearSearch">✕</button>
        </div>

        <!-- DROPDOWN-->
        <div v-if="showDropdown && filteredLocations.length" class="dropdown">
          <button
            v-for="b in filteredLocations"
            :key="b.id"
            class="dropdown-item"
            @click="selectLocation(b)"
          >
            <div class="name">{{ b.name }}</div>
            <div class="city">{{ b.city }}</div>
          </button>
        </div>

        <!-- no results" -->
        <div
          v-else-if="showDropdown && query.trim() && filteredLocations.length === 0"
          class="dropdown empty"
        >
          No results
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

.search-bar {
  width: 100%;
  padding: 8px 12px;
  background: #ddd;
  border-radius: 10px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.search-bar input {
  flex: 1;
  border: none;
  background: transparent;
  font-size: 14px;
  outline: none;
}

.clear-btn {
  border: none;
  background: white;
  border-radius: 8px;
  width: 28px;
  height: 28px;
  cursor: pointer;
}

/* DROPDOWN */
.dropdown {
  margin-top: 8px;
  background: white;
  border-radius: 12px;
  border: 1px solid #ccc;
  overflow: hidden;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
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
  background: #f3f3f3;
}

.name {
  font-weight: 600;
  font-size: 14px;
}

.city {
  font-size: 12px;
  opacity: 0.7;
}

.dropdown.empty {
  padding: 10px 12px;
  color: #444;
}
</style>
