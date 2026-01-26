import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useLocationStore = defineStore('location', () => {
  const lat = ref(null);
  const lng = ref(null);

  function setToDeviceLocation() {
    if (!navigator.geolocation) return;

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        lat.value = pos.coords.latitude;
        lng.value = pos.coords.longitude;
      },
      (err) => console.warn("geolocation error:", err),
      {
        enableHighAccuracy: false,
        maximumAge: 60_000,
        timeout: 5_000,
      }
    );
  }

  return { lat, lng, setToDeviceLocation };
});