<template>
  <div class="w-full bg-linear-to-b from-white to-gray-50/70 rounded-2xl md:border md:border-gray-100 md:shadow-sm">
    <div class="px-4 sm:px-6 py-4 border-b border-gray-100/80">
      <div class="flex items-start gap-3">
        <div class="w-9 h-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
          <i class="pi pi-truck text-sm"></i>
        </div>
        <div>
          <h3 class="text-lg font-semibold text-gray-800">Araçlar</h3>
          <p class="text-sm text-gray-500 mt-0.5">Yükünüzü taşıyacak aracı seçin</p>
        </div>
      </div>
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
      <template v-else>
        <div class="flex flex-wrap gap-2 mb-5">
          <button
            v-for="(car, index) in cars"
            :key="car.id"
            type="button"
            @click="selectCar(car, index)"
            class="shrink-0 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 border"
            :class="
              selectedCar?.id === car.id
                ? 'bg-primary text-white border-primary shadow-md shadow-primary/25 ring-2 ring-primary/30'
                : 'bg-white border-gray-200 text-gray-700 hover:border-primary/40 hover:bg-primary/5 hover:text-primary cursor-pointer'
            "
          >
            {{ car.name }}
          </button>
        </div>

        <Carousel
          ref="carsCarouselRef"
          v-model="activeCarIndex"
          :items-to-show="1"
          :items-to-scroll="1"
          :wrap-around="false"
          :transition="400"
          :mouse-drag="true"
          :touch-drag="true"
          :gap="20"
          snap-align="start"
          :breakpoints="carouselBreakpoints"
          @slide-end="onCarouselSlideEnd"
        >
          <Slide v-for="car in cars" :key="car.id">
            <div
              role="button"
              tabindex="0"
              class="flex flex-col items-center justify-center w-full sm:max-w-80 sm:mx-auto p-5 rounded-2xl border cursor-pointer transition-all select-none bg-white"
              :class="
                selectedCar?.id === car.id
                  ? 'border-primary/60 bg-primary/5 shadow-lg shadow-primary/10'
                  : 'border-gray-200 hover:border-primary/40 hover:bg-primary/5/40'
              "
              @click="selectCar(car)"
              @keydown.enter="selectCar(car)"
            >
              <img
                :src="getDisplayImage(car)"
                :alt="car.name"
                class="h-20 w-full object-contain"
              />
              <span
                class="mt-3 text-sm font-medium"
                :class="selectedCar?.id === car.id ? 'text-primary font-semibold' : 'text-gray-700'"
              >
                {{ car.name }}
              </span>
              <span
                v-if="selectedCar?.id === car.id"
                class="mt-1 text-xs text-primary font-semibold"
              >
                <i class="pi pi-check-circle mr-1"></i>Seçildi
              </span>
            </div>
          </Slide>
        </Carousel>

        <!-- Seçili araç önizlemesi -->
        <div v-if="selectedCar" class="mt-6 pt-6 border-t border-gray-100">
          <div class="rounded-2xl border border-primary/15 bg-linear-to-br from-white via-primary/5 to-indigo-50 p-4 sm:p-6 shadow-sm">
            <div class="flex items-center justify-between gap-2 mb-4">
              <div class="flex items-center gap-2">
                <span class="w-7 h-7 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                  <i class="pi pi-car text-xs"></i>
                </span>
                <span class="text-sm font-semibold text-gray-800">{{ selectedCar.name }}</span>
              </div>
              <span class="px-3 py-1 rounded-full bg-primary text-white font-semibold text-xs">
                {{ selectedCar.price }} TL 'den başlar
              </span>
            </div>

            <div class="w-full rounded-xl border border-white/80 bg-white/90 p-3 sm:p-5">
              <div class="grid grid-cols-2 gap-2 mb-3">
                <div class="rounded-lg bg-gray-50 border border-gray-100 px-3 py-2">
                  <div class="text-[11px] text-gray-500">Genişlik</div>
                  <div class="text-sm font-semibold text-gray-800">
                    {{ selectedCar.width ? `${selectedCar.width} metre` : '-' }}
                  </div>
                </div>
                <div class="rounded-lg bg-gray-50 border border-gray-100 px-3 py-2">
                  <div class="text-[11px] text-gray-500">Yükseklik</div>
                  <div class="text-sm font-semibold text-gray-800">
                    {{ selectedCar.height ? `${selectedCar.height} metre` : '-' }}
                  </div>
                </div>
              </div>

              <div class="flex items-center justify-center rounded-xl bg-linear-to-b from-white to-gray-50 border border-gray-100 py-3">
                <img
                  :src="getDisplayImage(selectedCar)"
                  :alt="selectedCar.name"
                  class="h-24 sm:h-32 w-full max-w-xs object-contain"
                />
              </div>
            </div>
          </div>
        </div>

        <!-- Varyant seçimi -->
        
      </template>
    </div>
  </div>

  <div class="w-full bg-white border border-gray-100 rounded-2xl shadow-sm p-4 sm:p-6" v-if="selectedCar && selectedCar.details?.length">
    <div
          v-if="selectedCar && selectedCar.details?.length"
          
        >
          <div
            v-for="(group, groupName) in detailsByType"
            :key="groupName"
            class="mb-4 last:mb-0"
          >
            <div v-if="shouldShowDetailGroupTitle(groupName)" class="text-sm font-semibold text-gray-700 mb-2">
              {{ groupName }}
            </div>
            <div class="flex flex-wrap gap-2">
              <label
                v-for="item in group"
                :key="item.id ?? item.value"
                class="cursor-pointer"
              >
                <input
                  type="radio"
                  :name="`car-${selectedCar.id}-${groupKey(group, groupName)}`"
                  :value="item.id"
                  :checked="getDetailSelection(group)?.id === item.id"
                  class="peer sr-only"
                  @change="setDetailValue(group, groupName, item)"
                />
                <div
                  class="px-4 py-2.5 rounded-xl border text-sm font-medium transition-all duration-200 peer-checked:border-primary peer-checked:bg-primary peer-checked:text-white border-gray-200 text-gray-700 hover:border-primary/50 hover:text-primary hover:bg-primary/5"
                >
                  {{ item.value }}
                </div>
              </label>
            </div>
          </div>
        </div>
  </div>
