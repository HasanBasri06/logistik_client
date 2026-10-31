<template>
  <span v-if="!vehicles.length" class="text-sm font-medium text-gray-600">—</span>
  <span
    v-else-if="vehicles.length === 1"
    class="text-sm font-medium text-gray-600 truncate"
    :title="vehicles[0].label"
  >
    {{ vehicles[0].label }}
  </span>
  <span
    v-else
    ref="triggerRef"
    role="button"
    tabindex="0"
    :aria-expanded="open"
    aria-haspopup="true"
    class="inline-flex items-center gap-1.5 min-w-0 max-w-full cursor-pointer"
    @mouseenter="show"
    @mouseleave="scheduleHide"
    @focus="show"
    @blur="scheduleHide"
    @click.stop="toggle"
    @keydown.enter.stop.prevent="toggle"
    @keydown.esc="hide"
  >
    <span class="text-sm font-medium text-gray-600 truncate">{{ vehicles[0].label }}</span>
    <span
      class="shrink-0 inline-flex items-center gap-0.5 rounded-full bg-secondary px-2 py-0.5 text-[11px] font-bold text-white"
    >
      +{{ vehicles.length - 1 }}
      <i class="pi pi-chevron-down transition-transform" :class="{ 'rotate-180': open }" style="font-size: 8px;"></i>
    </span>
  </span>

  <Teleport to="body">
    <Transition name="vehicle-stack">
      <div
        v-if="open"
        class="fixed z-80 w-64 rounded-xl border border-gray-200 bg-white p-2 shadow-xl"
        :style="popoverStyle"
        role="menu"
        @mouseenter="show"
        @mouseleave="scheduleHide"
        @click.stop
      >
        <p class="px-2 pt-1 pb-2 text-[11px] font-semibold uppercase tracking-wide text-gray-400">
          Taşıyabilecek araçlar ({{ vehicles.length }})
        </p>
        <ul class="flex flex-col gap-1">
          <li
            v-for="v in vehicles"
            :key="v.id"
            class="flex items-center gap-3 rounded-lg px-2 py-1.5 hover:bg-primary/5"
          >
            <span class="w-12 h-9 shrink-0 rounded-md bg-gray-50 flex items-center justify-center overflow-hidden">
              <img v-if="v.image" :src="v.image" :alt="v.label" class="w-full h-full object-contain" />
              <i v-else class="pi pi-truck text-gray-400 text-sm"></i>
            </span>
            <span class="text-sm font-medium text-gray-800 leading-snug">{{ v.label }}</span>
          </li>
        </ul>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { ref, onBeforeUnmount } from 'vue';

defineProps({
  /** shipmentVehicles() çıktısı: [{ id, label, image }] */
  vehicles: { type: Array, default: () => [] },
});

const POPOVER_WIDTH = 256;
const GAP = 6;

const open = ref(false);
const triggerRef = ref(null);
const popoverStyle = ref({});
let hideTimer = null;

function position() {
  const rect = triggerRef.value?.getBoundingClientRect();
  if (!rect) return;
  const left = Math.min(Math.max(8, rect.right - POPOVER_WIDTH), window.innerWidth - POPOVER_WIDTH - 8);
  // Altta yer yoksa yukarı aç
  const openUp = rect.bottom + 240 > window.innerHeight && rect.top > 240;
  popoverStyle.value = openUp
    ? { left: `${left}px`, bottom: `${window.innerHeight - rect.top + GAP}px` }
    : { left: `${left}px`, top: `${rect.bottom + GAP}px` };
}

function show() {
  clearTimeout(hideTimer);
  if (open.value) return;
  position();
  open.value = true;
  window.addEventListener('scroll', hide, true);
  window.addEventListener('resize', hide);
  document.addEventListener('click', hide);
}

function hide() {
  clearTimeout(hideTimer);
  open.value = false;
  window.removeEventListener('scroll', hide, true);
  window.removeEventListener('resize', hide);
  document.removeEventListener('click', hide);
}

/** Tetikleyiciden menüye geçerken kapanmasın diye kısa gecikme */
function scheduleHide() {
  clearTimeout(hideTimer);
  hideTimer = setTimeout(hide, 120);
}

function toggle() {
  if (open.value) hide();
  else show();
}

onBeforeUnmount(hide);
</script>

<style scoped>
.vehicle-stack-enter-active,
.vehicle-stack-leave-active {
  transition: opacity 0.15s ease, transform 0.15s ease;
}
.vehicle-stack-enter-from,
.vehicle-stack-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}
</style>
