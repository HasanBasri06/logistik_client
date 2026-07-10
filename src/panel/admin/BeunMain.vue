<template>
    <div class="space-y-6">
        <div class="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div class="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                <div class="flex items-center gap-4">
                    <span class="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                        <i class="pi pi-users text-xl" />
                    </span>
                    <div>
                        <p class="text-sm text-gray-500">Toplam Kullanıcı</p>
                        <p class="mt-1 text-2xl font-bold text-gray-900">{{ totalUsers }}</p>
                    </div>
                </div>
            </div>

            <div class="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                <div class="flex items-center gap-4">
                    <span class="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                        <i class="pi pi-box text-xl" />
                    </span>
                    <div>
                        <p class="text-sm text-gray-500">Toplam İlan</p>
                        <p class="mt-1 text-2xl font-bold text-gray-900">{{ totalShipments }}</p>
                    </div>
                </div>
            </div>

            <RouterLink
                to="/panel/admin/beun/arama-analizleri"
                class="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition-colors hover:border-primary/40 hover:bg-primary/5"
            >
                <div class="flex items-center gap-4">
                    <span class="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                        <i class="pi pi-search text-xl" />
                    </span>
                    <div>
                        <p class="text-sm text-gray-500">Toplam Arama</p>
                        <p class="mt-1 text-2xl font-bold text-gray-900">{{ totalSearches }}</p>
                        <p class="mt-1 text-xs text-gray-400">Tıklayarak listelendi / listelenmedi görün</p>
                    </div>
                </div>
            </RouterLink>
        </div>

        <div v-if="loading" class="flex items-center justify-center gap-2 py-16 text-sm text-gray-500">
            <i class="pi pi-spin pi-spinner" />
            Yükleniyor...
        </div>

        <div v-else-if="error" class="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
            {{ error }}
        </div>

        <template v-else>
            <div class="grid grid-cols-1 gap-6 lg:grid-cols-2">
                <section class="rounded-2xl border border-gray-200 bg-white shadow-sm">
                    <div class="border-b border-gray-100 px-5 py-4">
                        <div class="flex items-center justify-between gap-3">
                            <h2 class="text-base font-semibold text-gray-900">Bugün ve Dün Kayıt Olanlar</h2>
                            <span class="inline-flex h-8 min-w-8 items-center justify-center rounded-full bg-primary/10 px-2.5 text-sm font-bold text-primary">
                                {{ recentUsersCount }}
                            </span>
                        </div>
                        <p class="mt-1 text-xs text-gray-500">
                            Bugün {{ todayUsersCount }} · Dün {{ yesterdayUsersCount }}
                        </p>
                    </div>
                    <div class="max-h-[420px] overflow-y-auto p-4">
                        <p v-if="!todayUsers.length && !yesterdayUsers.length" class="py-8 text-center text-sm text-gray-500">
                            Bugün veya dün kayıt olan kullanıcı yok.
                        </p>
                        <template v-else>
                            <div v-if="todayUsers.length" class="space-y-3">
                                <p class="text-xs font-semibold uppercase tracking-wide text-gray-500">Bugün</p>
                                <ul class="space-y-3">
                                    <li
                                        v-for="user in todayUsers"
                                        :key="`today-${user.id}`"
                                        class="rounded-xl border border-gray-100 bg-gray-50 px-4 py-3"
                                    >
                                        <p class="font-medium text-gray-900">{{ user.full_name }}</p>
                                        <p class="mt-1 text-sm text-gray-600">{{ user.phone || '—' }}</p>
                                        <p class="mt-1 text-xs text-gray-400">{{ formatDateTime(user.created_at) }}</p>
                                    </li>
                                </ul>
                            </div>

                            <div v-if="yesterdayUsers.length" class="mt-5 space-y-3">
                                <p class="text-xs font-semibold uppercase tracking-wide text-gray-500">Dün</p>
                                <ul class="space-y-3">
                                    <li
                                        v-for="user in yesterdayUsers"
                                        :key="`yesterday-${user.id}`"
                                        class="rounded-xl border border-gray-100 bg-gray-50 px-4 py-3"
                                    >
                                        <p class="font-medium text-gray-900">{{ user.full_name }}</p>
                                        <p class="mt-1 text-sm text-gray-600">{{ user.phone || '—' }}</p>
                                        <p class="mt-1 text-xs text-gray-400">{{ formatDateTime(user.created_at) }}</p>
                                    </li>
                                </ul>
                            </div>
                        </template>
                    </div>
                </section>

                <section class="rounded-2xl border border-gray-200 bg-white shadow-sm">
                    <div class="border-b border-gray-100 px-5 py-4">
                        <div class="flex items-center justify-between gap-3">
                            <h2 class="text-base font-semibold text-gray-900">Son İlanlar</h2>
                            <span class="inline-flex h-8 min-w-8 items-center justify-center rounded-full bg-primary/10 px-2.5 text-sm font-bold text-primary">
                                {{ totalShipments }}
                            </span>
                        </div>
                        <p class="mt-1 text-xs text-gray-500">Son 30 ilan listeleniyor</p>
                    </div>
                    <div class="max-h-[420px] overflow-y-auto p-4">
                        <p v-if="!recentShipments.length" class="py-8 text-center text-sm text-gray-500">
                            İlan bulunamadı.
                        </p>
                        <ul v-else class="space-y-3">
                            <li
                                v-for="shipment in recentShipments"
                                :key="shipment.id"
                                class="rounded-xl border border-gray-100 bg-gray-50 px-4 py-3"
                            >
                                <p class="text-sm font-medium text-gray-900">
                                    {{ routeLabel(shipment) }}
                                </p>
                                <p class="mt-1 text-sm text-gray-600">
                                    Açan: {{ shipment.creator_name }}
                                </p>
                                <p class="mt-1 text-xs text-gray-400">{{ formatDateTime(shipment.created_at) }}</p>
                            </li>
                        </ul>
                    </div>
                </section>
            </div>

            <section class="rounded-2xl border border-gray-200 bg-white shadow-sm">
                <div class="border-b border-gray-100 px-5 py-4">
                    <div class="flex items-center justify-between gap-3">
                        <h2 class="text-base font-semibold text-gray-900">Bugün Atılan İstekler</h2>
                        <span class="inline-flex h-8 min-w-8 items-center justify-center rounded-full bg-primary/10 px-2.5 text-sm font-bold text-primary">
                            {{ todayRequestsCount }}
                        </span>
                    </div>
                    <p class="mt-1 text-xs text-gray-500">Kim kime istek attı</p>
                </div>
                <div class="max-h-[420px] overflow-y-auto p-4">
                    <p v-if="!todayRequests.length" class="py-8 text-center text-sm text-gray-500">
                        Bugün atılan istek yok.
                    </p>
                    <ul v-else class="space-y-3">
                        <li
                            v-for="requestItem in todayRequests"
                            :key="requestItem.id"
                            class="rounded-xl border border-gray-100 bg-gray-50 px-4 py-3"
                        >
                            <p class="text-sm font-medium text-gray-900">
                                {{ requestItem.sender_name }}
                                <span class="mx-1 font-normal text-gray-400">→</span>
                                {{ requestItem.receiver_name }}
                            </p>
                            <p class="mt-1 text-sm text-gray-600">
                                {{ routeLabel(requestItem) }}
                            </p>
                            <p class="mt-1 text-xs text-gray-400">
                                {{ requestItem.sender_phone || '—' }} · {{ formatDateTime(requestItem.created_at) }}
                            </p>
                        </li>
                    </ul>
                </div>
            </section>
        </template>
    </div>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue';
