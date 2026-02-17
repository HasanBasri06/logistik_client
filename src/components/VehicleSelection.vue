<template>
  <div class="w-full bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden overflow-y-scroll no_scrool">
    <div class="px-6 py-4 border-b border-gray-100">
      <h3 class="text-lg font-semibold text-gray-800">Araçlar</h3>
      <p class="text-sm text-gray-500 mt-0.5">Yükünüzü taşıyacak araç seçiniz</p>
    </div>
    <div class="p-6">
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
      <template v-else>
        <!-- Araç isimli butonlar -->
        <div class="flex flex-wrap gap-2 mb-4">
          <button
            v-for="(car, index) in cars"
            :key="car.id"
            type="button"
            @click="selectCar(car, index)"
            class="shrink-0 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200"
            :class="
              selectedCar?.id === car.id
                ? 'bg-primary text-white shadow-md shadow-primary/25 ring-2 ring-primary/30'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-gray-800'
            "
          >
            {{ car.name }}
          </button>
        </div>

        <Carousel
          ref="carsCarouselRef"
          v-model="activeCarIndex"
          :items-to-show="4"
          :items-to-scroll="4"
          :wrap-around="true"
          :transition="400"
          :mouse-drag="true"
          :touch-drag="true"
          :gap="20"
          @slide-end="onCarouselSlideEnd"
        >
          <Slide v-for="car in cars" :key="car.id">
            <div
              role="button"
              tabindex="0"
              class="flex flex-col items-center justify-center w-72 p-4 rounded-xl border-2 cursor-pointer transition-all select-none"
              :class="
                selectedCar?.id === car.id
                  ? 'border-primary bg-primary/5 shadow-md shadow-primary/10'
                  : 'border-gray-200 hover:border-primary/50 hover:bg-gray-50'
              "
              @click="selectCar(car)"
              @keydown.enter="selectCar(car)"
            >
              <img
                :src="getDisplayImage(car)"
                :alt="car.name"
                class="h-24 w-full object-contain"
              />
              <span
                class="mt-2 text-sm font-medium"
                :class="selectedCar?.id === car.id ? 'text-primary font-semibold' : 'text-gray-700'"
              >
                {{ car.name }}
              </span>
              <span
                v-if="selectedCar?.id === car.id"
                class="mt-1 text-xs text-primary font-medium"
              >
                ✓ Seçildi
              </span>
            </div>
          </Slide>
        </Carousel>

        <!-- Seçili araç önizlemesi (detail image ile güncellenir) -->
        <div v-if="selectedCar" class="mt-6 pt-6 border-t border-gray-100">
          <div class="flex flex-col items-center justify-center p-10 rounded-xl bg-gray-50 border border-gray-200 relative">
            <div class="absolute top-5 left-5 text-primary font-medium">5000 TL 'den başlar</div>
            <div class="w-auto h-auto px-5 py-2 relative">
              <div class="absolute -top-6 flex items-center border-dotted justify-center border-b border-primary/40 left-2/4 -translate-x-2/4 w-[90%]  h-6 text-sm text-primary pb-2">
                1 metre
              </div>
              <div class="w-full h-full border-r border-dotted text-primary border-primary/40 absolute">
                <div class="absolute top-2/4 -translate-y-2/4 -right-15 text-sm">2 metre</div>
              </div>
              <img
                :src="getDisplayImage(selectedCar)"
                :alt="selectedCar.name"
                class="h-32 w-full max-w-xs object-contain"
              />

            </div>
            <span class="mt-2 text-sm font-semibold text-gray-700">{{ selectedCar.name }}</span>
          </div>
        </div>

        <!-- Seçili aracın details (varyant) seçimi -->
        <div
          v-if="selectedCar && selectedCar.details?.length"
          class="mt-6 pt-6 border-t border-gray-100"
        >
          <div
            v-for="(group, groupName) in detailsByType"
            :key="groupName"
            class="mb-4"
          >
            <div class="flex flex-wrap gap-2">
              <label
                v-for="item in group"
                :key="item.id ?? item.value"
                class="cursor-pointer"
              >
                <input
                  type="radio"
                  :name="`car-${selectedCar.id}-${groupName}`"
                  :value="item.value"
                  v-model="selectedDetailValues[`${selectedCar.id}-${groupName}`]"
                  class="peer sr-only"
                />
                <div
                  class="px-4 py-2.5 rounded-lg border-2 text-sm font-medium transition-all duration-200 peer-checked:border-primary peer-checked:bg-primary peer-checked:text-white border-gray-200 text-gray-600 hover:border-primary/50 hover:text-primary"
                >
                  {{ item.value }}
                </div>
              </label>
            </div>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, ref, nextTick, watch } from "vue";
import api from "@/api";
import { usePostStore } from "@/stores/post";
import { Carousel, Slide } from "vue3-carousel";
import "vue3-carousel/carousel.css";

const cars = ref([]);
const carsLoading = ref(false);
const carsError = ref(null);
const activeCarIndex = ref(0);
const carsCarouselRef = ref(null);
const selectedCar = ref(null);
const selectedDetailValues = ref({});

defineExpose({
  selectedCar,
  selectedDetailValues,
  carsCarouselRef,
});

const detailsByType = computed(() => {
  const details = selectedCar.value?.details ?? [];
  if (!details.length) return {};
  const groups = {};
  for (const item of details) {
    const type = item.type ?? item.name ?? "Varyant";
    if (!groups[type]) groups[type] = [];
    groups[type].push(item);
  }
  return groups;
});

const postStore = usePostStore();

watch(
  selectedDetailValues,
  (val) => {
    if (selectedCar.value) postStore.selectedDetailValues = { ...val };
  },
  { deep: true }
);

const selectCar = async (car, index) => {
  selectedCar.value = car;
  postStore.selectedCar = car;
  if (typeof index === "number") {
    activeCarIndex.value = index;
    await nextTick();
    carsCarouselRef.value?.slideTo(index);
  }
};

/** Sayfa 2'den geri dönüldüğünde store'dan seçili araç ve detayları geri yükle */
const restoreFromStore = async () => {
  const stored = postStore.selectedCar;
  if (!stored || !cars.value?.length) return;
  const idx = cars.value.findIndex((c) => c.id === stored.id);
  if (idx === -1) return;
  selectedCar.value = cars.value[idx];
  activeCarIndex.value = idx;
  if (postStore.selectedDetailValues && Object.keys(postStore.selectedDetailValues).length) {
    selectedDetailValues.value = { ...postStore.selectedDetailValues };
  }
  await nextTick();
  carsCarouselRef.value?.slideTo(idx);
};

const onCarouselSlideEnd = (e) => {
  activeCarIndex.value = e.currentSlideIndex;
};

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
    restoreFromStore();
  }
};

const getCarImageUrl = (image) => {
  if (!image) return "";
  if (image.startsWith("http")) return image;
  return new URL(`../assets/images/vehicles/${image}`, import.meta.url).href;
};

const getDisplayImage = (car) => {
  if (!car || selectedCar.value?.id !== car.id) {
    return getCarImageUrl(car?.image);
  }
  const details = selectedCar.value?.details ?? [];
  const sel = selectedDetailValues.value;
  for (const item of details) {
    const groupName = item.type ?? item.name ?? "Varyant";
    const key = `${selectedCar.value.id}-${groupName}`;
    if (sel[key] === item.value && item.image) {
      return getCarImageUrl(item.image);
    }
  }
  return getCarImageUrl(car.image);
};

onMounted(getCars);
</script>
