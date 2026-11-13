<template>
  <Teleport to="body">
    <Transition name="modal">
      <div
        v-show="modelValue"
        class="fixed inset-0 z-[9999] flex items-center justify-center p-4"
        role="dialog"
        aria-modal="true"
        :aria-labelledby="titleId"
      >
        <div class="absolute inset-0 bg-black/50" @click="close" />
        <div
          class="map-modal-box relative bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[92vh] flex flex-col"
          @click.stop
        >
          <div class="flex items-center justify-between px-4 py-3 border-b border-gray-200">
            <h2 :id="titleId" class="text-lg font-semibold text-gray-900">
              {{ title }} — Haritadan seç
            </h2>
            <button
              type="button"
              class="p-2 rounded-lg text-gray-500 hover:bg-gray-100 hover:text-gray-700"
              aria-label="Kapat"
              @click="close"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div class="p-4 flex-1 overflow-auto flex flex-col gap-3">
            <!-- Arama (sadece Türkiye) -->
            <div class="relative z-[10000]">
              <input
                v-model="searchQuery"
                type="text"
                placeholder="Konum ara (örn: Ankara Çankaya, Kadıköy...)"
                class="w-full h-11 pl-10 pr-4 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm"
                @input="debouncedSearch"
                @blur="closeSearchResultsDelayed"
              />
              <svg class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <div
                v-if="searchResults.length"
                class="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-[10001] max-h-48 overflow-y-auto"
              >
                <button
                  v-for="item in searchResults"
                  :key="item.place_id"
                  type="button"
                  class="w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors text-sm border-b border-gray-100 last:border-0 flex items-start gap-2"
                  @mousedown.prevent
                  @click="goToSearchResult(item)"
                >
                  <MapPin class="w-4 h-4 text-primary shrink-0 mt-0.5" />
                  <span class="text-gray-700">{{ item.display_name }}</span>
                </button>
              </div>
              <div
                v-else-if="searchLoading"
                class="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-[10001] px-4 py-3 text-sm text-gray-500"
              >
                Aranıyor...
              </div>
            </div>

            <!-- Harita -->
            <div class="relative shrink-0">
              <div ref="mapContainerRef" class="relative z-0 w-full h-[340px] rounded-lg overflow-hidden bg-gray-100" />
              <button
                type="button"
                class="absolute top-3 right-3 z-[500] h-9 px-3 rounded-lg bg-white shadow-md border border-gray-200 text-sm font-medium text-gray-700 hover:bg-gray-50 flex items-center gap-1.5 disabled:opacity-60"
                :disabled="locating"
                @click="goToCurrentLocation(true)"
              >
                <LocateFixed class="w-4 h-4 text-primary" />
                {{ locating ? 'Konum alınıyor...' : 'Konumum' }}
              </button>
            </div>
            <p class="text-xs text-gray-500 -mt-1">
              Haritaya tıklayın veya işaretçiyi sürükleyin. Sadece Türkiye içinden seçim yapılabilir.
            </p>

            <!-- Seçim durumu -->
            <div class="min-h-[52px] rounded-lg border px-3 py-2 text-sm flex items-center gap-2"
                 :class="statusBoxClass">
              <template v-if="status === 'resolving'">
                <span class="w-4 h-4 border-2 border-gray-300 border-t-primary rounded-full animate-spin shrink-0" />
                <span class="text-gray-600">Konum bilgisi alınıyor...</span>
              </template>
              <template v-else-if="status === 'error'">
                <i class="pi pi-exclamation-triangle shrink-0" />
                <span>{{ errorMessage }}</span>
              </template>
              <template v-else-if="status === 'ready' && selected">
                <MapPin class="w-4 h-4 text-primary shrink-0" />
                <div class="min-w-0">
                  <div class="font-semibold text-gray-900">{{ selected.district }}, {{ selected.city }}</div>
                  <div v-if="selected.exactLocation?.display_name" class="text-xs text-gray-600 line-clamp-2">
                    {{ selected.exactLocation.display_name }}
                  </div>
                  <div v-if="selected.note" class="text-xs text-gray-500">{{ selected.note }}</div>
                </div>
              </template>
              <template v-else>
                <span class="text-gray-500">Konum seçmek için haritaya tıklayın.</span>
              </template>
            </div>

            <div class="flex justify-end gap-2 pt-1">
              <button
                type="button"
                class="px-4 py-2 rounded-lg text-sm font-medium text-gray-700 border border-gray-200 hover:bg-gray-50"
                @click="close"
              >
                Vazgeç
              </button>
              <button
                type="button"
                :disabled="status !== 'ready' || !selected"
                class="px-6 py-2 rounded-lg text-sm font-semibold text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed bg-primary hover:bg-primary/90 disabled:hover:bg-primary"
                @click="confirmSelection"
              >
                Seç
              </button>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { ref, computed, watch, nextTick, onBeforeUnmount } from 'vue';
