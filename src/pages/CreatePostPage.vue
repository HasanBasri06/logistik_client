<template>
  <Header />

  <div class="h-[calc(100vh-64px)]">
    <Content>
      <div class="flex flex-row gap-3 w-full h-[calc(100vh-64px)]">
        <CargoOwner />

        <div
          class="flex-1 mt-3 rounded-md flex flex-col overflow-y-scroll no_scrool pb-4 gap-4"
        >
          <!-- 1. Ekran: Araç Seçimi -->
          <VehicleSelection v-if="page === 1" ref="vehicleSelectionRef" />

          <!-- 2. Ekran: İki Input -->
          <div v-else-if="page === 2" class="w-full bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden p-6">
            <h3 class="text-lg font-semibold text-gray-800 mb-4">İlan Detayları</h3>
            <div class="flex flex-col gap-4 w-full">
              <div class="flex items-center gap-2 w-full">
                <div class="w-full">
                  <label class="block text-sm font-medium text-gray-700 mb-2 pl-6">Yüklenecek Yer</label>
                  <div class="flex items-center gap-2 w-full">
                    <div class="w-4 h-4 rounded-full bg-amber-200 inline-block"></div>
                    <input
                      v-model="yuklenecekYer"
                      type="text"
                      readonly
                      placeholder="Seçiniz"
                      class="w-full h-12 px-4 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary cursor-pointer"
                      @click="openMapModal('yuklenecek')"
                    />

                  </div>
                </div>
              </div>
              <div class="flex items-center gap-2 w-full">
                <div class="w-full">
                  <label class="block text-sm font-medium text-gray-700 mb-2 pl-6">Boşaltılan Yer</label>
                  <div class="flex items-center gap-2 w-full">
                    <div class="w-4 h-4 rounded-full bg-green-200 inline-block"></div>
                    <input
                      v-model="bosaltilanYer"
                      type="text"
                      readonly
                      placeholder="Seçiniz"
                      class="w-full h-12 px-4 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary cursor-pointer"
                      @click="openMapModal('bosaltilan')"
                    />

                  </div>
                </div>
              </div>

              <!-- Mesafe ve süre (her iki yer seçildiğinde) -->
              <div
                v-if="routeInfo"
                class="mt-4 pt-4 border-t border-gray-100 flex gap-6 text-sm"
              >
                <div class="flex flex-col gap-4">
                  <div class="flex items-center gap-2">
                    <span class="text-gray-500">Mesafe:</span>
                    <span class="font-semibold text-gray-800">{{ routeInfo.distance }}</span>
                  </div>
                  <div class="flex items-center gap-2">
                    <span class="text-gray-500">Tahmini süre:</span>
                    <span class="font-semibold text-gray-800">{{ routeInfo.duration }}</span>
                  </div>

                  <div class="flex items-start gap-2 mt-5 flex-col w-full">
                    <h2 class="text-base font-semibold text-gray-800 mb-2">Fiyatlar</h2>
                    <div class="flex flex-wrap gap-3 w-full max-w-[780px]">
                      <button
                        type="button"
                        @click="selectedPriceType = 'sabit'"
                        class="flex-1 min-w-[312px] text-left border-2 rounded-lg p-4 transition-all duration-200 hover:border-primary/60 hover:bg-primary/5"
                        :class="selectedPriceType === 'sabit'
                          ? 'border-primary bg-primary/10 ring-2 ring-primary/30'
                          : 'border-gray-200 bg-white'"
                      >
                        <div class="flex justify-between items-start">
                          <div class="flex flex-col gap-0.5">
                            <span class="text-base font-semibold text-gray-800">Sabit Fiyat</span>
                            <span class="text-sm text-gray-500">Düşünmeden fiyat ver</span>
                          </div>
                          <div class="flex flex-col items-end gap-0.5">
                            <span class="text-lg font-bold text-primary">22.000 ₺</span>
                            <span class="text-sm text-gray-400 line-through">24.000 ₺</span>
                          </div>
                        </div>
                        <div v-if="selectedPriceType === 'sabit'" class="mt-3 flex items-center gap-1.5 text-primary text-sm font-medium">
                          <i class="pi pi-check-circle text-base"></i>
                          Seçildi
                        </div>
                      </button>
                      <button
                        type="button"
                        @click="selectedPriceType = 'teklif'"
                        class="flex-1 min-w-[312px] text-left border-2 rounded-lg p-4 transition-all duration-200 hover:ring-2 hover:ring-primary/30 hover:border-primary/60 hover:bg-primary/5"
                        :class="selectedPriceType === 'teklif'
                          ? 'border-primary bg-primary/10 ring-2 ring-primary/30'
                          : 'border-gray-200 bg-white'"
                      >
                        <div class="flex justify-between items-start">
                          <div class="flex flex-col gap-0.5">
                            <span class="text-base font-semibold text-gray-800">Sürücü ile görüş</span>
                            <span class="text-sm text-gray-500">Taşıyıcılardan teklif bekle</span>
                          </div>
                        </div>
                        <div v-if="selectedPriceType === 'teklif'" class="mt-3 flex items-center gap-1.5 text-primary text-sm font-medium">
                          <i class="pi pi-check-circle text-base"></i>
                          Seçildi
                        </div>
                      </button>
                    </div>
                  </div>

                </div>
              </div>
              <p v-else-if="routeLoading" class="mt-4 pt-4 border-t border-gray-100 text-sm text-gray-500">
                Rota hesaplanıyor...
              </p>
            </div>
          </div>

          <!-- 3. Ekran -->
          <div v-else-if="page === 3" class="w-full bg-white border border-gray-200 rounded-xl shadow-sm p-6">
            <h3 class="text-lg font-semibold text-gray-800">3. Ekran</h3>
          </div>

          <!-- Pagination: Sol Sonraki / Sağ Önceki -->
          <div
            class="w-full  overflow-hidden flex justify-between items-center"
          >
            <button
              type="button"
              @click="() => usePostStore().prevPage()"
              class="px-5 py-2 rounded-lg border-2 cursor-pointer border-primary text-primary font-medium hover:bg-primary hover:text-white transition-all"
            >
              ← Önceki
            </button>
            <button
              @click="() => usePostStore().nextPage()"
              type="button"
              :disabled="!canGoNext"
              class="px-5 py-2 rounded-lg border-2 transition-all"
              :class="canGoNext
                ? 'cursor-pointer border-primary text-primary font-medium hover:bg-primary hover:text-white'
                : 'cursor-not-allowed border-gray-200 text-gray-400 opacity-60'"
            >
              {{ page === limit ? 'Yayınla' : 'Sonraki →' }}
            </button>
          </div>
         
        </div>
      </div>
    </Content>

    <!-- Harita Konum Modal -->
    <MapLocationModal
      v-model="mapModalOpen"
      :title="mapModalFor === 'yuklenecek' ? 'Yüklenecek Yer' : 'Boşaltılan Yer'"
      @confirm="onMapLocationConfirm"
    />
  </div>
