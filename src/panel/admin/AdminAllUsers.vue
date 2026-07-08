<template>
    <div class="rounded-2xl border border-gray-200 bg-white p-6 md:p-8 shadow-sm">
        <h1 class="text-2xl font-bold text-gray-900">Kullanıcılarımız</h1>
        <p class="mt-2 text-sm text-gray-500">
            Tüm kullanıcıları ve üyelik/ödeme durumlarını görüntüleyin.
        </p>

        <div class="mt-6">
            <input
                v-model="searchQuery"
                type="search"
                placeholder="İsim, e-posta veya telefon ile ara..."
                class="h-11 w-full max-w-md rounded-lg border border-gray-200 px-4 text-sm text-gray-900 placeholder:text-gray-400 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                @input="onSearchInput"
            />
        </div>

        <div v-if="loading && !users.length" class="mt-10 flex items-center justify-center gap-2 text-sm text-gray-500">
            <i class="pi pi-spin pi-spinner" />
            Yükleniyor...
        </div>

        <div v-else-if="error" class="mt-8 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
            {{ error }}
        </div>

        <div v-else-if="!users.length && !loading" class="mt-10 text-center text-sm text-gray-500">
            Kullanıcı bulunamadı.
        </div>

        <div v-else class="mt-8 overflow-x-auto">
            <table class="w-full min-w-[900px] border-collapse text-left text-sm">
                <thead>
                    <tr class="border-b border-gray-200 text-xs font-semibold uppercase tracking-wide text-gray-500">
                        <th class="px-3 py-3">Ad Soyad</th>
                        <th class="px-3 py-3">Telefon</th>
                        <th class="px-3 py-3">E-posta</th>
                        <th class="px-3 py-3">Tür</th>
                        <th class="px-3 py-3">Oluşturma Tarihi</th>
                        <th class="px-3 py-3">Ödeme Bitiş</th>
                        <th class="px-3 py-3">Kalan Gün</th>
                        <th class="px-3 py-3">Ödeme Onayı</th>
                    </tr>
                </thead>
                <tbody>
                    <tr
                        v-for="user in users"
                        :key="user.id"
                        class="border-b border-gray-100 transition-colors hover:bg-gray-50"
                    >
                        <td class="px-3 py-3 font-medium text-gray-900">{{ user.full_name || '—' }}</td>
                        <td class="px-3 py-3 text-gray-600">{{ user.phone || '—' }}</td>
                        <td class="px-3 py-3 text-gray-600">{{ user.email || '—' }}</td>
                        <td class="px-3 py-3 text-gray-600">{{ userTypeLabel(user.type) }}</td>
                        <td class="px-3 py-3 text-gray-600">{{ formatDateTime(user.created_at) }}</td>
                        <td class="px-3 py-3 text-gray-600">{{ formatDate(user.end_payment_date) }}</td>
                        <td class="px-3 py-3">
                            <span
                                class="inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium"
                                :class="daysLeftClass(user.days_left)"
                            >
                                {{ daysLeftLabel(user.days_left) }}
                            </span>
                        </td>
                        <td class="px-3 py-3">
                            <span
                                class="inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium"
                                :class="user.payment_confirm
                                    ? 'bg-green-50 text-green-700'
                                    : 'bg-gray-100 text-gray-600'"
                            >
                                {{ user.payment_confirm ? 'Onaylı' : 'Onaysız' }}
                            </span>
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
                    Toplam {{ total }} kullanıcı · Sayfa {{ currentPage }} / {{ lastPage }}
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

const users = ref([]);
const loading = ref(false);
const error = ref('');
const searchQuery = ref('');
const currentPage = ref(1);
const lastPage = ref(1);
const total = ref(0);
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

function userTypeLabel(type) {
    if (type === 'vehicle_owner') return 'Araç Sahibi';
    if (type === 'cargo_owner') return 'Yük Sahibi';
    return type || '—';
}

function formatDate(value) {
    if (!value) return '—';
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return '—';
    return date.toLocaleDateString('tr-TR', { day: '2-digit', month: '2-digit', year: 'numeric' });
}

function formatDateTime(value) {
    if (!value) return '—';
    const date = new Date(value.replace(' ', 'T'));
    if (Number.isNaN(date.getTime())) return '—';
    return date.toLocaleDateString('tr-TR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });
}

function daysLeftLabel(days) {
    if (days === null || days === undefined) return 'Tarih yok';
    if (days > 0) return `${days} gün kaldı`;
    if (days === 0) return 'Bugün doluyor';
    return `${Math.abs(days)} gün geçti`;
}

function daysLeftClass(days) {
    if (days === null || days === undefined) return 'bg-gray-100 text-gray-500';
    if (days > 7) return 'bg-green-50 text-green-700';
    if (days > 0) return 'bg-amber-50 text-amber-700';
    return 'bg-red-50 text-red-600';
}

async function fetchUsers(page = currentPage.value) {
    loading.value = true;
    error.value = '';

    try {
        const result = await adminStore.fetchAllUsers({
            search: searchQuery.value.trim(),
            page,
            perPage: PER_PAGE,
        });
        if (!result.success) {
            error.value = result.error || 'Kullanıcılar yüklenemedi.';
            users.value = [];
            currentPage.value = 1;
            lastPage.value = 1;
            total.value = 0;
            return;
        }
        users.value = result.users;
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
    fetchUsers(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function onSearchInput() {
    clearTimeout(searchTimer);
    searchTimer = setTimeout(() => {
        currentPage.value = 1;
        users.value = [];
        fetchUsers(1);
    }, 300);
}

onMounted(() => {
    fetchUsers();
});
</script>