import { RouterLink } from 'vue-router';
import { useAdminStore } from '@/stores/admin';

const adminStore = useAdminStore();

const loading = ref(true);
const error = ref('');
const todayUsers = ref([]);
const todayUsersCount = ref(0);
const yesterdayUsers = ref([]);
const yesterdayUsersCount = ref(0);
const recentUsersCount = computed(() => todayUsersCount.value + yesterdayUsersCount.value);
const totalUsers = ref(0);
const totalShipments = ref(0);
const totalSearches = ref(0);
const recentShipments = ref([]);
const todayRequests = ref([]);
const todayRequestsCount = ref(0);

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

function routeLabel(item) {
    const from = [item.from_city, item.from_district].filter(Boolean).join(' / ') || '—';
    const to = [item.to_city, item.to_district].filter(Boolean).join(' / ') || '—';
    return `${from} → ${to}`;
}

async function loadDashboard() {
    loading.value = true;
    error.value = '';

    try {
        const result = await adminStore.fetchDashboard();
        if (!result.success) {
            error.value = result.error || 'Panel verileri yüklenemedi.';
            return;
        }

        todayUsers.value = result.todayUsers;
        todayUsersCount.value = result.todayUsersCount;
        yesterdayUsers.value = result.yesterdayUsers;
        yesterdayUsersCount.value = result.yesterdayUsersCount;
        totalUsers.value = result.totalUsers;
        totalShipments.value = result.totalShipments;
        totalSearches.value = result.totalSearches;
        recentShipments.value = result.recentShipments;
        todayRequests.value = result.todayRequests;
        todayRequestsCount.value = result.todayRequestsCount;
    } finally {
        loading.value = false;
    }
}

onMounted(() => {
    loadDashboard();
});
</script>
