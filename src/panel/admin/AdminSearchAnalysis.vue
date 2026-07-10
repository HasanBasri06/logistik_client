<template>
    <div class="rounded-2xl border border-gray-200 bg-white p-6 md:p-8 shadow-sm">
        <h1 class="text-2xl font-bold text-gray-900">Arama Analizleri</h1>
        <p class="mt-2 text-sm text-gray-500">
            Kullanıcıların yaptığı ilan aramalarını ve sonuç sayılarını görüntüleyin.
        </p>

        <div class="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
            <button
                type="button"
                class="rounded-2xl border p-5 text-left shadow-sm transition-colors"
                :class="listingStatusFilter === ''
                    ? 'border-primary bg-primary/5'
                    : 'border-gray-200 bg-white hover:border-gray-300'"
                @click="setListingStatusFilter('')"
            >
                <p class="text-sm text-gray-500">Toplam Arama</p>
                <p class="mt-1 text-2xl font-bold text-gray-900">{{ summary.totalSearches }}</p>
            </button>

            <button
                type="button"
                class="rounded-2xl border p-5 text-left shadow-sm transition-colors"
                :class="listingStatusFilter === 'listed'
                    ? 'border-green-400 bg-green-50'
                    : 'border-gray-200 bg-white hover:border-green-200'"
                @click="setListingStatusFilter('listed')"
            >
                <p class="text-sm text-gray-500">İlan Listelendi</p>
                <p class="mt-1 text-2xl font-bold text-green-700">{{ summary.listedSearches }}</p>
            </button>

            <button
                type="button"
                class="rounded-2xl border p-5 text-left shadow-sm transition-colors"
                :class="listingStatusFilter === 'unlisted'
                    ? 'border-red-400 bg-red-50'
                    : 'border-gray-200 bg-white hover:border-red-200'"
                @click="setListingStatusFilter('unlisted')"
            >
                <p class="text-sm text-gray-500">İlan Listelenmedi</p>
                <p class="mt-1 text-2xl font-bold text-red-700">{{ summary.unlistedSearches }}</p>
            </button>
        </div>

        <div class="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-2">
            <div class="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
                <div class="flex items-center gap-4">
                    <span class="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                        <i class="pi pi-map-marker text-xl" />
                    </span>
                    <div class="min-w-0">
                        <p class="text-sm text-gray-500">En Çok Arama Yapılan Şehir</p>
                        <p class="mt-1 truncate text-xl font-bold text-gray-900">
                            {{ summary.mostSearchedCity?.city || '—' }}
                        </p>
                        <p v-if="summary.mostSearchedCity" class="mt-0.5 text-xs text-gray-400">
                            {{ summary.mostSearchedCity.count }} arama
                        </p>
                    </div>
                </div>
            </div>

            <div class="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
                <div class="flex items-center gap-4">
                    <span class="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-red-50 text-red-600">
                        <i class="pi pi-ban text-xl" />
                    </span>
                    <div class="min-w-0">
                        <p class="text-sm text-gray-500">En Çok 0 Sonuç Dönen Arama</p>
                        <p class="mt-1 truncate text-xl font-bold text-gray-900">
                            {{ searchRouteLabel(summary.mostZeroResultSearch) }}
                        </p>
                        <p v-if="summary.mostZeroResultSearch" class="mt-0.5 text-xs text-gray-400">
                            {{ summary.mostZeroResultSearch.search_count }} kez arandı, sonuç bulunamadı
                        </p>
                    </div>
                </div>
            </div>
        </div>

        <div class="mt-6">
            <input
                v-model="searchQuery"
                type="search"
                placeholder="Şehir, ilçe veya kullanıcı ile ara..."
                class="h-11 w-full max-w-md rounded-lg border border-gray-200 px-4 text-sm text-gray-900 placeholder:text-gray-400 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                @input="onSearchInput"
            />
        </div>

        <div v-if="loading && !records.length" class="mt-10 flex items-center justify-center gap-2 text-sm text-gray-500">
            <i class="pi pi-spin pi-spinner" />
            Yükleniyor...
        </div>

        <div v-else-if="error" class="mt-8 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
            {{ error }}
        </div>

        <div v-else-if="!records.length && !loading" class="mt-10 text-center text-sm text-gray-500">
            Arama kaydı bulunamadı.
        </div>

        <div v-else class="mt-8 overflow-x-auto">
            <p class="mb-4 text-sm text-gray-500">Toplam {{ total }} arama kaydı</p>

            <table class="w-full min-w-[1000px] border-collapse text-left text-sm">
                <thead>
                    <tr class="border-b border-gray-200 text-xs font-semibold uppercase tracking-wide text-gray-500">
                        <th class="px-3 py-3">Kullanıcı</th>
                        <th class="px-3 py-3">Yükleme Şehri</th>
                        <th class="px-3 py-3">Yükleme İlçesi</th>
                        <th class="px-3 py-3">Boşaltma Şehri</th>
                        <th class="px-3 py-3">Boşaltma İlçesi</th>
                        <th class="px-3 py-3">Durum</th>
                        <th class="px-3 py-3">Sonuç Sayısı</th>
                        <th class="px-3 py-3">Tarih</th>
                    </tr>
                </thead>
                <tbody>
                    <tr
                        v-for="record in records"
                        :key="record.id"
                        class="border-b border-gray-100 transition-colors hover:bg-gray-50"
                    >
                        <td class="px-3 py-3 text-gray-900">
                            <div class="font-medium">{{ record.caller_name }}</div>
                            <div class="text-xs text-gray-400">{{ record.caller_phone || '—' }}</div>
                        </td>
                        <td class="px-3 py-3 text-gray-600">{{ record.f_where_city || '—' }}</td>
                        <td class="px-3 py-3 text-gray-600">{{ record.f_where_district || '—' }}</td>
                        <td class="px-3 py-3 text-gray-600">{{ record.t_where_city || '—' }}</td>
                        <td class="px-3 py-3 text-gray-600">{{ record.t_where_district || '—' }}</td>
                        <td class="px-3 py-3">
                            <span
                                class="inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold"
                                :class="record.has_results
                                    ? 'bg-green-50 text-green-700'
                                    : 'bg-red-50 text-red-700'"
                            >
                                {{ record.has_results ? 'Listelendi' : 'Listelenmedi' }}
                            </span>
                        </td>
                        <td class="px-3 py-3">
                            <span class="inline-flex items-center rounded-full bg-primary/10 px-2.5 py-1 text-xs font-semibold text-primary">
                                {{ record.count }}
                            </span>
                        </td>
                        <td class="px-3 py-3 text-gray-600">{{ formatDateTime(record.created_at) }}</td>
                    </tr>
                </tbody>
            </table>

            <nav
                v-if="lastPage > 1"
                class="mt-6 flex flex-wrap items-center justify-between gap-4 border-t border-gray-100 pt-6"
                aria-label="Sayfalama"
            >
                <p class="text-sm text-gray-500">
                    Sayfa {{ currentPage }} / {{ lastPage }}
                </p>
                <div class="flex items-center gap-2">
                    <button
                        type="button"
                        class="inline-flex h-9 items-center rounded-lg border border-gray-200 px-3 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                        :disabled="currentPage <= 1 || loading"
                        @click="goToPage(currentPage - 1)"
                    >
                        Önceki
                    </button>
                    <button
                        v-for="page in visiblePages"
                        :key="page"
                        type="button"
                        class="inline-flex h-9 min-w-9 items-center justify-center rounded-lg border px-3 text-sm font-medium transition-colors"
                        :class="page === currentPage
                            ? 'border-primary bg-primary text-white'
                            : 'border-gray-200 text-gray-700 hover:bg-gray-50'"
                        :disabled="loading"
                        @click="goToPage(page)"
                    >
                        {{ page }}
                    </button>
                    <button
                        type="button"
                        class="inline-flex h-9 items-center rounded-lg border border-gray-200 px-3 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                        :disabled="currentPage >= lastPage || loading"
                        @click="goToPage(currentPage + 1)"
                    >
                        Sonraki
                    </button>
                </div>
            </nav>
        </div>
    </div>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue';