import { MapPin, LocateFixed } from 'lucide-vue-next';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { TURKEY_BOUNDS, parseNominatimTurkey, buildExactLocation } from '@/lib/locations';

const props = defineProps({
  modelValue: { type: Boolean, default: false },
  title: { type: String, default: 'Konum' },
  /** Daha önce seçilmiş nokta: { lat, lng } — varsa harita buradan açılır */
  initial: { type: Object, default: null },
  /**
   * Haritadaki noktayı sistemdeki il/ilçeye çevirir.
   * (geo: { plate, province, districtCandidates }) => Promise<{ city, district, note? } | { error }>
   */
  resolveLocation: { type: Function, required: true },
});

const emit = defineEmits(['update:modelValue', 'confirm']);
const titleId = 'map-modal-title-' + Math.random().toString(36).slice(2);

const mapContainerRef = ref(null);
const selected = ref(null); // { lat, lng, city, district, note, exactLocation }
const status = ref('idle'); // idle | resolving | ready | error
const errorMessage = ref('');
const locating = ref(false);
const searchQuery = ref('');
const searchResults = ref([]);
const searchLoading = ref(false);

let searchDebounceTimer = null;
let leafletMap = null;
let marker = null;
let resolveSeq = 0;

const statusBoxClass = computed(() => {
  if (status.value === 'error') return 'border-red-200 bg-red-50 text-red-700';
  if (status.value === 'ready') return 'border-primary/30 bg-primary/5';
  return 'border-gray-200 bg-gray-50';
});

L.Marker.prototype.options.icon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

const turkeyLatLngBounds = L.latLngBounds(TURKEY_BOUNDS);
/** Kaydırma sınırı: Türkiye + küçük pay */
const panBounds = turkeyLatLngBounds.pad(0.08);

function isInsideTurkeyBox(lat, lng) {
  return turkeyLatLngBounds.contains([lat, lng]);
}

function initMap() {
  if (!mapContainerRef.value || leafletMap) return;
  leafletMap = L.map(mapContainerRef.value, {
    maxBounds: panBounds,
    maxBoundsViscosity: 1.0,
  });
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    maxZoom: 19,
  }).addTo(leafletMap);
  leafletMap.fitBounds(turkeyLatLngBounds);
  leafletMap.on('click', (e) => selectPoint(e.latlng.lat, e.latlng.lng));
}

/** Modal animasyonu bitip harita gerçek boyutunu aldıktan sonra çağrılır */
function finalizeMapSize() {
  if (!leafletMap) return;
  leafletMap.invalidateSize();
  leafletMap.setMinZoom(Math.max(4, leafletMap.getBoundsZoom(panBounds)));
}

function placeMarker(lat, lng) {
  if (!leafletMap) return;
  if (marker) {
    marker.setLatLng([lat, lng]);
    return;
  }
  marker = L.marker([lat, lng], { draggable: true }).addTo(leafletMap);
  marker.on('dragend', () => {
    const p = marker.getLatLng();
    selectPoint(p.lat, p.lng);
  });
}

