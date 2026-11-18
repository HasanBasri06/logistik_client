<template>
  <Teleport to="body">
    <Transition name="detail-modal">
      <div
        v-if="car"
        class="fixed inset-0 z-100 flex items-end sm:items-center justify-center sm:p-4"
        role="dialog"
        aria-modal="true"
        aria-labelledby="vehicle-detail-title"
        @keydown.esc="close"
      >
        <div class="absolute inset-0 bg-gray-900/50" @click="close" />
        <div class="relative w-full sm:max-w-md max-h-[85vh] flex flex-col bg-white rounded-t-2xl sm:rounded-2xl shadow-xl">
          <div class="shrink-0 px-5 pt-5 pb-3 border-b border-gray-100">
            <div class="flex items-start justify-between gap-3">
              <div class="min-w-0">
                <h3 id="vehicle-detail-title" class="text-base font-semibold text-gray-900 truncate">
                  {{ car.name }} · Detay seçin
                </h3>
                <p class="text-xs text-gray-500 mt-0.5">
                  Birden fazla seçebilirsiniz. Her detay ilanda ayrı araç olarak gösterilir.
                </p>
              </div>
              <button
                type="button"
                class="shrink-0 w-8 h-8 rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-700 flex items-center justify-center cursor-pointer"
                aria-label="Kapat"
                @click="close"
              >
                <i class="pi pi-times text-sm"></i>
              </button>
            </div>
          </div>

          <div class="flex-1 min-h-0 overflow-y-auto px-5 py-4 flex flex-col gap-4">
            <div v-for="(group, groupName) in detailsByType(car)" :key="groupName" class="flex flex-col gap-2">
              <p v-if="shouldShowDetailGroupTitle(car, groupName)" class="text-xs font-semibold text-gray-600">
                {{ groupName }}
              </p>
              <label
                v-for="item in group"
                :key="item.id"
                class="flex items-center gap-3 p-2.5 rounded-xl border-2 cursor-pointer transition-colors"
                :class="picked.includes(item.id) ? 'border-primary bg-primary/5' : 'border-gray-200 hover:border-primary/40'"
              >
                <span class="w-16 h-12 shrink-0 rounded-lg bg-gray-50 flex items-center justify-center overflow-hidden">
                  <img :src="carVariantImage(car, [{ id: item.id }])" :alt="detailName(item)" class="w-full h-full object-contain" />
                </span>
                <span
                  class="flex-1 min-w-0 text-sm truncate"
                  :class="picked.includes(item.id) ? 'text-primary font-semibold' : 'text-gray-700 font-medium'"
                >
                  {{ detailName(item) || '—' }}
                </span>
                <input
                  type="checkbox"
                  class="w-5 h-5 accent-primary cursor-pointer"
                  :checked="picked.includes(item.id)"
                  @change="togglePick(item.id)"
                />
              </label>
            </div>
          </div>

          <div class="shrink-0 px-5 py-4 border-t border-gray-100 flex items-center justify-between gap-3">
            <button
              type="button"
              class="text-sm font-medium text-gray-500 hover:text-gray-700 cursor-pointer"
              @click="toggleAll"
            >
              {{ allPicked ? 'Seçimi temizle' : 'Tümünü seç' }}
            </button>
            <div class="flex items-center gap-2">
              <button
                type="button"
                class="px-4 py-2 rounded-lg text-sm font-semibold text-gray-600 hover:bg-gray-100 cursor-pointer"
                @click="close"
              >
                Vazgeç
              </button>
              <button
                type="button"
                class="px-4 py-2 rounded-lg text-sm font-semibold text-white cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                :class="!picked.length && inCart ? 'bg-red-500 hover:bg-red-600' : 'bg-primary hover:bg-primary/90'"
                :disabled="!picked.length && !inCart"
                @click="confirm"
              >
                {{ picked.length ? `${picked.length} detayı ekle` : inCart ? 'Aracı kaldır' : 'Detay seçin' }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { computed, ref, watch } from 'vue';
import { storeToRefs } from 'pinia';
import { usePostStore } from '@/stores/post';
import { carVariantImage } from '@/lib/shipment-vehicles';
import { detailsByType, shouldShowDetailGroupTitle } from '@/lib/car-details';

const postStore = usePostStore();
const { detailModalCar: car, selectedCars } = storeToRefs(postStore);

/** Modalda işaretli detay id'leri */
const picked = ref([]);

const inCart = computed(() => !!car.value && postStore.isCarSelected(car.value.id));
const allPicked = computed(() => !!car.value?.details?.length && picked.value.length === car.value.details.length);

// Modal açılınca sepetteki mevcut seçimi getir
watch(car, (c) => {
  if (!c) return;
  const existing = selectedCars.value.find((s) => s.car.id === c.id)?.details ?? [];
  picked.value = existing.map((d) => d.id);
});

function detailName(item) {
  return item.value != null && String(item.value).trim() !== '' ? String(item.value) : String(item.name ?? '');
}

function togglePick(id) {
  picked.value = picked.value.includes(id) ? picked.value.filter((x) => x !== id) : [...picked.value, id];
}

function toggleAll() {
  picked.value = allPicked.value ? [] : (car.value?.details ?? []).map((d) => d.id);
}

function close() {
  postStore.closeDetailModal();
}

function confirm() {
  const c = car.value;
  if (!c) return;
  // Katalog sırasını koru
  const details = (c.details ?? [])
    .filter((d) => picked.value.includes(d.id))
    .map((d) => ({ id: d.id, name: detailName(d) }));
  postStore.saveCarDetails(c, details);
  close();
}
</script>

<style scoped>
.detail-modal-enter-active,
.detail-modal-leave-active {
  transition: opacity 0.2s ease;
}
.detail-modal-enter-from,
.detail-modal-leave-to {
  opacity: 0;
}
</style>
