<template>
    <Header />
    <div class="h-[calc(100vh-64px)]">
        <div class="flex flex-row w-full h-[calc(100vh-64px)] bg-gray-50">
            <AccountSidebar />
            <div class="flex-1 min-w-0 flex flex-col overflow-y-auto gap-6 p-4 sm:p-6">
                <AccountBreadcrumb class="shrink-0" />

                <!-- Başlık -->
                <div>
                    <h1 class="text-2xl font-bold text-gray-900">Genel Bakış</h1>
                    <p class="text-sm text-gray-500 mt-0.5">Hoş geldin {{ user?.first_name ?? '' }} 👋 Araçlarının ve işlerinin özeti.</p>
                </div>

                <div v-if="loading" class="flex justify-center py-20">
                    <span class="w-8 h-8 border-2 border-gray-200 border-t-primary rounded-full animate-spin"></span>
                </div>

                <template v-else>
                    <!-- Tek kart: üstte büyük araç görseli (oklarla araç değiştirilir), altta mini analiz kartları -->
                    <section class="rounded-2xl bg-white border border-gray-200 shadow-sm overflow-hidden">
                        <div v-if="!vehicles.length" class="flex flex-col items-center justify-center gap-3 py-16 text-center">
                            <span class="w-14 h-14 rounded-full bg-primary/10 text-primary flex items-center justify-center">
                                <i class="pi pi-car text-2xl"></i>
                            </span>
                            <p class="text-sm text-gray-600">Henüz araç eklemedin.</p>
                            <RouterLink to="/vehicle-owner/vehicles" class="px-4 py-2 rounded-lg bg-primary text-white text-sm font-semibold hover:bg-primary/90">Araç ekle</RouterLink>
                        </div>

                        <template v-else-if="selected">
                            <!-- Büyük görsel -->
                            <div class="relative bg-gradient-to-b from-gray-50 to-white px-6 pt-6 pb-3">
                                <!-- Parmakla (kaydırma) ve fareyle (sürükleme) araç değiştirilir -->
                                <div
                                    class="h-56 sm:h-72 lg:h-80 flex items-center justify-center select-none touch-pan-y"
                                    :class="vehicles.length > 1 ? (dragging ? 'cursor-grabbing' : 'cursor-grab') : ''"
                                    @pointerdown="onDragStart"
                                    @pointermove="onDragMove"
                                    @pointerup="onDragEnd"
                                    @pointercancel="onDragCancel"
                                    @pointerleave="onDragEnd"
                                >
                                    <img
                                        v-if="selected.image"
                                        :key="selected.id"
                                        :src="selected.image"
                                        :alt="selected.name"
                                        draggable="false"
                                        class="max-h-full w-full max-w-3xl object-contain pointer-events-none"
                                        :class="dragging ? '' : 'transition-transform duration-300 ease-out'"
                                        :style="{ transform: `translateX(${dragX}px)`, opacity: 1 - Math.min(Math.abs(dragX) / 600, 0.4) }"
                                    />
                                    <i v-else class="pi pi-truck text-7xl text-gray-300"></i>
                                </div>
                                <button
                                    v-if="vehicles.length > 1"
                                    type="button"
                                    class="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white shadow-md border border-gray-200 flex items-center justify-center text-gray-700 hover:bg-gray-50 disabled:opacity-30 cursor-pointer"
                                    :disabled="selectedIndex === 0"
                                    aria-label="Önceki araç"
                                    @click="select(selectedIndex - 1)"
                                ><i class="pi pi-chevron-left text-sm"></i></button>
                                <button
                                    v-if="vehicles.length > 1"
                                    type="button"
                                    class="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white shadow-md border border-gray-200 flex items-center justify-center text-gray-700 hover:bg-gray-50 disabled:opacity-30 cursor-pointer"
                                    :disabled="selectedIndex === vehicles.length - 1"
                                    aria-label="Sonraki araç"
                                    @click="select(selectedIndex + 1)"
                                ><i class="pi pi-chevron-right text-sm"></i></button>
                                <!-- Hangi araçtasın -->
                                <div v-if="vehicles.length > 1" class="mt-2 flex justify-center gap-1.5">
                                    <button
                                        v-for="(v, i) in vehicles"
                                        :key="v.id"
                                        type="button"
                                        class="h-2 rounded-full transition-all cursor-pointer"
                                        :class="i === selectedIndex ? 'w-6 bg-primary' : 'w-2 bg-gray-300 hover:bg-gray-400'"
                                        :aria-label="(v.name || 'Araç') + ' ' + (v.plate || '')"
                                        @click="select(i)"
                                    />
                                </div>
                            </div>

                            <!-- Araç adı / plaka -->
                            <div class="flex flex-wrap items-center justify-between gap-3 px-5 sm:px-6 py-4 border-t border-gray-100">
                                <div class="min-w-0">
                                    <h2 class="text-xl font-bold text-gray-900 truncate">{{ selected.name || 'Araç' }}</h2>
                                    <p class="text-sm text-gray-500 truncate">{{ selected.detail || '—' }}</p>
                                </div>
                                <div class="flex items-center gap-3">
                                    <span v-if="selected.plate" class="inline-flex items-stretch h-[30px] border-2 border-slate-900 rounded overflow-hidden bg-white">
                                        <span class="flex items-center px-1.5 bg-[#003399] text-white text-[10px] font-extrabold">TR</span>
                                        <span class="flex items-center px-2 text-xs font-black text-slate-900 tracking-wider">{{ selected.plate }}</span>
                                    </span>
                                    <RouterLink to="/vehicle-owner/vehicles" class="text-sm font-semibold text-primary hover:underline">Araçları yönet</RouterLink>
                                </div>
                            </div>

                            <!-- Mini analiz kartları -->
                            <div class="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3 px-5 sm:px-6 pb-6">
                                <div
                                    v-for="m in selectedTiles"
                                    :key="m.key"
                                    class="rounded-xl p-3.5"
                                    :class="m.highlight ? 'bg-primary text-white' : 'bg-gray-50 border border-gray-100'"
                                >
                                    <div class="flex items-center gap-1.5 text-[11px] font-semibold" :class="m.highlight ? 'text-white/80' : 'text-gray-500'">
                                        <i :class="['pi', m.icon, 'text-xs', m.highlight ? '' : m.iconColor]"></i>{{ m.label }}
                                    </div>
                                    <p class="mt-1 text-xl font-extrabold leading-tight" :class="m.highlight ? 'text-white' : 'text-gray-900'">
                                        {{ m.value }}<span v-if="m.unit" class="text-xs font-bold ml-0.5" :class="m.highlight ? 'text-white/80' : 'text-gray-400'">{{ m.unit }}</span>
                                    </p>
                                </div>
                            </div>

                            <p v-if="selected.stats.km_missing_jobs" class="px-5 sm:px-6 -mt-3 pb-5 text-xs text-gray-400">
                                <i class="pi pi-info-circle mr-1"></i>{{ selected.stats.km_missing_jobs }} eski işin mesafesi kayıtlı olmadığı için km toplamına eklenmedi.
                            </p>
                        </template>
                    </section>
                </template>
            </div>
        </div>
    </div>
