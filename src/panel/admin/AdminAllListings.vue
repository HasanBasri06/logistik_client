<template>
    <div class="rounded-2xl border border-gray-200 bg-white p-6 md:p-8 shadow-sm">
        <h1 class="text-2xl font-bold text-gray-900">Tüm İlanlarım</h1>
        <p class="mt-2 text-sm text-gray-500">
            Tüm ilanları görüntüleyin ve yönetin.
        </p>

        <div class="mt-6">
            <input
                v-model="searchQuery"
                type="search"
                placeholder="Şehir, ilçe veya kullanıcı ile ara..."
                class="h-11 w-full max-w-md rounded-lg border border-gray-200 px-4 text-sm text-gray-900 placeholder:text-gray-400 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                @input="onSearchInput"
            />
        </div>

        <div v-if="loading && !shipments.length" class="mt-10 flex items-center justify-center gap-2 text-sm text-gray-500">
            <i class="pi pi-spin pi-spinner" />
            Yükleniyor...
        </div>

        <div v-else-if="error" class="mt-8 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
            {{ error }}
        </div>

        <div v-else-if="!shipments.length && !loading" class="mt-10 text-center text-sm text-gray-500">
            İlan bulunamadı.
        </div>

        <div v-else class="mt-8 overflow-x-auto">
            <p class="mb-4 text-sm text-gray-500">Toplam {{ total }} ilan</p>

            <table class="w-full min-w-[900px] border-collapse text-left text-sm">
                <thead>
                    <tr class="border-b border-gray-200 text-xs font-semibold uppercase tracking-wide text-gray-500">
                        <th class="px-3 py-3">Rota</th>
                        <th class="px-3 py-3">Yük Türü</th>
                        <th class="px-3 py-3">Açan</th>
                        <th class="px-3 py-3">Durum</th>
                        <th class="px-3 py-3">Fiyat</th>
                        <th class="px-3 py-3">Oluşturma</th>
                        <th class="px-3 py-3 text-right">İşlem</th>
                    </tr>
                </thead>
                <tbody>
                    <tr
                        v-for="shipment in shipments"
                        :key="shipment.id"
                        class="border-b border-gray-100 transition-colors hover:bg-gray-50"
                    >
                        <td class="px-3 py-3 font-medium text-gray-900">{{ routeLabel(shipment) }}</td>
                        <td class="px-3 py-3 text-gray-600">{{ shipment.post_type || '—' }}</td>
                        <td class="px-3 py-3 text-gray-600">
                            <div>{{ shipment.creator_name }}</div>
                            <div class="text-xs text-gray-400">{{ shipment.creator_phone || '—' }}</div>
                        </td>
                        <td class="px-3 py-3">
                            <span
                                class="inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium"
                                :class="statusClass(shipment.status)"
                            >
                                {{ statusLabel(shipment.status) }}
                            </span>
                        </td>
                        <td class="px-3 py-3 text-gray-600">{{ formatPrice(shipment.price) }}</td>
                        <td class="px-3 py-3 text-gray-600">{{ formatDateTime(shipment.created_at) }}</td>
                        <td class="px-3 py-3 text-right">
                            <button
                                type="button"
                                class="inline-flex h-9 items-center rounded-lg border border-red-200 bg-red-50 px-3 text-sm font-medium text-red-600 transition-colors hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-50"
                                :disabled="deleteSubmitting && deleteTargetId === shipment.id"
                                @click="openDeleteModal(shipment)"
                            >
                                Sil
                            </button>
                        </td>
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

        <Teleport to="body">
            <div
                v-if="deleteModal"
                class="fixed inset-0 z-[10000] flex items-center justify-center bg-black/55 p-4"
                @click.self="closeDeleteModal"
            >
                <div class="w-full max-w-md rounded-2xl border border-gray-200 bg-white p-5 shadow-2xl sm:p-6">
                    <h3 class="text-lg font-semibold text-gray-900">İlanı Sil</h3>
                    <p class="mt-2 text-sm text-gray-600">
                        <strong>{{ routeLabel(deleteModal) }}</strong> ilanını kalıcı olarak silmek
                        istediğinize emin misiniz? Bu işlem geri alınamaz.
                    </p>

                    <div class="mt-5 flex justify-end gap-2">
                        <button
                            type="button"
                            class="rounded-lg border border-gray-200 px-4 py-2 text-sm text-gray-700 transition-colors hover:bg-gray-50"
                            :disabled="deleteSubmitting"
                            @click="closeDeleteModal"
                        >
                            Vazgeç
                        </button>
                        <button
                            type="button"
                            class="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
                            :disabled="deleteSubmitting"
                            @click="submitDelete"
                        >
                            {{ deleteSubmitting ? 'Siliniyor...' : 'Evet, Sil' }}
                        </button>
                    </div>
                </div>
            </div>
        </Teleport>
    </div>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue';
