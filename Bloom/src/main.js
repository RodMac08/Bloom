import { createApp } from 'vue'
import './style.css' // Asegúrate que tu CSS principal esté importado
import router from '@/plugins/router'
import App from './App.vue'
import { createPinia } from 'pinia'

// 1. Crea la instancia de la aplicación UNA SOLA VEZ
const app = createApp(App)

// 2. Crea la instancia de Pinia
const pinia = createPinia()

// 3. Usa los plugins EN LA INSTANCIA 'app'
app.use(router) // Usa el router
app.use(pinia) // Usa Pinia

// 4. Monta la aplicación DESPUÉS de usar los plugins
app.mount('#app')