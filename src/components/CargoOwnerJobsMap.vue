<template>
  <section class="relative flex-1 min-h-[560px] rounded-2xl overflow-hidden border border-gray-200 bg-white shadow-sm">
    <div ref="mapEl" class="absolute inset-0 z-0" />

    <!-- Üst bilgi şeridi -->
    <div class="absolute top-3 left-3 right-3 z-10 flex flex-wrap items-start justify-between gap-2 pointer-events-none">
      <div class="pointer-events-auto rounded-xl bg-white/95 backdrop-blur px-4 py-2.5 shadow-md border border-gray-100">
        <p class="text-sm font-bold text-gray-900">Araçlarım nerede?</p>
        <p class="text-xs text-gray-500">
          <template v-if="loading && !items.length">Yükleniyor…</template>
          <template v-else-if="loadError">İlanlar yüklenemedi</template>
          <template v-else>{{ jobCount }} aktif iş · {{ listingCount }} teklif bekleyen ilan</template>
        </p>
      </div>
      <div
        class="pointer-events-auto flex flex-wrap items-center gap-3 rounded-xl bg-white/95 backdrop-blur px-3 py-2 shadow-md border border-gray-100 text-[11px] text-gray-600"
        :class="{ 'lg:mr-[21rem]': selected }"
      >
        <span class="flex items-center gap-1.5"><span class="w-2.5 h-2.5 rounded-full bg-secondary"></span>Araç (anlık konum)</span>
        <span class="flex items-center gap-1.5"><span class="w-2.5 h-2.5 rounded-full bg-amber-500"></span>Teklif bekleyen yük</span>
        <span v-if="selected" class="flex items-center gap-1.5"><span class="w-2.5 h-2.5 rounded-full bg-gray-800"></span>Teslim</span>
        <button
          type="button"
          class="ml-1 w-7 h-7 rounded-lg hover:bg-gray-100 flex items-center justify-center cursor-pointer"
          aria-label="Tümünü göster"
          title="Tümünü göster"
          @click="fitAll"
        >
          <i class="pi pi-expand text-xs"></i>
        </button>
        <button
          type="button"
          class="w-7 h-7 rounded-lg hover:bg-gray-100 flex items-center justify-center cursor-pointer"
          aria-label="Yenile"
          title="Yenile"
          @click="load"
        >
          <i class="pi pi-refresh text-xs" :class="{ 'pi-spin': loading }"></i>
        </button>
      </div>
    </div>

    <!-- Hiç ilan yoksa -->
    <div
      v-if="!loading && !loadError && !items.length"
      class="absolute inset-0 z-10 flex items-center justify-center pointer-events-none"
    >
      <div class="pointer-events-auto rounded-2xl bg-white/95 backdrop-blur px-6 py-5 shadow-lg border border-gray-100 text-center max-w-xs">
        <span class="mx-auto w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center">
          <i class="pi pi-map text-xl"></i>
        </span>
        <p class="mt-3 text-sm font-semibold text-gray-900">Haritada gösterilecek ilanın yok</p>
        <p class="mt-1 text-xs text-gray-500">Yayındaki ilanların ve yoldaki işlerin burada görünür.</p>
        <RouterLink
          to="/cargo-owner/posts"
          class="mt-3 inline-block px-4 py-2 rounded-lg bg-primary text-white text-xs font-semibold hover:bg-primary/90"
        >İlanlarıma git</RouterLink>
      </div>
    </div>

    <!-- Sağ detay paneli (kapatılabilir) -->
    <Transition name="detail-panel">
      <aside
        v-if="selected"
        class="absolute z-20 top-3 right-3 left-3 sm:left-auto sm:w-80 bottom-[124px] flex flex-col rounded-2xl bg-white shadow-xl border border-gray-200 overflow-hidden"
        role="dialog"
        aria-label="İlan detayı"
      >
        <div class="shrink-0 px-4 py-3 border-b border-gray-100 flex items-start justify-between gap-3">
          <div class="min-w-0">
            <span
              class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold"
              :class="statusMeta(selected).cls"
            >
              <i :class="['pi', statusMeta(selected).icon, 'text-[10px]']"></i>{{ statusMeta(selected).label }}
            </span>
            <h3 class="mt-1.5 text-sm font-bold text-gray-900 leading-snug">{{ cityOf(selected.from) }} → {{ cityOf(selected.to) }}</h3>
          </div>
          <button
            type="button"
            class="shrink-0 w-8 h-8 rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-700 flex items-center justify-center cursor-pointer"
            aria-label="Kapat"
            @click="closeDetail"
          >
            <i class="pi pi-times text-sm"></i>
          </button>
        </div>

        <div class="flex-1 min-h-0 overflow-y-auto px-4 py-4 flex flex-col gap-4 text-sm">
          <!-- Güzergah -->
          <ol class="relative flex flex-col gap-3 pl-6">
            <span class="absolute left-[7px] top-2 bottom-2 w-0.5 bg-gray-200" aria-hidden="true"></span>
            <li class="relative">
              <span
                class="absolute -left-6 top-1 w-4 h-4 rounded-full border-[3px] border-white shadow"
                :class="selected.kind === 'job' ? 'bg-primary' : 'bg-amber-500'"
              ></span>
              <p class="text-[11px] text-gray-500">Yükleme</p>
              <p class="font-semibold text-gray-900">{{ selected.from || '—' }}</p>
              <p v-if="selected.departure_date || selected.departure_time" class="text-xs text-gray-500">
                <i class="pi pi-calendar text-[10px]"></i>
                {{ [selected.departure_date, shortTime(selected.departure_time)].filter(Boolean).join(' · ') }}
              </p>
            </li>
            <li class="relative">
              <span class="absolute -left-6 top-1 w-4 h-4 rounded-full bg-gray-800 border-[3px] border-white shadow"></span>
              <p class="text-[11px] text-gray-500">Teslim</p>
              <p class="font-semibold text-gray-900">{{ selected.to || '—' }}</p>
              <p v-if="selected.time_arrival" class="text-xs text-gray-500">
                <i class="pi pi-clock text-[10px]"></i> {{ shortTime(selected.time_arrival) }}
              </p>
            </li>
          </ol>

          <!-- Aktif iş: taşıyıcı, araç, ilerleme -->
          <template v-if="selected.kind === 'job'">
            <div class="rounded-xl bg-gray-50 border border-gray-100 p-3 flex items-center gap-3">
              <img
                v-if="selected.driver?.image"
                :src="selected.driver.image"
                :alt="selected.driver?.name"
                class="w-10 h-10 rounded-full object-cover shrink-0"
              />
              <span v-else class="w-10 h-10 rounded-full bg-primary/15 text-primary font-bold flex items-center justify-center shrink-0">
                {{ (selected.driver?.name || '?')[0] }}
              </span>
              <div class="min-w-0">
                <p class="text-[11px] text-gray-500">Taşıyıcı</p>
                <p class="font-semibold text-gray-900 truncate">{{ selected.driver?.name || 'Taşıyıcı' }}</p>
              </div>
            </div>
            <div v-if="selected.car" class="flex items-center gap-3">
              <img v-if="selected.car.image" :src="selected.car.image" :alt="selected.car.name" class="w-16 h-12 object-contain shrink-0" />
              <div class="min-w-0">
                <p class="text-[11px] text-gray-500">Araç</p>
                <p class="font-semibold text-gray-900 truncate">
                  {{ selected.car.name }}<template v-if="selected.car.detail"> / {{ selected.car.detail }}</template>
                </p>
              </div>
            </div>
            <div>
              <div class="flex items-center justify-between text-xs text-gray-600 mb-1">
                <span>{{ selected.started_at ? (selected.current_city ? `${selected.current_city} civarında` : 'Yolda') : 'Henüz yola çıkmadı' }}</span>
                <span class="font-semibold">%{{ Math.round(selected.progress || 0) }}</span>
              </div>
              <div class="h-2 rounded-full bg-gray-100 overflow-hidden">
                <div class="h-full bg-primary rounded-full" :style="{ width: `${Math.round(selected.progress || 0)}%` }"></div>
              </div>
            </div>
          </template>

          <!-- Teklif bekleyen ilan -->
          <template v-else>
            <div v-if="selected.vehicles?.length">
              <p class="text-[11px] text-gray-500 mb-1">Araçlar</p>
              <div class="flex flex-wrap gap-1.5">
                <span
                  v-for="v in selected.vehicles"
                  :key="v"
                  class="px-2 py-1 rounded-lg bg-gray-100 text-xs font-medium text-gray-700"
                >{{ v }}</span>
              </div>
            </div>
            <div class="rounded-xl bg-amber-50 border border-amber-100 p-3 flex items-center gap-3">
              <span class="w-10 h-10 rounded-full bg-amber-500 text-white font-bold flex items-center justify-center shrink-0">
                {{ selected.requests_count }}
              </span>
              <p class="text-xs text-amber-800">
                {{ selected.requests_count ? 'teklif geldi. İlanı açıp teklifleri inceleyebilirsin.' : 'Henüz teklif gelmedi.' }}
              </p>
            </div>
          </template>

          <dl class="grid grid-cols-2 gap-3 text-xs">
            <div v-if="selected.weight">
              <dt class="text-gray-500">Ağırlık</dt>
              <dd class="font-semibold text-gray-900">{{ selected.weight }}</dd>
            </div>
            <div>
              <dt class="text-gray-500">Fiyat</dt>
              <dd class="font-semibold text-gray-900">{{ selected.amount ? formatTl(selected.amount) : 'Görüşülecek' }}</dd>
            </div>
          </dl>
        </div>

        <div class="shrink-0 p-3 border-t border-gray-100">
          <RouterLink
            :to="`/product/${selected.slug}`"
            class="block w-full text-center px-4 py-2.5 rounded-lg bg-primary text-white text-sm font-semibold hover:bg-primary/90"
          >İlanı aç</RouterLink>
        </div>
      </aside>
    </Transition>

    <!-- Alt ilan karuseli: tıklayınca haritada o ilana yakınlaşır ve detay açılır -->
    <div v-if="items.length" class="absolute bottom-3 left-3 right-3 z-10 flex gap-2 overflow-x-auto pb-1">
      <button
        v-for="it in items"
        :key="it.key"
        type="button"
        class="shrink-0 w-64 text-left rounded-xl bg-white/95 backdrop-blur px-3 py-2.5 shadow-md border-2 transition-colors cursor-pointer"
        :class="selectedKey === it.key ? 'border-primary' : 'border-transparent hover:border-primary/40'"
        @click="select(it)"
      >
        <div class="flex items-center justify-between gap-2">
          <p class="text-xs font-semibold text-gray-900 truncate">{{ cityOf(it.from) }} → {{ cityOf(it.to) }}</p>
          <span class="shrink-0 px-1.5 py-0.5 rounded-full text-[10px] font-semibold" :class="statusMeta(it).cls">
            {{ statusMeta(it).short }}
          </span>
        </div>
        <template v-if="it.kind === 'job'">
          <p class="mt-0.5 text-[11px] text-gray-500 truncate">
            {{ it.driver?.name ?? 'Taşıyıcı' }}<template v-if="it.car?.name"> · {{ it.car.name }}</template>
          </p>
          <div class="mt-2 flex items-center gap-2">
            <div class="flex-1 h-1.5 rounded-full bg-gray-100 overflow-hidden">
              <div class="h-full bg-primary rounded-full" :style="{ width: `${Math.round(it.progress || 0)}%` }"></div>
            </div>
            <span class="text-[11px] font-semibold text-gray-600">%{{ Math.round(it.progress || 0) }}</span>
          </div>
        </template>
        <template v-else>
          <p class="mt-0.5 text-[11px] text-gray-500 truncate">{{ (it.vehicles || []).join(', ') || 'Araç seçilmedi' }}</p>
          <p class="mt-2 text-[11px] font-semibold text-amber-700">
            <i class="pi pi-tags text-[10px]"></i> {{ it.requests_count }} teklif
            <span v-if="it.departure_date" class="ml-2 font-normal text-gray-500">{{ it.departure_date }}</span>
          </p>
        </template>
      </button>
    </div>
  </section>