</template>

<script setup>
/**
 * Araç sahibi Genel Bakış: genel toplamlar, araçlar (karusel) ve seçili aracın istatistikleri.
 * Veri: GET /vehicle/stats (tamamlanan işler, ilan mesafelerinden toplam km, yoldaki / bekleyen işler).
 */
import { computed, onMounted, ref } from 'vue';
import { storeToRefs } from 'pinia';
import Header from './components/Header.vue';
import AccountSidebar from './components/AccountSidebar.vue';
import AccountBreadcrumb from '@/components/AccountBreadcrumb.vue';
import { useAuthStore } from '@/stores/auth';
import api from './api';
import { vehicleImageUrl } from '@/lib/catalog-assets';

const { user } = storeToRefs(useAuthStore());

const loading = ref(true);
const vehicles = ref([]);
const totals = ref(null);
const selectedIndex = ref(0);

const selected = computed(() => vehicles.value[selectedIndex.value] ?? null);

const formatKm = (n) => Number(n || 0).toLocaleString('tr-TR', { maximumFractionDigits: 0 });
const avgKm = (s) => {
    const counted = s.completed_jobs - (s.km_missing_jobs || 0);
    return counted > 0 ? s.total_km / counted : 0;
};


/** Seçili aracın mini analiz kartları */
const selectedTiles = computed(() => {
    const v = selected.value;
    if (!v) return [];
    const st = v.stats;
    return [
        { key: 'km', label: 'Gidilen yol', value: formatKm(st.total_km), unit: 'km', icon: 'pi-map', highlight: true },
        { key: 'done', label: 'Tamamlanan iş', value: st.completed_jobs, icon: 'pi-check-circle', iconColor: 'text-emerald-500' },
        { key: 'active', label: 'Şu an yolda', value: st.active_jobs, icon: 'pi-send', iconColor: 'text-secondary' },
        { key: 'pending', label: 'Bekleyen iş', value: st.pending_jobs, icon: 'pi-hourglass', iconColor: 'text-amber-500' },
        { key: 'avg', label: 'İş başına ort.', value: st.completed_jobs ? formatKm(avgKm(st)) : '—', unit: st.completed_jobs ? 'km' : '', icon: 'pi-chart-line', iconColor: 'text-primary' },
        { key: 'cap', label: 'Kapasite', value: v.capacity_kg ? formatKm(v.capacity_kg) : '—', unit: v.capacity_kg ? 'kg' : '', icon: 'pi-box', iconColor: 'text-primary' },
    ];
});

