<template>
  <section class="w-full" aria-labelledby="active-routes-title">
    <div class="flex items-center justify-between gap-3 mb-3">
      <h2 id="active-routes-title" class="text-lg font-bold text-gray-900">Şu anki iş güzergahı</h2>
      <div v-if="pageCount > 1" class="flex items-center gap-2">
        <button
          type="button"
          class="w-9 h-9 rounded-full border border-gray-200 bg-white text-gray-600 flex items-center justify-center hover:border-primary hover:text-primary transition-colors disabled:opacity-40 disabled:hover:border-gray-200 disabled:hover:text-gray-600"
          :disabled="activeIndex === 0"
          aria-label="Önceki iş"
          @click="scrollToIndex(activeIndex - 1)"
        >
          <ChevronLeft class="w-4 h-4" />
        </button>
        <button
          type="button"
          class="w-9 h-9 rounded-full border border-gray-200 bg-white text-gray-600 flex items-center justify-center hover:border-primary hover:text-primary transition-colors disabled:opacity-40 disabled:hover:border-gray-200 disabled:hover:text-gray-600"
          :disabled="activeIndex >= pageCount - 1"
          aria-label="Sonraki iş"
          @click="scrollToIndex(activeIndex + 1)"
        >
          <ChevronRight class="w-4 h-4" />
        </button>
      </div>
    </div>

    <!-- Yükleniyor -->
    <div v-if="loading" class="h-64 rounded-2xl border border-gray-200 bg-white animate-pulse" />

    <!-- İstek başarısız: "iş yok" gibi gösterme -->
    <div
      v-else-if="loadError && !routes.length"
      class="w-full sm:max-w-sm h-56 rounded-2xl border border-gray-200 bg-white flex flex-col items-center justify-center gap-3 text-gray-500"
    >
      <CloudOff class="w-6 h-6 text-gray-400" />
      <span class="text-base font-semibold">İşler yüklenemedi</span>
      <button
        type="button"
        class="px-4 py-2 rounded-lg border border-gray-200 text-sm font-semibold text-primary hover:border-primary transition-colors"
        @click="loadRoutes"
      >
        Tekrar dene
      </button>
    </div>

    <!-- Aktif iş yok -->
    <button
      v-else-if="!routes.length"
      type="button"
      class="w-full sm:max-w-sm h-56 rounded-2xl border-2 border-dotted border-gray-300 bg-white/60 flex flex-col items-center justify-center gap-3 text-gray-500 hover:border-primary hover:text-primary hover:bg-primary/5 transition-colors cursor-pointer"
      @click="postStore.openCreateModal()"
    >
      <span class="w-12 h-12 rounded-2xl bg-gray-100 flex items-center justify-center">
        <Plus class="w-6 h-6" />
      </span>
      <span class="text-base font-semibold">İlanınızı oluşturun</span>
    </button>

    <!-- Karusel -->
    <template v-else>
      <div
        ref="trackRef"
        class="flex gap-4 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        :class="dragging ? 'cursor-grabbing select-none' : 'snap-x snap-mandatory scroll-smooth cursor-grab'"
        @scroll.passive="onScroll"
        @pointerdown="onPointerDown"
        @pointermove="onPointerMove"
        @pointerup="onPointerUp"
        @pointercancel="onPointerUp"
        @dragstart.prevent
      >
        <article
          v-for="r in routes"
          :key="r.slug"
          class="snap-start shrink-0 w-full md:w-[calc((100%-1rem)/2)] rounded-2xl border border-gray-200 bg-white shadow-sm p-4 sm:p-6 flex flex-col gap-5"
        >
          <!-- Güzergah + anlaşma tipi -->
          <div class="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
            <div class="flex items-start gap-3 min-w-0">
              <span class="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                <Route class="w-5 h-5" />
              </span>
              <div class="min-w-0">
                <p class="text-xs font-medium text-gray-500">Nereden → Nereye</p>
                <p class="text-base sm:text-lg font-bold text-gray-900 leading-snug">
                  {{ r.from || '—' }}
                  <ArrowRight class="inline w-4 h-4 mx-1 text-primary align-[-2px]" />
                  {{ r.to || '—' }}
                </p>
              </div>
            </div>
            <div class="shrink-0 sm:text-right">
              <span
                class="inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold"
                :class="dealTypeMeta(r.deal_type).class"
              >
                {{ dealTypeMeta(r.deal_type).label }}
              </span>
              <p v-if="r.amount" class="mt-1 text-lg font-bold text-gray-900">{{ formatTl(r.amount) }}</p>
            </div>
          </div>

          <!-- Araç + şoför -->
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div class="flex items-center gap-3 rounded-xl bg-gray-50 border border-gray-100 p-3">
              <span class="w-16 h-12 shrink-0 rounded-lg bg-white flex items-center justify-center overflow-hidden">
                <img v-if="r.car?.image" :src="r.car.image" :alt="r.car.name" class="w-full h-full object-contain" />
                <Truck v-else class="w-5 h-5 text-gray-400" />
              </span>
              <div class="min-w-0">
                <p class="text-xs text-gray-500">Araç</p>
                <p class="text-sm font-semibold text-gray-900 truncate">
                  {{ r.car ? [r.car.name, r.car.detail].filter(Boolean).join(' / ') : '—' }}
                </p>
              </div>
            </div>
            <div class="flex items-center gap-3 rounded-xl bg-gray-50 border border-gray-100 p-3">
              <img
                v-if="r.driver?.image"
                :src="r.driver.image"
                :alt="r.driver.name"
                class="w-12 h-12 rounded-full object-cover border-2 border-primary/30 shrink-0"
              />
              <span
                v-else
                class="w-12 h-12 rounded-full bg-primary/10 text-primary font-bold flex items-center justify-center shrink-0"
              >
                {{ initials(r.driver?.name) }}
              </span>
              <div class="min-w-0">
                <p class="text-xs text-gray-500">Şoför</p>
                <p class="text-sm font-semibold text-gray-900 truncate">{{ r.driver?.name || '—' }}</p>
              </div>
            </div>
          </div>

          <!-- Anlık ilerleme (şimdilik temsili değer) -->
          <!-- Sağ boşluk: en sağdaki varış şehri sağa yukarı yazıldığında kartın dışına taşmasın -->
          <div class="pr-14">
            <!-- Şehirler: nereden (en sol) → ara iller (eşit aralık) → nereye (en sağ); isim çizginin üstünden sağa yukarı -->
            <div class="relative h-12" :aria-label="`${r.fromCity} → ${r.toCity}`">
              <span
                v-for="label in routeLabels(r)"
                :key="label.key"
                class="absolute bottom-1 origin-bottom-left -rotate-35 whitespace-nowrap text-[10px] leading-none"
                :class="[
                  label.end ? 'font-extrabold text-gray-900' : 'font-semibold',
                  !label.end && (label.pos <= r.progress ? 'text-primary' : 'text-gray-400'),
                ]"
                :style="{ left: `${label.pos}%` }"
              >
                {{ label.name }}
              </span>
            </div>
            <div class="relative h-2.5 rounded-full bg-gray-100">
              <div
                class="absolute inset-y-0 left-0 rounded-full bg-linear-to-r from-primary to-secondary"
                :style="{ width: `${r.progress}%` }"
              />
              <span
                v-for="stop in r.stops"
                :key="`tick-${stop.name}`"
                class="absolute -top-1.5 -bottom-1.5 w-0.5 -translate-x-1/2 rounded-full"
                :class="stop.pos <= r.progress ? 'bg-primary' : 'bg-gray-300'"
                :style="{ left: `${stop.pos}%` }"
                :title="stop.name"
              />
              <!-- Başlangıç / bitiş: çubuğun tam sol ve sağ kenarında çizgi -->
              <span class="absolute -top-2 -bottom-2 left-0 w-0.5 rounded-full bg-gray-900" aria-hidden="true" />
              <span class="absolute -top-2 -bottom-2 right-0 w-0.5 rounded-full bg-gray-900" aria-hidden="true" />
              <span
                class="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-7 h-7 rounded-full bg-white border-2 border-secondary text-secondary flex items-center justify-center shadow"
                :style="{ left: `${r.progress}%` }"
              >
                <Truck class="w-3.5 h-3.5" />
              </span>
            </div>
            <p class="mt-3 text-center text-xs font-bold text-secondary">%{{ r.progress }}</p>
          </div>
        </article>
      </div>

      <div v-if="pageCount > 1" class="mt-3 flex justify-center gap-1.5">
        <button
          v-for="i in pageCount"
          :key="i"
          type="button"
          class="h-2 rounded-full transition-all"
          :class="i - 1 === activeIndex ? 'w-6 bg-primary' : 'w-2 bg-gray-300 hover:bg-gray-400'"
          :aria-label="`${i}. sayfa`"
          :aria-current="i - 1 === activeIndex"
          @click="scrollToIndex(i - 1)"
        />
      </div>
    </template>

    <!-- Kısayol kartları: aktif iş / aktif ilan / yorumlar -->
    <div v-if="stats" class="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-3">
      <RouterLink
        v-for="card in statCards"
        :key="card.key"
        :to="card.to"
        class="group flex items-center gap-3 rounded-2xl border border-gray-200 bg-white p-4 transition-colors hover:border-primary/40 hover:bg-primary/5"
      >
        <span
          class="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl"
          :class="card.accent === 'secondary' ? 'bg-secondary/10 text-secondary' : 'bg-primary/10 text-primary'"
        >
          <component :is="card.icon" class="w-5 h-5" />
        </span>
        <div class="min-w-0 flex-1">
          <p class="text-xs font-medium text-gray-500">{{ card.label }}</p>
          <p class="mt-0.5 flex items-baseline gap-2">
            <span class="text-2xl font-bold text-gray-900 tabular-nums">{{ card.value }}</span>
            <span v-if="card.extra" class="inline-flex items-center gap-1 text-sm font-semibold text-gray-700">
              <Star class="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              {{ card.extra }}
            </span>
          </p>
        </div>
        <ArrowRight class="w-4 h-4 shrink-0 text-gray-300 transition-colors group-hover:text-primary" />
      </RouterLink>
    </div>
  </section>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue';
