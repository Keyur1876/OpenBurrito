import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useLocationStore = defineStore('location', () => {
  const lat = ref(52.22)
  const lng = ref(4.53)

  function update() {
    if (!navigator.geolocation) {
      console.warn('geolocation not supported')
      return
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        lat.value = position.coords.latitude
        lng.value = position.coords.longitude
      },
      (error) => {
        console.warn('geolocation denied or failed:', error)
      },
      { enableHighAccuracy: false, timeout: 8000 },
    )
  }

  return { lat, lng, update }
})