</template>

<script setup>
import { computed, onMounted, ref, nextTick, watch } from "vue";
import api from "@/api";
import { vehicleImageUrl } from "@/lib/catalog-assets";
import { usePostStore } from "@/stores/post";
import { Carousel, Slide } from "vue3-carousel";
import "vue3-carousel/carousel.css";

const carouselBreakpoints = {
  768: { itemsToShow: 3, itemsToScroll: 1 },
};

const cars = ref([]);
const carsLoading = ref(false);
const carsError = ref(null);
const activeCarIndex = ref(0);
const carsCarouselRef = ref(null);
const selectedCar = ref(null);
/** Sadece { id, name } dizisi, iç içe obje yok */
const selectedDetailValues = ref([]);

const postStore = usePostStore();

/** Sunucudaki `name` alanı bazen literal "{{name}}" geliyor; grup başlığı için kullanma. */
function normalizeDetailGroupKey(raw) {
  const s = raw != null ? String(raw).trim() : '';
  if (!s || s.includes('{{') || s.toLowerCase() === 'type') return 'Varyant';
  return s;
}

function shouldShowDetailGroupTitle(groupName) {
  const keys = Object.keys(detailsByType.value);
  if (keys.length === 1 && groupName === 'Varyant') return false;
  return true;
}

const detailsByType = computed(() => {
  const details = selectedCar.value?.details ?? [];
  if (!details.length) return {};
  const groups = {};
  for (const item of details) {
    const type = normalizeDetailGroupKey(item.type);
    if (!groups[type]) groups[type] = [];
    groups[type].push(item);
  }
  return groups;
});

function groupKey(group, groupName) {
  const firstId = group?.[0]?.id;
  return `${groupName}-${firstId ?? 'g'}`;
}

/** Bu gruptaki seçili öğe: dizide bu gruba ait id varsa { id, name } döner */
function getDetailSelection(group) {
  const arr = selectedDetailValues.value;
  const groupIds = group.map((g) => g.id);
  return arr.find((s) => groupIds.includes(s.id));
}