import { ArrowRight, ChevronLeft, ChevronRight, CloudOff, MessageSquareText, Package, Plus, Route, Star, Truck } from 'lucide-vue-next';
import api from '@/api';
import { getEcho } from '@/echo';
import { useAuthStore } from '@/stores/auth';
import { usePostStore } from '@/stores/post';

const postStore = usePostStore();

const authStore = useAuthStore();
const routes = ref([]);
const loading = ref(true);
const loadError = ref(false);
/** `/shipments/active-routes` → `stats`: { active_jobs, active_listings, reviews_count, reviews_avg } */
const stats = ref(null);

const statCards = computed(() => {
  const s = stats.value;
  if (!s) return [];
  const avg = Number(s.reviews_avg) || 0;
  return [
    { key: 'jobs', label: 'Toplam Aktif İş', value: s.active_jobs ?? 0, icon: Truck, to: '/cargo-owner/posts' },
    { key: 'listings', label: 'Toplam Aktif İlan', value: s.active_listings ?? 0, icon: Package, to: '/cargo-owner/posts' },
    {
      key: 'reviews',
      label: 'Toplam Yorum',
      value: s.reviews_count ?? 0,
      extra: s.reviews_count ? avg.toLocaleString('tr-TR', { minimumFractionDigits: 1, maximumFractionDigits: 1 }) : null,
      icon: MessageSquareText,
      to: '/cargo-owner/reviews',
      accent: 'secondary',
    },
  ];
});
const activeIndex = ref(0);
const trackRef = ref(null);
/** Kartlar arası boşluk (gap-4) */
const CARD_GAP = 16;