</template>

<script setup>
/**
 * Yük sahibi Genel Bakış: yoldaki işler + teklif bekleyen (yayındaki) tüm ilanlar haritada.
 * Karuseldeki ya da haritadaki bir ilana tıklanınca o ilana yakınlaşır ve sağda kapatılabilir detay paneli açılır.
 * Veri: GET /shipments/active-routes → routes (aktif işler), listings (teklif bekleyen ilanlar).
 */
import { computed, onBeforeUnmount, onMounted, ref } from 'vue';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import api from '@/api';

const mapEl = ref(null);
const items = ref([]);
const loading = ref(true);
const loadError = ref(false);
const selectedKey = ref(null);

const selected = computed(() => items.value.find((i) => i.key === selectedKey.value) ?? null);
const jobCount = computed(() => items.value.filter((i) => i.kind === 'job').length);
const listingCount = computed(() => items.value.filter((i) => i.kind === 'listing').length);

let map = null;
let layer = null;
/** Seçili ilanın rota katmanı */
let routeLayer = null;
let allBounds = null;
let refreshTimer = null;
/** Yalnızca ilk yüklemede tüm ilanlara sığdır; periyodik yenilemede kullanıcının görünümünü bozma */
let fitted = false;

const TURKEY_CENTER = [39.0, 35.2];
const PRIMARY = '#00A0AE';
const SECONDARY = '#FF4F6D';
const AMBER = '#F59E0B';
const DARK = '#1f2937';

