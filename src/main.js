import '@/assets/main.css'

import App from '@/App.vue'
import { createApp } from 'vue'
import router from '@/router'
import { createPinia } from 'pinia'
import PrimeVue from 'primevue/config'
import { ToastService } from 'primevue'
import Aura from '@primeuix/themes/aura'

const app = createApp(App)

const plugins = [createPinia(), router, ToastService]

app.use(PrimeVue, {
  theme: {
    preset: Aura,
    options: {
      darkModeSelector: false,
    },
  },
})
plugins.forEach((i) => app.use(i))

app.mount('#app')
