import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import './global.css'
import 'vue-sonner/style.css'
import { router } from './router'
import PrimeVue from 'primevue/config';
import 'primeicons/primeicons.css';
import { createHead } from '@vueuse/head'

const app = createApp(App)
const pinia = createPinia()
const head = createHead()

app.use(head)
app.use(pinia)
app.use(router)
app.use(PrimeVue);

app.mount('#app');