/* ---------- Kaydırma: dokunmatik + fare sürükleme ---------- */
/** Bu kadar pikselden fazla sürüklenirse araç değişir */
const SWIPE_THRESHOLD = 60;
const dragging = ref(false);
const dragX = ref(0);
let dragStartX = 0;
let dragPointerId = null;

function onDragStart(e) {
    if (vehicles.value.length < 2) return;
    if (e.pointerType === 'mouse' && e.button !== 0) return;
    dragging.value = true;
    dragStartX = e.clientX;
    dragX.value = 0;
    dragPointerId = e.pointerId;
    e.currentTarget.setPointerCapture?.(e.pointerId);
}

function onDragMove(e) {
    if (!dragging.value || e.pointerId !== dragPointerId) return;
    let dx = e.clientX - dragStartX;
    // İlk / son araçta kenarda direnç
    const atStart = selectedIndex.value === 0 && dx > 0;
    const atEnd = selectedIndex.value === vehicles.value.length - 1 && dx < 0;
    if (atStart || atEnd) dx = dx / 4;
    dragX.value = dx;
}

function onDragEnd(e) {
    if (!dragging.value || (e && e.pointerId !== dragPointerId)) return;
    const dx = dragX.value;
    dragging.value = false;
    dragPointerId = null;
    if (dx <= -SWIPE_THRESHOLD) select(selectedIndex.value + 1);
    else if (dx >= SWIPE_THRESHOLD) select(selectedIndex.value - 1);
    dragX.value = 0;
}

function onDragCancel() {
    dragging.value = false;
    dragPointerId = null;
    dragX.value = 0;
}

/** Seçili aracı değiştirir */
function select(i) {
    if (i < 0 || i >= vehicles.value.length) return;
    selectedIndex.value = i;
}

const emptyStats = () => ({ completed_jobs: 0, total_km: 0, active_jobs: 0, pending_jobs: 0, km_missing_jobs: 0 });
/** İstatistikler alınamadı (ör. sunucu henüz güncellenmedi): araçlar yine gösterilir */
const statsUnavailable = ref(false);

/** Yedek: istatistik ucu yoksa araçları /cars/my'dan al (istatistikler sıfır) */
async function loadVehiclesOnly() {
    const res = await api.get('/cars/my');
    const cars = res.data?.content?.cars ?? [];
    return cars.map((uc) => ({
        id: uc.id,
        name: uc.car?.name,
        detail: uc.car_detail?.value ?? uc.carDetail?.value ?? null,
        plate: uc.plate ?? uc.plaka ?? null,
        capacity_kg: uc.capacity_kg ?? null,
        image: vehicleImageUrl(uc.car_detail?.image || uc.carDetail?.image || uc.car?.image || ''),
        stats: emptyStats(),
    }));
}

onMounted(async () => {
    try {
        const res = await api.get('/vehicle/stats');
        const content = res.data?.content ?? {};
        vehicles.value = Array.isArray(content.vehicles) ? content.vehicles : [];
        totals.value = content.totals ?? null;
    } catch (_) {
        statsUnavailable.value = true;
        try {
            vehicles.value = await loadVehiclesOnly();
        } catch (__) {
            vehicles.value = [];
        }
    } finally {
        // En çok iş yapan araç seçili başlasın
        const best = vehicles.value.reduce((bi, v, i, arr) => (v.stats.completed_jobs > arr[bi].stats.completed_jobs ? i : bi), 0);
        selectedIndex.value = vehicles.value.length ? best : 0;
        loading.value = false;
    }
});
</script>