import { useAdminStore } from '@/stores/admin';

const adminStore = useAdminStore();
const PER_PAGE = 15;

const records = ref([]);
const loading = ref(false);
const error = ref('');
const searchQuery = ref('');
const currentPage = ref(1);
const lastPage = ref(1);
const total = ref(0);
const listingStatusFilter = ref('');
const summary = ref({
    mostSearchedCity: null,
    mostZeroResultSearch: null,
    totalSearches: 0,
    listedSearches: 0,
    unlistedSearches: 0,
});
let searchTimer = null;

const visiblePages = computed(() => {
    const pages = [];
    const start = Math.max(1, currentPage.value - 2);
    const end = Math.min(lastPage.value, currentPage.value + 2);
    for (let page = start; page <= end; page += 1) {
        pages.push(page);
    }
    return pages;
});

function searchRouteLabel(item) {
    if (!item) return '—';
    const from = [item.f_where_city, item.f_where_district].filter(Boolean).join(' / ') || '—';
    const to = [item.t_where_city, item.t_where_district].filter(Boolean).join(' / ') || '—';
    return `${from} → ${to}`;
}

function formatDateTime(value) {
    if (!value) return '—';
    const date = new Date(String(value).replace(' ', 'T'));
    if (Number.isNaN(date.getTime())) return '—';
    return date.toLocaleDateString('tr-TR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });
}

async function fetchRecords(page = currentPage.value) {
    loading.value = true;
    error.value = '';

    try {
        const result = await adminStore.fetchSearchAnalysis({
            search: searchQuery.value.trim(),
            page,
            perPage: PER_PAGE,
            listingStatus: listingStatusFilter.value,
        });
        if (!result.success) {
            error.value = result.error || 'Arama analizleri yüklenemedi.';
            records.value = [];
            currentPage.value = 1;
            lastPage.value = 1;
            total.value = 0;
            summary.value = {
                mostSearchedCity: null,
                mostZeroResultSearch: null,
                totalSearches: 0,
                listedSearches: 0,
                unlistedSearches: 0,
            };
            return;
        }
        records.value = result.records;
        currentPage.value = result.currentPage;
        lastPage.value = result.lastPage;
        total.value = result.total;
        summary.value = {
            mostSearchedCity: result.summary?.mostSearchedCity ?? null,
            mostZeroResultSearch: result.summary?.mostZeroResultSearch ?? null,
            totalSearches: result.summary?.totalSearches ?? 0,
            listedSearches: result.summary?.listedSearches ?? 0,
            unlistedSearches: result.summary?.unlistedSearches ?? 0,
        };
    } finally {
        loading.value = false;
    }
}

function setListingStatusFilter(status) {
    if (listingStatusFilter.value === status) {
        return;
    }
    listingStatusFilter.value = status;
    currentPage.value = 1;
    records.value = [];
    fetchRecords(1);
}

function goToPage(page) {
    if (page < 1 || page > lastPage.value || page === currentPage.value || loading.value) {
        return;
    }
    currentPage.value = page;
    fetchRecords(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function onSearchInput() {
    clearTimeout(searchTimer);
    searchTimer = setTimeout(() => {
        currentPage.value = 1;
        records.value = [];
        fetchRecords(1);
    }, 300);
}

onMounted(() => {
    fetchRecords();
});
</script>
