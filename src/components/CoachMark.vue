<template>
  <Teleport to="body">
    <div v-if="hole" class="coach-mark" role="dialog" aria-modal="false" :aria-label="title">
      <!-- Delik dışındaki dört karartma alanı tıklamaları yutar; delikteki gerçek öğe tıklanabilir -->
      <div class="coach-dim" :style="{ left: 0, top: 0, width: '100vw', height: `${hole.top}px` }" />
      <div class="coach-dim" :style="{ left: 0, top: `${hole.top + hole.height}px`, width: '100vw', bottom: 0 }" />
      <div class="coach-dim" :style="{ left: 0, top: `${hole.top}px`, width: `${hole.left}px`, height: `${hole.height}px` }" />
      <div
        class="coach-dim"
        :style="{ left: `${hole.left + hole.width}px`, top: `${hole.top}px`, right: 0, height: `${hole.height}px` }"
      />
      <div
        class="coach-ring"
        :style="{ left: `${hole.left}px`, top: `${hole.top}px`, width: `${hole.width}px`, height: `${hole.height}px` }"
      />

      <div ref="tipRef" class="coach-tip" :style="tipStyle" aria-live="polite">
        <div class="flex items-center gap-2">
          <span class="w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center shrink-0">
            <i class="pi pi-sparkles" style="font-size: 12px;"></i>
          </span>
          <span v-if="stepLabel" class="text-xs font-bold text-primary">{{ stepLabel }}</span>
        </div>
        <h3 class="mt-2 text-base font-extrabold text-gray-900">{{ title }}</h3>
        <p class="mt-1 text-sm leading-relaxed text-gray-600">{{ body }}</p>
        <div class="mt-4 flex items-center justify-between gap-3">
          <button type="button" class="text-sm font-semibold text-gray-500 hover:text-gray-700" @click="emit('skip')">
            Turu geç
          </button>
          <button
            v-if="actionLabel"
            type="button"
            class="px-4 py-2 rounded-lg bg-primary text-white text-sm font-bold transition-opacity"
            :class="actionDisabled ? 'opacity-40 cursor-not-allowed' : 'hover:brightness-105 cursor-pointer'"
            :disabled="actionDisabled"
            @click="emit('action')"
          >
            {{ actionLabel }}
          </button>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue';

const props = defineProps({
  /** Vurgulanacak öğenin CSS seçicisi (ör. `[data-tour="cp-cars"]`) */
  target: { type: String, required: true },
  /** Adım değişince kaydırma yeniden yapılır */
  stepKey: { type: String, required: true },
  stepLabel: { type: String, default: '' },
  title: { type: String, required: true },
  body: { type: String, required: true },
  actionLabel: { type: String, default: '' },
  actionDisabled: { type: Boolean, default: false },
});
const emit = defineEmits(['skip', 'action']);

const PAD = 6;
const hole = ref(null);
const tipRef = ref(null);
const tipH = ref(180);
let scrolledFor = null;
let timer = null;

function measure() {
  const el = document.querySelector(props.target);
  if (!el) {
    hole.value = null;
    return;
  }
  const r = el.getBoundingClientRect();
  if (r.width === 0 && r.height === 0) {
    hole.value = null;
    return;
  }
  if (scrolledFor !== props.stepKey) {
    scrolledFor = props.stepKey;
    // Tooltip için alan bırak: hedef görünmüyorsa ortala
    if (r.top < 80 || r.bottom > window.innerHeight - 220) {
      el.scrollIntoView({ block: 'center', behavior: 'smooth' });
    }
  }
  const left = Math.max(0, r.left - PAD);
  const top = Math.max(0, r.top - PAD);
  hole.value = {
    left,
    top,
    width: Math.min(window.innerWidth - left, r.width + PAD * 2),
    height: Math.min(window.innerHeight - top, r.height + PAD * 2),
  };
  if (tipRef.value) tipH.value = tipRef.value.offsetHeight || tipH.value;
}

const tipStyle = computed(() => {
  const h = hole.value;
  if (!h) return {};
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  const width = Math.min(360, vw - 32);
  const center = h.left + h.width / 2;
  const left = Math.min(Math.max(16, center - width / 2), vw - width - 16);
  const below = h.top + h.height + 12 + tipH.value < vh - 8;
  const top = below ? h.top + h.height + 12 : Math.max(8, h.top - 12 - tipH.value);
  return { left: `${left}px`, top: `${top}px`, width: `${width}px` };
});

watch(
  () => [props.target, props.stepKey],
  () => {
    hole.value = null;
    measure();
  }
);

onMounted(() => {
  measure();
  timer = setInterval(measure, 200);
  window.addEventListener('resize', measure);
  window.addEventListener('scroll', measure, true);
});

onBeforeUnmount(() => {
  clearInterval(timer);
  window.removeEventListener('resize', measure);
  window.removeEventListener('scroll', measure, true);
});
</script>

<style scoped>
.coach-mark {
  position: fixed;
  inset: 0;
  z-index: 1000;
  pointer-events: none;
}
.coach-dim {
  position: fixed;
  background: rgba(15, 23, 42, 0.62);
  pointer-events: auto;
}
.coach-ring {
  position: fixed;
  border: 2px solid #fff;
  border-radius: 14px;
  box-shadow: 0 0 0 4px rgba(0, 160, 174, 0.45), 0 0 24px rgba(0, 160, 174, 0.6);
  pointer-events: none;
  transition: all 0.15s ease-out;
}
.coach-tip {
  position: fixed;
  pointer-events: auto;
  background: #fff;
  border-radius: 16px;
  padding: 16px;
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.22);
}
</style>