const dot = (color, size = 16) =>
  L.divIcon({
    className: '',
    html: `<span style="display:block;width:${size}px;height:${size}px;border-radius:50%;background:${color};border:3px solid #fff;box-shadow:0 1px 4px rgba(0,0,0,.35);cursor:pointer"></span>`,
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
  });

const truckIcon = L.divIcon({
  className: '',
  html: `<span style="display:flex;align-items:center;justify-content:center;width:36px;height:36px;border-radius:50%;background:${SECONDARY};border:3px solid #fff;box-shadow:0 2px 6px rgba(0,0,0,.35);color:#fff;cursor:pointer"><i class="pi pi-truck" style="font-size:14px"></i></span>`,
  iconSize: [36, 36],
  iconAnchor: [18, 18],
});

const packageIcon = L.divIcon({
  className: '',
  html: `<span style="display:flex;align-items:center;justify-content:center;width:32px;height:32px;border-radius:50%;background:${AMBER};border:3px solid #fff;box-shadow:0 2px 6px rgba(0,0,0,.35);color:#fff;cursor:pointer"><i class="pi pi-box" style="font-size:13px"></i></span>`,
  iconSize: [32, 32],
  iconAnchor: [16, 16],
});

const ll = (p) => (p && p.lat != null && p.lng != null ? [Number(p.lat), Number(p.lng)] : null);

