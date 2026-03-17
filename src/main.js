import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import './global.css'
import 'vue-sonner/style.css'
import { router } from './router'
import PrimeVue from 'primevue/config';
import 'primeicons/primeicons.css';
import { createHead } from '@vueuse/head'
import Vue3Tour from 'vue3-tour'
import 'vue3-tour/dist/vue3-tour.css'

const app = createApp(App)
const pinia = createPinia()
const head = createHead()

app.use(head)
app.use(pinia)
app.use(router)
app.use(Vue3Tour)
app.use(PrimeVue, {
  locale: {
    firstDayOfWeek: 1,
    dayNames: ['Pazar', 'Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi'],
    dayNamesShort: ['Paz', 'Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt'],
    dayNamesMin: ['Pz', 'Pt', 'Sa', 'Ça', 'Pe', 'Cu', 'Ct'],
    monthNames: ['Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran', 'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'],
    monthNamesShort: ['Oca', 'Şub', 'Mar', 'Nis', 'May', 'Haz', 'Tem', 'Ağu', 'Eyl', 'Eki', 'Kas', 'Ara'],
    today: 'Bugün',
    clear: 'Temizle',
    chooseDate: 'Tarih seçin',
    chooseYear: 'Yıl seçin',
    chooseMonth: 'Ay seçin',
    prevDecade: 'Önceki on yıl',
    nextDecade: 'Sonraki on yıl',
    prevYear: 'Önceki yıl',
    nextYear: 'Sonraki yıl',
    prevMonth: 'Önceki ay',
    nextMonth: 'Sonraki ay',
    am: 'ÖÖ',
    pm: 'ÖS',
    dateFormat: 'dd.mm.yy',
  },
});

app.mount('#app');
