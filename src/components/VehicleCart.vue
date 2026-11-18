<template>
  <div class="flex flex-col min-h-0 bg-white">
    <div class="shrink-0 px-4 sm:px-5 py-4 border-b border-gray-100 flex items-center justify-between gap-3">
      <div class="flex items-center gap-2.5">
        <span class="w-9 h-9 rounded-xl bg-secondary/10 text-secondary flex items-center justify-center">
          <i class="pi pi-shopping-cart text-sm"></i>
        </span>
        <div>
          <h3 class="text-base font-semibold text-gray-900">Seçilen Araçlar</h3>
          <p class="text-xs text-gray-500">Her araç ve detayı ilanda ayrı gösterilir</p>
        </div>
      </div>
      <span class="shrink-0 min-w-7 h-7 px-2 rounded-full bg-secondary text-white text-xs font-bold flex items-center justify-center">
        {{ selectedCarRows.length }}
      </span>
    </div>

    <TransitionGroup tag="ul" name="cart-item" class="flex-1 min-h-0 overflow-y-auto p-3 sm:p-4 flex flex-col gap-3">
      <li
        v-for="row in selectedCarRows"
        :key="`${row.car.id}-${row.detail?.id ?? 0}`"
        class="rounded-xl border border-gray-200 bg-white p-3 shadow-xs"
      >
        <div class="flex items-center gap-3">
          <span class="w-16 h-12 shrink-0 rounded-lg bg-gray-50 flex items-center justify-center overflow-hidden">
            <img :src="carVariantImage(row.car, row.detail ? [row.detail] : [])" :alt="row.car.name" class="w-full h-full object-contain" />
          </span>
          <div class="min-w-0 flex-1">
            <p class="text-sm font-semibold text-gray-900 truncate">{{ row.car.name }}</p>
            <p v-if="row.detail?.name" class="text-xs text-primary font-medium truncate">{{ row.detail.name }}</p>
            <p v-else-if="row.car.price" class="text-xs text-gray-500">{{ row.car.price }} TL'den başlar</p>
          </div>
          <button
            v-if="(row.car.details?.length ?? 0) > 1"
            type="button"
            class="shrink-0 w-8 h-8 rounded-lg text-gray-400 hover:bg-primary/10 hover:text-primary transition-colors flex items-center justify-center cursor-pointer"
            :aria-label="`${row.car.name} detaylarını düzenle`"
            @click="postStore.openDetailModal(row.car)"
          >
            <i class="pi pi-pencil" style="font-size: 13px;"></i>
          </button>
          <button
            type="button"
            class="shrink-0 w-8 h-8 rounded-lg text-gray-400 hover:bg-red-50 hover:text-red-600 transition-colors flex items-center justify-center cursor-pointer"
            :aria-label="`${row.car.name} ${row.detail?.name ?? ''} çıkar`"
            @click="postStore.removeCarDetail(row.car.id, row.detail?.id ?? null)"
          >
            <i class="pi pi-trash" style="font-size: 13px;"></i>
          </button>
        </div>
      </li>
    </TransitionGroup>
  </div>
</template>

<script setup>
import { storeToRefs } from 'pinia';
import { usePostStore } from '@/stores/post';
import { carVariantImage } from '@/lib/shipment-vehicles';

const postStore = usePostStore();
const { selectedCarRows } = storeToRefs(postStore);
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