function cityOf(label) {
  return String(label ?? '').split(' / ')[0] || '—';
}

function shortTime(t) {
  return t ? String(t).slice(0, 5) : '';
}

function formatTl(v) {
  return `${Number(v).toLocaleString('tr-TR', { maximumFractionDigits: 0 })} ₺`;
}

function statusMeta(it) {
  if (it.kind === 'listing') {
    return { label: 'Teklif bekliyor', short: 'Teklif bekliyor', icon: 'pi-hourglass', cls: 'bg-amber-100 text-amber-800' };
  }
  if (it.started_at) return { label: 'Yolda', short: 'Yolda', icon: 'pi-send', cls: 'bg-primary/10 text-primary' };
  return { label: 'Taşıyıcı belli · yola çıkmadı', short: 'Başlamadı', icon: 'pi-clock', cls: 'bg-gray-100 text-gray-700' };
}

/** OSRM ile yol çizgisi; olmazsa düz çizgi */
const routeCache = new Map();
async function routeLine(a, b) {
  const key = `${a.join(',')};${b.join(',')}`;
  if (routeCache.has(key)) return routeCache.get(key);
  let line = [a, b];
  try {
    const url = `https://router.project-osrm.org/route/v1/driving/${a[1]},${a[0]};${b[1]},${b[0]}?overview=simplified&geometries=geojson`;
    const coords = (await (await fetch(url)).json())?.routes?.[0]?.geometry?.coordinates;
    if (Array.isArray(coords) && coords.length > 1) line = coords.map(([lng, lat]) => [lat, lng]);
  } catch (_) {
    /* düz çizgi */
  }
  routeCache.set(key, line);
  return line;
}

/** Bir ilanın nokta listesi (rota çizgisi henüz yoksa uç noktalar) */
function pointsOf(it) {
  const pts = [ll(it.from_point), ll(it.to_point)].filter(Boolean);
  if (it.kind === 'job') {
    const v = ll(it.live_point) ?? ll(it.from_point);
    if (v) pts.push(v);
  }
  return pts;
}

/** Haritadaki konum işareti: aktif işte araç (anlık konum; yola çıkmadıysa yükleme noktası), bekleyen ilanda yük */
function positionOf(it) {
  return it.kind === 'job' ? ll(it.live_point) ?? ll(it.from_point) : ll(it.from_point);
}