import { toast } from 'vue-sonner';
import { useAdminStore } from '@/stores/admin';

const adminStore = useAdminStore();
const PER_PAGE = 15;

const shipments = ref([]);
const loading = ref(false);
const error = ref('');
const searchQuery = ref('');
const currentPage = ref(1);
const lastPage = ref(1);
const total = ref(0);
let searchTimer = null;

const deleteModal = ref(null);
const deleteSubmitting = ref(false);
const deleteTargetId = ref(null);

const visiblePages = computed(() => {
    const pages = [];
    const start = Math.max(1, currentPage.value - 2);
    const end = Math.min(lastPage.value, currentPage.value + 2);
    for (let page = start; page <= end; page += 1) {
        pages.push(page);
    }
    return pages;
});

function routeLabel(item) {
    const from = [item.from_city, item.from_district].filter(Boolean).join(' / ') || '—';
    const to = [item.to_city, item.to_district].filter(Boolean).join(' / ') || '—';
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

function formatPrice(value) {
    if (!value || Number(value) === 0) return 'Fiyat görüşülecek';
    return `${Number(value).toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ₺`;
}

function statusLabel(status) {
    const labels = {
        active: 'Aktif',
        inactive: 'Pasif',
        pending: 'Beklemede',
        done: 'Tamamlandı',
        canceled: 'İptal',
        accepted: 'Kabul',
    };
    return labels[status] || status || '—';
}

function statusClass(status) {
    if (status === 'active' || status === 'accepted') return 'bg-green-50 text-green-700';
    if (status === 'pending') return 'bg-amber-50 text-amber-700';
    if (status === 'canceled' || status === 'inactive') return 'bg-gray-100 text-gray-600';
    return 'bg-blue-50 text-blue-700';
}

function openDeleteModal(shipment) {
    deleteModal.value = shipment;
}

function closeDeleteModal() {
    if (deleteSubmitting.value) return;
    deleteModal.value = null;
}

async function submitDelete() {
    if (!deleteModal.value || deleteSubmitting.value) return;

    deleteSubmitting.value = true;
    deleteTargetId.value = deleteModal.value.id;

    try {
        const result = await adminStore.deleteShipment(deleteModal.value.id);
        if (!result.success) {
            toast.error(result.error || 'İlan silinemedi.', { duration: 5000 });
            return;
        }
        toast.success(result.data?.message || 'İlan silindi.', { duration: 5000 });
        deleteModal.value = null;
        fetchShipments(currentPage.value);
    } finally {
        deleteSubmitting.value = false;
        deleteTargetId.value = null;
    }
}

async function fetchShipments(page = currentPage.value) {
    loading.value = true;
    error.value = '';

    try {
        const result = await adminStore.fetchAllShipments({
            search: searchQuery.value.trim(),
            page,
            perPage: PER_PAGE,
        });
        if (!result.success) {
            error.value = result.error || 'İlanlar yüklenemedi.';
            shipments.value = [];
            currentPage.value = 1;
            lastPage.value = 1;
            total.value = 0;
            return;
        }
        shipments.value = result.shipments;
        currentPage.value = result.currentPage;
        lastPage.value = result.lastPage;
        total.value = result.total;
    } finally {
        loading.value = false;
    }
}

function goToPage(page) {
    if (page < 1 || page > lastPage.value || page === currentPage.value || loading.value) {
        return;
    }
    currentPage.value = page;
    fetchShipments(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function onSearchInput() {
    clearTimeout(searchTimer);
    searchTimer = setTimeout(() => {
        currentPage.value = 1;
        shipments.value = [];
        fetchShipments(1);
    }, 300);
}

onMounted(() => {
    fetchShipments();
});
</script>