/** Web'de (md+) iki kart, dar ekranda tek kart görünür */
const desktopQuery = window.matchMedia('(min-width: 768px)');
const perView = ref(desktopQuery.matches ? 2 : 1);
const onBreakpointChange = (e) => {
  perView.value = e.matches ? 2 : 1;
  scrollToIndex(activeIndex.value);
};
/** Kaydırılabilecek konum sayısı (son konumda son kartlar tam görünür) */
const pageCount = computed(() => Math.max(1, routes.value.length - perView.value + 1));

const DEAL_TYPES = {
  fixed: { label: 'Sabit fiyat', class: 'bg-primary/10 text-primary' },
  offer: { label: 'Teklif ile anlaşıldı', class: 'bg-secondary/10 text-secondary' },
  negotiated: { label: 'Pazarlık', class: 'bg-amber-50 text-amber-700' },
};

function dealTypeMeta(type) {
  return DEAL_TYPES[type] ?? DEAL_TYPES.negotiated;
}

function formatTl(value) {
  return `${Number(value).toLocaleString('tr-TR', { maximumFractionDigits: 0 })} ₺`;
}

function initials(name) {
  const parts = String(name ?? '').trim().split(/\s+/).filter(Boolean);
  return parts.slice(0, 2).map((p) => p[0].toUpperCase()).join('') || '?';
}

/** Araç sahibinin konumuna göre canlı ilerleme (0–100, tam sayı); iş başlamadıysa 0 */
function clampProgress(value) {
  return Math.round(Math.max(0, Math.min(100, Number(value ?? 0) || 0)));
}

/** Bir kartlık kaydırma mesafesi */
function cardStep() {
  const card = trackRef.value?.firstElementChild;
  return card ? card.offsetWidth + CARD_GAP : 0;
}

