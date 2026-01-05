import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useLocationStore = defineStore('location', () => {
  const lat = ref(51.0300)
  const lng = ref(13.4424)

  function setCurrentLocation() {
    if (!navigator.geolocation) {
      console.warn('geolocation not supported')
      return
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        console.log('it works')
        this.lat = position.coords.latitude
        this.lng = position.coords.longitude
      },
      (error) => console.warn('geolocation denied or failded:', error),
      { enableHighAccurarcy: false, timeout: 10000 },
    )
  }

  return { lat, lng, setCurrentLocation }
})
