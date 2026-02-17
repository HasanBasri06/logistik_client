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
        <div class="absolute inset-0 bg-black/50" @click="$emit('update:modelValue', false)" />
        <div
          class="map-modal-box relative bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] flex flex-col"
          @click.stop
        >
          <div class="flex items-center justify-between px-4 py-3 border-b border-gray-200">
            <h2 :id="titleId" class="text-lg font-semibold text-gray-900">
              {{ title }} — Haritadan konum seç
            </h2>
            <button
              type="button"
              class="p-2 rounded-lg text-gray-500 hover:bg-gray-100 hover:text-gray-700"
              aria-label="Kapat"
              @click="$emit('update:modelValue', false)"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div class="p-4 flex-1 overflow-auto flex flex-col gap-3">
            <div class="relative z-[10000]">
              <input
                v-model="mapSearchQuery"
                type="text"
                placeholder="Konum ara (örn: Ankara, İstanbul Kadıköy...)"
                class="w-full h-11 pl-10 pr-4 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm"
                @input="debouncedMapSearch"
                @blur="closeMapSearchResultsDelayed"
              />
              <svg class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <div
                v-if="mapSearchResults.length"
                class="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-[10001] max-h-48 overflow-y-auto"
              >
                <button
                  v-for="item in mapSearchResults"
                  :key="item.place_id"
                  type="button"
                  class="w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors text-sm border-b border-gray-100 last:border-0 flex items-start gap-2"
                  @click="goToSearchResult(item)"
                >
                  <MapPin class="w-4 h-4 text-primary shrink-0 mt-0.5" />
                  <span class="text-gray-700">{{ item.display_name }}</span>
                </button>
              </div>
              <div v-else-if="mapSearchLoading" class="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-[10001] px-4 py-3 text-sm text-gray-500">
                Aranıyor...
              </div>
            </div>
            <div ref="mapContainerRef" class="relative z-0 w-full h-[320px] rounded-lg overflow-hidden bg-gray-100 shrink-0" />
            <p class="text-sm text-gray-700 font-medium">
              Seçilen konum: <span class="text-primary">{{ selectedMapLocation?.name || 'Konum seçmek için haritaya tıklayın.' }}</span>
            </p>
            <div class="flex justify-end pt-2">
              <button
                type="button"
                :disabled="!selectedMapLocation"
                class="px-4 py-2 rounded-lg text-sm font-semibold text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed bg-primary hover:bg-primary/90 disabled:hover:bg-primary"
                @click="confirmMapLocation"
              >
                Onayla
              </button>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { ref, watch, nextTick } from 'vue';
import { MapPin } from 'lucide-vue-next';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const props = defineProps({
  modelValue: { type: Boolean, default: false },
  title: { type: String, default: 'Konum' }
});

const emit = defineEmits(['update:modelValue', 'confirm']);
const titleId = 'map-modal-title-' + Math.random().toString(36).slice(2);

const mapContainerRef = ref(null);
const selectedMapLocation = ref(null);
const mapSearchQuery = ref('');
const mapSearchResults = ref([]);
const mapSearchLoading = ref(false);
let mapSearchDebounceTimer = null;
let leafletMap = null;
let mapMarker = null;

const defaultIcon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = defaultIcon;

function initMap() {
  if (!mapContainerRef.value) return;
  const turkeyCenter = [39, 35];
  const turkeyBounds = [[36, 26], [42, 45]];
  leafletMap = L.map(mapContainerRef.value).setView(turkeyCenter, 6);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
  }).addTo(leafletMap);
  leafletMap.fitBounds(turkeyBounds);
  leafletMap.on('click', async (e) => {
    mapSearchResults.value = [];
    const { lat, lng } = e.latlng;
    if (mapMarker && leafletMap) leafletMap.removeLayer(mapMarker);
    mapMarker = L.marker([lat, lng]).addTo(leafletMap);
    selectedMapLocation.value = { lat, lng, name: `${lat.toFixed(4)}, ${lng.toFixed(4)}` };
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`,
        { headers: { 'Accept-Language': 'tr' } }
      );
      const data = await res.json();
      const name = data.display_name || data.address?.city || data.address?.town || data.address?.village || selectedMapLocation.value.name;
      selectedMapLocation.value = { lat, lng, name };
    } catch (_) {}
  });
  nextTick(() => leafletMap?.invalidateSize());
}

async function searchMapLocations() {
  const q = mapSearchQuery.value?.trim();
  if (!q || q.length < 2) {
    mapSearchResults.value = [];
    return;
  }
  mapSearchLoading.value = true;
  mapSearchResults.value = [];
  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(q)}&format=json&limit=5&countrycodes=tr`,
      { headers: { 'Accept-Language': 'tr' } }
    );
    const data = await res.json();
    mapSearchResults.value = data;
  } catch (_) {
    mapSearchResults.value = [];
  } finally {
    mapSearchLoading.value = false;
  }
}

function debouncedMapSearch() {
  clearTimeout(mapSearchDebounceTimer);
  mapSearchDebounceTimer = setTimeout(searchMapLocations, 300);
}

function closeMapSearchResultsDelayed() {
  setTimeout(() => { mapSearchResults.value = []; }, 200);
}

function goToSearchResult(item) {
  const lat = parseFloat(item.lat);
  const lng = parseFloat(item.lon);
  const name = item.display_name || `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
  selectedMapLocation.value = { lat, lng, name };
  mapSearchResults.value = [];
  mapSearchQuery.value = name;
  if (mapMarker && leafletMap) leafletMap.removeLayer(mapMarker);
  if (leafletMap) {
    mapMarker = L.marker([lat, lng]).addTo(leafletMap);
    leafletMap.flyTo([lat, lng], 15, { duration: 0.5 });
  }
}

function destroyMap() {
  if (mapMarker && leafletMap) {
    leafletMap.removeLayer(mapMarker);
    mapMarker = null;
  }
  if (leafletMap) {
    leafletMap.remove();
    leafletMap = null;
  }
}

function confirmMapLocation() {
  if (!selectedMapLocation.value) return;
  emit('confirm', selectedMapLocation.value);
  emit('update:modelValue', false);
}

watch(() => props.modelValue, (open) => {
  if (open) {
    selectedMapLocation.value = null;
    mapSearchQuery.value = '';
    mapSearchResults.value = [];
    nextTick(() => {
      initMap();
      setTimeout(() => leafletMap?.invalidateSize(), 150);
    });
  } else {
    destroyMap();
  }
});
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
