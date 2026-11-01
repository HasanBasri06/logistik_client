<template>
  <!-- Araç sahibinin aktif işi: tüm ekran primary → secondary gradient çerçeve içinde -->
  <div class="active-job-frame flex-1 min-h-0 p-[5px] sm:p-1.5">
    <div class="h-full overflow-y-auto rounded-[18px] sm:rounded-3xl bg-white">
      <div class="mx-auto w-full max-w-3xl px-4 py-6 sm:px-8 sm:py-10">
        <!-- Üst şerit -->
        <div class="flex flex-wrap items-center justify-between gap-3">
          <span class="inline-flex items-center gap-2 rounded-full bg-secondary/10 px-3 py-1.5 text-xs font-bold uppercase tracking-wide text-secondary">
            <span class="relative flex h-2 w-2">
              <span class="absolute inline-flex h-full w-full animate-ping rounded-full bg-secondary opacity-60"></span>
              <span class="relative inline-flex h-2 w-2 rounded-full bg-secondary"></span>
            </span>
            Aktif İş · Yolda
          </span>
        </div>

        <!-- Rota -->
        <h1 class="mt-6 text-2xl sm:text-4xl font-extrabold tracking-tight text-gray-900">
          {{ city(job.from) }}
          <span class="bg-linear-to-r from-primary to-secondary bg-clip-text text-transparent">→</span>
          {{ city(job.to) }}
        </h1>
        <p class="mt-1.5 text-sm text-gray-500">{{ job.from }} — {{ job.to }}</p>

        <!-- İlerleme: şehirler çizgilerin üstünden sağa yukarı -->
        <div class="mt-8 pr-14">
          <div class="relative h-12" :aria-label="`${city(job.from)} → ${city(job.to)}`">
            <span
              v-for="label in labels"
              :key="label.key"
              class="absolute bottom-1 origin-bottom-left -rotate-35 whitespace-nowrap text-[11px] leading-none"
              :class="label.end ? 'font-extrabold text-gray-900' : label.pos <= progress ? 'font-semibold text-primary' : 'font-semibold text-gray-400'"
              :style="{ left: `${label.pos}%` }"
            >
              {{ label.name }}
            </span>
          </div>
          <div class="relative h-3 rounded-full bg-gray-100">
            <div class="absolute inset-y-0 left-0 rounded-full bg-linear-to-r from-primary to-secondary" :style="{ width: `${progress}%` }" />
            <span
              v-for="label in labels.filter((l) => !l.end)"
              :key="`tick-${label.key}`"
              class="absolute -top-1.5 -bottom-1.5 w-0.5 -translate-x-1/2 rounded-full"
              :class="label.pos <= progress ? 'bg-primary' : 'bg-gray-300'"
              :style="{ left: `${label.pos}%` }"
            />
            <span class="absolute -top-2 -bottom-2 left-0 w-0.5 rounded-full bg-gray-900" />
            <span class="absolute -top-2 -bottom-2 right-0 w-0.5 rounded-full bg-gray-900" />
            <span
              class="absolute top-1/2 flex h-8 w-8 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-2 border-secondary bg-white text-secondary shadow"
              :style="{ left: `${progress}%` }"
            >
              <Truck class="h-4 w-4" />
            </span>
          </div>
          <p class="mt-3 text-center text-xs font-bold text-secondary">%{{ progress }}</p>
        </div>

        <!-- Bilgi kartları -->
        <div class="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <div v-for="info in infos" :key="info.label" class="rounded-2xl border border-gray-100 bg-gray-50 p-3.5">
            <component :is="info.icon" class="h-4 w-4 text-primary" />
            <p class="mt-2 text-[11px] font-medium text-gray-500">{{ info.label }}</p>
            <p class="mt-0.5 truncate text-sm font-bold text-gray-900" :title="info.value">{{ info.value }}</p>
          </div>
        </div>

        <!-- Yük sahibi -->
        <div v-if="job.owner" class="mt-4 flex items-center gap-3 rounded-2xl border border-gray-100 p-3.5">
          <img v-if="job.owner.image" :src="job.owner.image" alt="" class="h-11 w-11 shrink-0 rounded-full object-cover" />
          <span v-else class="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">
            {{ initials(job.owner.name) }}
          </span>
          <div class="min-w-0 flex-1">
            <p class="text-xs text-gray-500">Yük sahibi</p>
            <p class="truncate text-sm font-bold text-gray-900">{{ job.owner.name }}</p>
          </div>
          <RouterLink
            :to="{ path: `/vehicle-owner/messages/${job.owner.id}`, query: { shipment_id: job.shipment_id } }"
            class="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-4 py-2 text-sm font-semibold text-primary hover:bg-primary/15"
          >
            <MessageCircle class="h-4 w-4" />
            Mesaj
          </RouterLink>
        </div>

        <p v-if="job.explanation" class="mt-4 rounded-2xl bg-gray-50 p-3.5 text-sm leading-relaxed text-gray-700">
          {{ job.explanation }}
        </p>

        <!-- Aksiyonlar -->
        <div class="mt-8 flex flex-col gap-3 sm:flex-row-reverse">
          <button
            type="button"
            class="flex h-[52px] flex-1 items-center justify-center gap-2 rounded-full bg-linear-to-r from-primary to-secondary text-base font-bold text-white shadow-lg shadow-primary/20 transition-opacity hover:opacity-95 disabled:opacity-60"
            :disabled="busy"
            @click="confirm = 'finish'"
          >
            <CheckCircle2 class="h-5 w-5" />
            Teslim Ettim · İşi Bitir
          </button>
          <RouterLink
            :to="`/posts/${job.slug}`"
            class="flex h-[52px] items-center justify-center rounded-full border border-gray-200 px-6 text-sm font-semibold text-gray-700 hover:bg-gray-50"
          >
            İlan detayı
          </RouterLink>
        </div>
        <button
          type="button"
          class="mx-auto mt-4 block text-sm font-semibold text-gray-400 hover:text-red-600 disabled:opacity-50"
          :disabled="busy"
          @click="confirm = 'cancel'"
        >
          Sürüşü iptal et
        </button>
      </div>
    </div>

    <!-- Onay -->
    <Teleport to="body">
      <div v-if="confirm" class="fixed inset-0 z-[90] flex items-center justify-center p-4" role="dialog" aria-modal="true">
        <div class="absolute inset-0 bg-black/40" @click="!busy && (confirm = null)" />
        <div class="relative w-full max-w-sm rounded-2xl bg-white p-6 text-center shadow-xl">
          <h2 class="text-lg font-bold text-gray-900">
            {{ confirm === 'finish' ? 'Yükü teslim ettin mi?' : 'Sürüşü iptal et' }}
          </h2>
          <p class="mt-2 text-sm text-gray-500">
            {{
              confirm === 'finish'
                ? `${city(job.from)} → ${city(job.to)} işi tamamlandı olarak işaretlenecek ve yük sahibine bildirim gidecek.`
                : 'Bu iş iptal edilecek. Bu işlem geri alınamaz.'
            }}
          </p>
          <div class="mt-6 flex gap-2">
            <button type="button" class="h-11 flex-1 rounded-full border border-gray-200 text-sm font-semibold text-gray-700 hover:bg-gray-50" :disabled="busy" @click="confirm = null">
              Vazgeç
            </button>
            <button
              type="button"
              class="h-11 flex-1 rounded-full text-sm font-bold text-white disabled:opacity-60"
              :class="confirm === 'finish' ? 'bg-primary hover:bg-primary-dark' : 'bg-red-600 hover:bg-red-700'"
              :disabled="busy"
              @click="runAction"
            >
              <i v-if="busy" class="pi pi-spin pi-spinner"></i>
              <span v-else>{{ confirm === 'finish' ? 'Evet, bitir' : 'İptal et' }}</span>
            </button>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue';