/** İlk görünüm: yalnızca araçların / yüklerin anlık yerleri */
function draw() {
  if (!map) return;
  layer.clearLayers();
  const all = [];
  for (const it of items.value) {
    const p = positionOf(it);
    if (!p) continue;
    const icon = it.kind === 'job' ? truckIcon : packageIcon;
    L.marker(p, { icon, zIndexOffset: it.kind === 'job' ? 1000 : 0 })
      .addTo(layer)
      .bindTooltip(`${cityOf(it.from)} → ${cityOf(it.to)}`, { direction: 'top', offset: [0, -16] })
      .on('click', () => select(it));
    all.push(p);
  }
  allBounds = all.length ? L.latLngBounds(all) : null;
  if (allBounds && !fitted) {
    map.fitBounds(allBounds, { paddingTopLeft: [40, 90], paddingBottomRight: [40, 140], maxZoom: 9 });
    fitted = true;
  }
  if (selected.value) void drawRoute(selected.value, false);
}

/** Seçilen ilanın nereden nereye gittiği: yükleme / teslim noktası + yol çizgisi */
let routeToken = 0;
async function drawRoute(it, fly = true) {
  if (!map) return;
  const token = ++routeToken;
  routeLayer.clearLayers();
  const a = ll(it.from_point);
  const b = ll(it.to_point);
  const color = it.kind === 'job' ? PRIMARY : AMBER;
  const pts = pointsOf(it);
  if (a) L.marker(a, { icon: dot(color) }).addTo(routeLayer).bindTooltip(`Yükleme: ${it.from}`);
  if (b) L.marker(b, { icon: dot(DARK) }).addTo(routeLayer).bindTooltip(`Teslim: ${it.to}`);
  const wide = mapEl.value?.clientWidth >= 640;
  const opts = { paddingTopLeft: [40, 90], paddingBottomRight: [wide ? 360 : 40, 150], maxZoom: 10, duration: 0.8 };
  if (fly && pts.length) map.flyToBounds(L.latLngBounds(pts), opts);
  if (a && b) {
    const line = await routeLine(a, b);
    if (!map || token !== routeToken) return;
    L.polyline(line, { color, weight: 5, opacity: 0.85, dashArray: it.kind === 'job' ? null : '8 8' }).addTo(routeLayer);
  }
}

async function load() {
  loading.value = true;
  try {
    const res = await api.get('/shipments/active-routes');
    const content = res.data?.content ?? {};
    items.value = [
      ...(content.routes ?? []).map((r) => ({ ...r, kind: 'job', key: `job-${r.shipment_id}` })),
      ...(content.listings ?? []).map((l) => ({ ...l, kind: 'listing', key: `listing-${l.shipment_id}` })),
    ];
    if (selectedKey.value && !selected.value) closeDetail();
    loadError.value = false;
    draw();
  } catch (_) {
    loadError.value = true;
  } finally {
    loading.value = false;
  }
}

/** Araca / karta tıklanınca: o ilanın rotasını göster, yakınlaş ve detayı aç */
function select(it) {
  selectedKey.value = it.key;
  void drawRoute(it);
}

function closeDetail() {
  selectedKey.value = null;
  routeToken++;
  routeLayer?.clearLayers();
}

function fitAll() {
  closeDetail();
  if (allBounds && map) {
    map.flyToBounds(allBounds, { paddingTopLeft: [40, 90], paddingBottomRight: [40, 140], maxZoom: 9, duration: 0.8 });
  }
}

function onKeydown(e) {
  if (e.key === 'Escape' && selectedKey.value) closeDetail();
}

onMounted(() => {
  map = L.map(mapEl.value, { zoomControl: true, attributionControl: true }).setView(TURKEY_CENTER, 6);
  map.zoomControl.setPosition('bottomleft');
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 18,
    attribution: '&copy; OpenStreetMap',
  }).addTo(map);
  routeLayer = L.layerGroup().addTo(map);
  layer = L.layerGroup().addTo(map);
  // Kapsayıcı boyutu flex ile sonradan belirleniyor
  setTimeout(() => map?.invalidateSize(), 100);
  window.addEventListener('keydown', onKeydown);
  void load();
  // Araç konumları için 60 sn'de bir yenile
  refreshTimer = setInterval(() => {
    if (document.visibilityState === 'visible') void load();
  }, 60000);
});

onBeforeUnmount(() => {
  clearInterval(refreshTimer);
  window.removeEventListener('keydown', onKeydown);
  map?.remove();
  map = null;
});
</script>

<style scoped>
.detail-panel-enter-active,
.detail-panel-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}
.detail-panel-enter-from,
.detail-panel-leave-to {
  opacity: 0;
  transform: translateX(16px);
}
</style>
