<template>
  <div class="flex flex-col min-h-0 bg-white">
    <div class="shrink-0 px-4 sm:px-5 py-4 border-b border-gray-100 flex items-center justify-between gap-3">
      <div class="flex items-center gap-2.5">
        <span class="w-9 h-9 rounded-xl bg-secondary/10 text-secondary flex items-center justify-center">
          <i class="pi pi-shopping-cart text-sm"></i>
        </span>
        <div>
          <h3 class="text-base font-semibold text-gray-900">Seçilen Araçlar</h3>
          <p class="text-xs text-gray-500">Varyantları buradan belirleyin</p>
        </div>
      </div>
      <span class="shrink-0 min-w-7 h-7 px-2 rounded-full bg-secondary text-white text-xs font-bold flex items-center justify-center">
        {{ selectedCars.length }}
      </span>
    </div>

    <TransitionGroup tag="ul" name="cart-item" class="flex-1 min-h-0 overflow-y-auto p-3 sm:p-4 flex flex-col gap-3">
      <li
        v-for="sel in selectedCars"
        :key="sel.car.id"
        class="rounded-xl border border-gray-200 bg-white p-3 shadow-xs"
      >
        <div class="flex items-center gap-3">
          <span class="w-16 h-12 shrink-0 rounded-lg bg-gray-50 flex items-center justify-center overflow-hidden">
            <img :src="carVariantImage(sel.car, sel.details)" :alt="sel.car.name" class="w-full h-full object-contain" />
          </span>
          <div class="min-w-0 flex-1">
            <p class="text-sm font-semibold text-gray-900 truncate">{{ sel.car.name }}</p>
            <p v-if="sel.details.length" class="text-xs text-primary font-medium truncate">
              {{ sel.details.map((d) => d.name).join(' · ') }}
            </p>
            <p v-else-if="sel.car.price" class="text-xs text-gray-500">{{ sel.car.price }} TL'den başlar</p>
          </div>
          <button
            type="button"
            class="shrink-0 w-8 h-8 rounded-lg text-gray-400 hover:bg-red-50 hover:text-red-600 transition-colors flex items-center justify-center"
            :aria-label="`${sel.car.name} aracını çıkar`"
            @click="postStore.toggleCar(sel.car)"
          >
            <i class="pi pi-trash" style="font-size: 13px;"></i>
          </button>
        </div>

        <!-- Varyant seçimi -->
        <div v-if="sel.car.details?.length" class="mt-3 pt-3 border-t border-gray-100 flex flex-col gap-3">
          <div v-for="(group, groupName) in detailsByType(sel.car)" :key="groupName">
            <p v-if="shouldShowDetailGroupTitle(sel.car, groupName)" class="text-xs font-semibold text-gray-600 mb-1.5">
              {{ groupName }}
            </p>
            <div class="flex flex-wrap gap-1.5">
              <button
                v-for="item in group"
                :key="item.id ?? item.value"
                type="button"
                class="px-3 py-1.5 rounded-lg border text-xs font-medium transition-colors"
                :class="
                  getDetailSelection(sel, group)?.id === item.id
                    ? 'border-primary bg-primary text-white'
                    : 'border-gray-200 text-gray-700 hover:border-primary/50 hover:text-primary hover:bg-primary/5'
                "
                :aria-pressed="getDetailSelection(sel, group)?.id === item.id"
                @click="setDetailValue(sel, group, item)"
              >
                {{ item.value }}
              </button>
            </div>
          </div>
        </div>
      </li>
    </TransitionGroup>
  </div>
</template>

<script setup>
import { storeToRefs } from 'pinia';
import { usePostStore } from '@/stores/post';
import { carVariantImage } from '@/lib/shipment-vehicles';
import { detailsByType, shouldShowDetailGroupTitle } from '@/lib/car-details';

const postStore = usePostStore();
const { selectedCars } = storeToRefs(postStore);

/** Bu gruptaki seçili öğe: dizide bu gruba ait id varsa { id, name } döner */
function getDetailSelection(sel, group) {
  const groupIds = group.map((g) => g.id);
  return sel.details.find((s) => groupIds.includes(s.id));
}

function setDetailValue(sel, group, item) {
  const groupIds = group.map((g) => g.id);
  const rest = sel.details.filter((s) => !groupIds.includes(s.id));
  postStore.setCarDetails(sel.car.id, [...rest, { id: item.id, name: item.value }]);
}
</script>

<style scoped>
.cart-item-enter-active,
.cart-item-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}
.cart-item-enter-from,
.cart-item-leave-to {
  opacity: 0;
  transform: translateX(12px);
}
</style>