import { toast } from 'vue-sonner';
import { Banknote, CalendarClock, CheckCircle2, MessageCircle, Package, Truck } from 'lucide-vue-next';
import api from '@/api';

const props = defineProps({
  /** `/vehicle/active-jobs` → jobs */
  jobs: { type: Array, required: true },
});
const emit = defineEmits(['changed']);

const confirm = ref(null);
const busy = ref(false);

// Aynı anda tek aktif iş olur; birden fazla gelirse en güncel olan gösterilir
const job = computed(() => props.jobs[0]);

const city = (place) => String(place ?? '').split(' / ')[0] || '—';

/** Anlık konum henüz yok: işe göre sabit temsili değer (yük sahibi panelindeki ile aynı yöntem) */
const progress = computed(() => {
  const slug = String(job.value?.slug ?? '');
  let h = 0;
  for (let i = 0; i < slug.length; i++) h = (h * 31 + slug.charCodeAt(i)) >>> 0;
  return 15 + (h % 71);
});

/** Nereden (0%) → ara iller (eşit aralık) → nereye (100%) */
const labels = computed(() => {
  const stops = (job.value?.stops ?? []).filter(Boolean);
  return [
    { key: 'from', name: city(job.value.from), pos: 0, end: true },
    ...stops.map((name, i) => ({ key: `stop-${name}`, name, pos: Math.round(((i + 1) / (stops.length + 1)) * 1000) / 10, end: false })),
    { key: 'to', name: city(job.value.to), pos: 100, end: true },
  ];
});

const DEAL_LABELS = { fixed: 'Sabit fiyat', offer: 'Teklif', negotiated: 'Pazarlık' };

const infos = computed(() => {
  const j = job.value;
  const amount =
    j.amount != null
      ? `${Number(j.amount).toLocaleString('tr-TR', { maximumFractionDigits: 0 })} ₺`
      : DEAL_LABELS[j.deal_type] ?? '—';
  const when = [j.departure_date, j.departure_time].filter(Boolean).join(' · ') || '—';
  return [
    { label: 'Yük', value: [j.post_type, j.weight].filter(Boolean).join(' · ') || '—', icon: Package },
    { label: DEAL_LABELS[j.deal_type] ?? 'Ücret', value: amount, icon: Banknote },
    { label: 'Kalkış', value: when, icon: CalendarClock },
    { label: 'Araç', value: [j.car?.name, j.car?.detail].filter(Boolean).join(' / ') || '—', icon: Truck },
  ];
});

const initials = (name) =>
  String(name ?? '?')
    .trim()
    .split(/\s+/)
    .map((w) => w[0])
    .slice(0, 2)
    .join('')
    .toLocaleUpperCase('tr-TR');

async function runAction() {
  const action = confirm.value;
  busy.value = true;
  try {
    await api.post(`/vehicle/orders/${job.value.shipment_id}/${action === 'finish' ? 'finish-drive' : 'cancel-drive'}`);
    toast.success(action === 'finish' ? 'Teslimat tamamlandı. Kolay gelsin!' : 'Sürüş iptal edildi.');
    confirm.value = null;
    emit('changed');
  } catch (err) {
    toast.error(err?.response?.data?.message || 'İşlem tamamlanamadı.');
  } finally {
    busy.value = false;
  }
}
</script>

<style scoped>
/* Ekranın tamamını saran primary → secondary gradient çerçeve */
.active-job-frame {
  background: linear-gradient(135deg, var(--color-primary), var(--color-secondary));
}
</style>