function setDetailValue(group, groupName, item) {
  const groupIds = group.map((g) => g.id);
  const rest = selectedDetailValues.value.filter((s) => !groupIds.includes(s.id));
  selectedDetailValues.value = [...rest, { id: item.id, name: item.value }];
}

watch(
  selectedDetailValues,
  (val) => {
    if (selectedCar.value && Array.isArray(val)) {
      if (!val.length) {
        postStore.selectedDetailValues = {};
      } else {
        postStore.selectedDetailValues = {
          id: val.map((s) => s.id).join(","),
          name: val.map((s) => s.name).join(",")
        };
      }
    }
  },
  { deep: true }
);

function parseStoreDetailValues(storeVal) {
  if (!storeVal || typeof storeVal !== "object" || Array.isArray(storeVal)) return [];
  const idStr = storeVal.id;
  const nameStr = storeVal.name;
  if (idStr == null || nameStr == null) return [];
  const ids = typeof idStr === "string" ? idStr.split(",").filter(Boolean) : [];
  const names = typeof nameStr === "string" ? nameStr.split(",").filter(Boolean) : [];
  return ids.map((id, i) => ({ id: Number(id) || id, name: names[i] ?? "" }));
}

function autoSelectFirstDetails(car) {
  const details = car?.details ?? [];
  if (!details.length) return [];
  const groups = {};
  for (const item of details) {
    const type = normalizeDetailGroupKey(item.type);
    if (!groups[type]) groups[type] = item;
  }
  return Object.values(groups).map((item) => ({
    id: item.id,
    name: item.value != null && String(item.value).trim() !== '' ? String(item.value) : String(item.name ?? ''),
  }));
}

const selectCar = async (car, index) => {
  selectedCar.value = car;
  postStore.setSelectedCar(car);
  selectedDetailValues.value = autoSelectFirstDetails(car);
  if (typeof index === "number") {
    activeCarIndex.value = index;
    await nextTick();
    carsCarouselRef.value?.slideTo(index);
  }
};

const restoreFromStore = async () => {
  const stored = postStore.selectedCar;
  if (!stored || !cars.value?.length) return;
  const idx = cars.value.findIndex((c) => c.id === stored.id);
  if (idx === -1) return;
  selectedCar.value = cars.value[idx];
  activeCarIndex.value = idx;
  postStore.setSelectedCar(cars.value[idx]);
  selectedDetailValues.value = autoSelectFirstDetails(cars.value[idx]);
  await nextTick();
  carsCarouselRef.value?.slideTo(idx);
};

const onCarouselSlideEnd = (e) => {
  const idx = e.currentSlideIndex;
  activeCarIndex.value = idx;
  const car = cars.value[idx];
  if (!car) return;
  selectedCar.value = car;
  postStore.setSelectedCar(car);
  selectedDetailValues.value = autoSelectFirstDetails(car);
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

const getCarImageUrl = (image) => vehicleImageUrl(image);

const getDisplayImage = (car) => {
  if (!car || selectedCar.value?.id !== car.id) {
    return getCarImageUrl(car?.image);
  }
  const details = selectedCar.value?.details ?? [];
  const sel = selectedDetailValues.value;
  for (const item of details) {
    if (sel.some((s) => s.id === item.id) && item.image) {
      return getCarImageUrl(item.image);
    }
  }
  return getCarImageUrl(car.image);
};

onMounted(getCars);
</script>

<style scoped>
:deep(.carousel__prev),
:deep(.carousel__next) {
  width: 36px;
  height: 36px;
  background-color: white;
  border: 2px solid var(--p-primary-color, #6366f1);
  border-radius: 9999px;
  color: var(--p-primary-color, #6366f1);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: all 0.2s;
}

:deep(.carousel__prev:hover),
:deep(.carousel__next:hover) {
  background-color: var(--p-primary-color, #6366f1);
  color: white;
}

:deep(.carousel__prev svg),
:deep(.carousel__next svg) {
  width: 20px;
  height: 20px;
}
</style>