</template>

<script setup>
import { ref, computed, watch } from "vue";
import Header from "@/components/Header.vue";
import Content from "@/components/Content.vue";
import CargoOwner from "@/components/CargoOwner.vue";
import VehicleSelection from "@/components/VehicleSelection.vue";
import MapLocationModal from "@/components/MapLocationModal.vue";
import { usePostStore } from "@/stores/post";
import { storeToRefs } from "pinia";

const postStore = usePostStore();
const { page, limit } = storeToRefs(postStore);
const vehicleSelectionRef = ref(null);
const yuklenecekYer = ref('');
const bosaltilanYer = ref('');
const yuklenecekLocation = ref(null); // { lat, lng, name }
const bosaltilanLocation = ref(null);
const routeInfo = ref(null); // { distance: '123 km', duration: '2 saat 15 dk' }
const routeLoading = ref(false);
const mapModalOpen = ref(false);
const mapModalFor = ref('yuklenecek'); // 'yuklenecek' | 'bosaltilan'
const selectedPriceType = ref('sabit'); // 'sabit' | başka seçenekler eklenebilir

const openMapModal = (forField) => {
  mapModalFor.value = forField;
  mapModalOpen.value = true;
};

const onMapLocationConfirm = (location) => {
  if (mapModalFor.value === 'yuklenecek') {
    yuklenecekYer.value = location.name;
    yuklenecekLocation.value = { lat: location.lat, lng: location.lng, name: location.name };
  } else {
    bosaltilanYer.value = location.name;
    bosaltilanLocation.value = { lat: location.lat, lng: location.lng, name: location.name };
  }
};

async function fetchRouteInfo() {
  const from = yuklenecekLocation.value;
  const to = bosaltilanLocation.value;
  if (!from?.lat || !from?.lng || !to?.lat || !to?.lng) {
    routeInfo.value = null;
    return;
  }
  routeLoading.value = true;
  routeInfo.value = null;
  try {
    const url = `https://router.project-osrm.org/route/v1/driving/${from.lng},${from.lat};${to.lng},${to.lat}?overview=false`;
    const res = await fetch(url);
    const data = await res.json();
    if (data.code === 'Ok' && data.routes?.[0]) {
      const route = data.routes[0];
      const distKm = (route.distance / 1000).toFixed(1);
      const durSec = route.duration;
      const hours = Math.floor(durSec / 3600);
      const mins = Math.round((durSec % 3600) / 60);
      const durationStr = hours > 0
        ? `${hours} saat ${mins > 0 ? mins + ' dk' : ''}`.trim()
        : `${mins} dk`;
      routeInfo.value = { distance: `${distKm} km`, duration: durationStr };
    }
  } catch (_) {
    routeInfo.value = null;
  } finally {
    routeLoading.value = false;
  }
}

watch(
  () => [yuklenecekLocation.value, bosaltilanLocation.value],
  () => fetchRouteInfo(),
  { deep: true }
);

const canGoNext = computed(() => {
  if (page.value === 1) {
    return !!postStore.selectedCar;
  }
  if (page.value === 2) {
    return !!(yuklenecekYer.value?.trim() && bosaltilanYer.value?.trim());
  }
  return true;
});

</script>
