import './assets/main.css'
import '@/assets/styles/style.scss'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { createPinia } from 'pinia'
import PrimeVue from 'primevue/config'
import Aura from '@primeuix/themes/aura'

const app = createApp(App)
const pinia = createPinia()

app.use(router)
app.use(pinia)
app.use(PrimeVue, {
  theme: {
    preset: Aura,
    options: {
      colorScheme: 'light',
    },
  },
})

app.mount('#app')