async function selectPoint(lat, lng) {
  searchResults.value = [];
  const seq = ++resolveSeq;
  selected.value = null;

  if (!isInsideTurkeyBox(lat, lng)) {
    status.value = 'error';
    errorMessage.value = 'Sadece Türkiye sınırları içinden seçim yapabilirsiniz.';
    return;
  }

  placeMarker(lat, lng);
  status.value = 'resolving';
  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json&addressdetails=1&zoom=18`,
      { headers: { 'Accept-Language': 'tr' } }
    );
    const data = await res.json();
    const geo = parseNominatimTurkey(data);
    if (seq !== resolveSeq) return; // daha yeni bir seçim yapıldı

    if (!geo.inTurkey) {
      status.value = 'error';
      errorMessage.value = 'Sadece Türkiye sınırları içinden seçim yapabilirsiniz.';
      return;
    }
    const result = await props.resolveLocation(geo);
    if (seq !== resolveSeq) return;

    if (!result || result.error) {
      status.value = 'error';
      errorMessage.value = result?.error || 'Bu nokta için il/ilçe belirlenemedi.';
      return;
    }
    selected.value = {
      lat,
      lng,
      city: result.city,
      district: result.district,
      note: result.note || null,
      exactLocation: buildExactLocation(data, lat, lng),
    };
    status.value = 'ready';
  } catch (_) {
    if (seq !== resolveSeq) return;
    status.value = 'error';
    errorMessage.value = 'Konum bilgisi alınamadı. Lütfen tekrar deneyin.';
  }
}

/** Mevcut konuma git ve onu seç. `explicit`: kullanıcı butona bastıysa hata mesajı göster */
function goToCurrentLocation(explicit = false) {
  if (!navigator.geolocation) {
    if (explicit) {
      status.value = 'error';
      errorMessage.value = 'Tarayıcınız konum özelliğini desteklemiyor.';
    }
    return;
  }
  locating.value = true;
  navigator.geolocation.getCurrentPosition(
    (pos) => {
      locating.value = false;
      if (!leafletMap) return;
      const { latitude: lat, longitude: lng } = pos.coords;
      if (!isInsideTurkeyBox(lat, lng)) {
        if (explicit) {
          status.value = 'error';
          errorMessage.value = 'Mevcut konumunuz Türkiye dışında görünüyor. Haritadan bir nokta seçin.';
        }
        return;
      }
      leafletMap.setView([lat, lng], 13);
      selectPoint(lat, lng);
    },
    () => {
      locating.value = false;
      if (explicit) {
        status.value = 'error';
        errorMessage.value = 'Konum izni verilmedi. Haritadan bir nokta seçebilirsiniz.';
      }
    },
    { enableHighAccuracy: true, timeout: 15000, maximumAge: 60000 }
  );
}

async function searchLocations() {
  const q = searchQuery.value?.trim();
  if (!q || q.length < 2) {
    searchResults.value = [];
    return;
  }
  searchLoading.value = true;
  searchResults.value = [];
  try {
    const [[s, w], [n, e]] = TURKEY_BOUNDS;
    const res = await fetch(
      `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(q)}&format=json&limit=5&countrycodes=tr&viewbox=${w},${n},${e},${s}&bounded=1`,
      { headers: { 'Accept-Language': 'tr' } }
    );
    const data = await res.json();
    searchResults.value = Array.isArray(data) ? data : [];
  } catch (_) {
    searchResults.value = [];
  } finally {
    searchLoading.value = false;
  }
}

function debouncedSearch() {
  clearTimeout(searchDebounceTimer);
  searchDebounceTimer = setTimeout(searchLocations, 500);
}

function closeSearchResultsDelayed() {
  setTimeout(() => { searchResults.value = []; }, 200);
}

function goToSearchResult(item) {
  const lat = parseFloat(item.lat);
  const lng = parseFloat(item.lon);
  searchResults.value = [];
  searchQuery.value = item.display_name || '';
  leafletMap?.flyTo([lat, lng], 14, { duration: 0.5 });
  selectPoint(lat, lng);
}

function destroyMap() {
  resolveSeq++;
  marker = null;
  if (leafletMap) {
    leafletMap.remove();
    leafletMap = null;
  }
}

function close() {
  emit('update:modelValue', false);
}

function confirmSelection() {
  if (status.value !== 'ready' || !selected.value) return;
  emit('confirm', { ...selected.value });
  close();
}

watch(() => props.modelValue, (open) => {
  if (!open) {
    destroyMap();
    return;
  }
  selected.value = null;
  status.value = 'idle';
  errorMessage.value = '';
  searchQuery.value = '';
  searchResults.value = [];
  nextTick(() => {
    initMap();
    setTimeout(() => {
      if (!leafletMap) return;
      finalizeMapSize();
      const init = props.initial;
      if (init?.lat != null && init?.lng != null) {
        leafletMap.setView([init.lat, init.lng], 13);
        selectPoint(init.lat, init.lng);
      } else {
        // Varsayılan: kullanıcının şu anki konumu
        goToCurrentLocation(false);
      }
    }, 220);
  });
});

onBeforeUnmount(destroyMap);
</script>

<style scoped>
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.2s ease;
}
.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}
.modal-enter-active .map-modal-box,
.modal-leave-active .map-modal-box {
  transition: transform 0.2s ease;
}
.modal-enter-from .map-modal-box,
.modal-leave-to .map-modal-box {
  transform: scale(0.95);
}
</style>
