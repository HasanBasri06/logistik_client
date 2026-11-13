<template>
  <div class="w-full bg-white rounded-2xl border border-gray-100 shadow-sm">
    <div class="px-4 sm:px-6 py-4 border-b border-gray-100/80 flex items-start justify-between gap-3">
      <div class="flex items-start gap-3">
        <div class="w-9 h-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
          <i class="pi pi-truck text-sm"></i>
        </div>
        <div>
          <h3 class="text-lg font-semibold text-gray-800">Araçlar</h3>
          <p class="text-sm text-gray-500 mt-0.5">Yükünüzü taşıyabilecek araçları seçin. Birden fazla seçebilirsiniz.</p>
        </div>
      </div>
      <span
        v-if="selectedCars.length"
        class="shrink-0 px-3 py-1 rounded-full bg-secondary text-white text-xs font-semibold"
      >
        {{ selectedCars.length }} araç seçildi
      </span>
    </div>
    <div class="p-4 sm:p-6">
      <p v-if="carsError" class="text-sm text-red-600">{{ carsError }}</p>
      <div v-else-if="carsLoading" class="flex items-center justify-center py-12">
        <i class="pi pi-spin pi-spinner text-2xl text-primary"></i>
        <span class="ml-3 text-gray-500">Araçlar yükleniyor...</span>
      </div>
      <div
        v-else-if="!cars.length"
        class="flex flex-col items-center justify-center py-12 px-4 rounded-xl bg-gray-50 text-gray-500"
      >
        <i class="pi pi-car text-4xl mb-3 text-gray-400"></i>
        <p class="text-base font-medium">Araç bulunamadı</p>
      </div>
      <div v-else data-tour="cp-cars" class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
        <button
          v-for="car in cars"
          :key="car.id"
          type="button"
          :aria-pressed="postStore.isCarSelected(car.id)"
          class="relative flex flex-col items-center text-center p-4 rounded-2xl border-2 transition-all duration-200 cursor-pointer select-none"
          :class="
            postStore.isCarSelected(car.id)
              ? 'border-primary bg-primary/5 shadow-md shadow-primary/10'
              : 'border-gray-200 bg-white hover:border-primary/40 hover:bg-primary/5'
          "
          @click="toggleCar(car)"
        >
          <span
            class="absolute top-2.5 right-2.5 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors"
            :class="postStore.isCarSelected(car.id) ? 'bg-primary border-primary text-white' : 'border-gray-300 bg-white'"
          >
            <i v-if="postStore.isCarSelected(car.id)" class="pi pi-check" style="font-size: 11px;"></i>
          </span>
          <img
            :src="getDisplayImage(car)"
            :alt="car.name"
            class="h-16 sm:h-20 w-full object-contain mt-3"
          />
          <span
            class="mt-3 text-sm"
            :class="postStore.isCarSelected(car.id) ? 'text-primary font-semibold' : 'text-gray-700 font-medium'"
          >
            {{ car.name }}
          </span>
          <span v-if="car.price" class="mt-0.5 text-xs text-gray-500">{{ car.price }} TL'den başlar</span>
          <span v-if="car.width || car.height" class="mt-1 text-[11px] text-gray-400">
            {{ car.width ? `${car.width} m` : '-' }} × {{ car.height ? `${car.height} m` : '-' }}
          </span>
        </button>
      </div>
    </div>
  </div>

  <!-- Dar ekranda sepet ızgaranın altında; geniş ekranda modalın sağ panelinde (CreatePostModal) -->
  <VehicleCart
    v-if="hasSelectedDetails"
    class="lg:hidden w-full rounded-2xl border border-gray-100 shadow-sm overflow-hidden"
  />
</template>

<script setup>
import { computed, onMounted, ref } from "vue";
import { storeToRefs } from "pinia";
import api from "@/api";
import { usePostStore } from "@/stores/post";
import { carVariantImage } from "@/lib/shipment-vehicles";
import { autoSelectFirstDetails } from "@/lib/car-details";
import VehicleCart from "@/components/VehicleCart.vue";

const cars = ref([]);
const carsLoading = ref(false);
const carsError = ref(null);

const postStore = usePostStore();
const { selectedCars } = storeToRefs(postStore);

const hasSelectedDetails = computed(() => selectedCars.value.some((s) => s.car.details?.length));

function toggleCar(car) {
  postStore.toggleCar(car, autoSelectFirstDetails(car));
}

const getCars = async () => {
  carsLoading.value = true;
  carsError.value = null;
  try {
    const res = await api.get("/cars");
    const content = res.data?.content;
    cars.value = content?.cars ?? [];
  } catch (err) {
    carsError.value = err.response?.data?.message ?? err.message ?? "Araçlar yüklenirken hata oluştu";
    cars.value = [];
  } finally {
    carsLoading.value = false;
  }
};

/** Seçili araçta, seçilen varyantın görseli varsa onu göster */
const getDisplayImage = (car) => {
  const sel = selectedCars.value.find((s) => s.car.id === car.id);
  return carVariantImage(car, sel?.details ?? []);
};

onMounted(getCars);
</script>