function onScroll() {
  const el = trackRef.value;
  const step = cardStep();
  if (!el || !step || dragging.value) return;
  activeIndex.value = Math.min(Math.round(el.scrollLeft / step), pageCount.value - 1);
}

function scrollToIndex(index) {
  const el = trackRef.value;
  if (!el) return;
  const target = Math.max(0, Math.min(index, pageCount.value - 1));
  activeIndex.value = target;
  el.scrollTo({ left: target * cardStep(), behavior: 'smooth' });
}

/** Fare ile sürükleyerek kaydırma (dokunmatikte tarayıcının kendi kaydırması kullanılır) */
const dragging = ref(false);
let dragStartX = 0;
let dragStartScroll = 0;

function onPointerDown(e) {
  if (e.pointerType !== 'mouse' || e.button !== 0 || pageCount.value <= 1) return;
  dragging.value = true;
  dragStartX = e.clientX;
  dragStartScroll = trackRef.value.scrollLeft;
  trackRef.value.setPointerCapture(e.pointerId);
}

function onPointerMove(e) {
  if (!dragging.value) return;
  trackRef.value.scrollLeft = dragStartScroll - (e.clientX - dragStartX);
}

function onPointerUp(e) {
  if (!dragging.value) return;
  dragging.value = false;
  trackRef.value.releasePointerCapture?.(e.pointerId);
  const step = cardStep();
  const moved = dragStartScroll - trackRef.value.scrollLeft;
  // Kısa bir sürükleme de bir sonraki/önceki karta geçsin
  const base = Math.round(dragStartScroll / step);
  const next = Math.abs(moved) > step * 0.15 ? base + (moved < 0 ? 1 : -1) : base;
  scrollToIndex(next);
}

onBeforeUnmount(() => desktopQuery.removeEventListener('change', onBreakpointChange));

/** Ara iller → çubuk üzerindeki konum (%): n il için çubuk n+1 eşit parçaya bölünür */
function routeStops(names) {
  const list = Array.isArray(names) ? names.filter(Boolean) : [];
  return list.map((name, i) => ({ name, pos: Math.round(((i + 1) / (list.length + 1)) * 1000) / 10 }));
}

/** Çubuğun üstündeki eğik yazılar: başlangıç (0%), ara iller, varış (100%) */
function routeLabels(r) {
  return [
    { key: 'from', name: r.fromCity, pos: 0, end: true },
    ...r.stops.map((s) => ({ key: `stop-${s.name}`, name: s.name, pos: s.pos, end: false })),
    { key: 'to', name: r.toCity, pos: 100, end: true },
  ].filter((l) => l.name);
}

async function loadRoutes() {
  loading.value = true;
  try {
    const res = await api.get('/shipments/active-routes');
    routes.value = (res.data?.content?.routes ?? []).map((r) => ({
      ...r,
      fromCity: String(r.from ?? '').split(' / ')[0],
      toCity: String(r.to ?? '').split(' / ')[0],
      progress: clampProgress(r.progress),
      stops: routeStops(r.stops),
    }));
    stats.value = res.data?.content?.stats ?? null;
    loadError.value = false;
  } catch (_) {
    loadError.value = true;
  } finally {
    loading.value = false;
  }
}

/**
 * `job.progress` (user.{id} kanalı): araç sahibi ilerledikçe çubuktaki araç anlık hareket eder.
 * Kanal yerine Pusher bağlantısına bağlanır; sayfalardaki `stopListening` bu dinleyiciyi silemez.
 */
let progressPusher = null;
function onJobProgress(payload) {
  const id = Number(payload?.shipment_id);
  routes.value = routes.value.map((r) =>
    (id && Number(r.shipment_id) === id) || (payload?.slug && r.slug === payload.slug)
      ? { ...r, progress: payload?.progress == null ? r.progress : clampProgress(payload.progress), current_city: payload?.current_city ?? r.current_city }
      : r
  );
}
function bindProgress() {
  const userId = authStore.user?.id;
  const echo = getEcho();
  if (!userId || !echo) return;
  echo.private(`user.${userId}`);
  progressPusher = echo.connector?.pusher ?? null;
  progressPusher?.bind('job.progress', onJobProgress);
}

onMounted(() => {
  desktopQuery.addEventListener('change', onBreakpointChange);
  loadRoutes();
  bindProgress();
});
onBeforeUnmount(() => {
  progressPusher?.unbind('job.progress', onJobProgress);
  progressPusher = null;
});
</script>
