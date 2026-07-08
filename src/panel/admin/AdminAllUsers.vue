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
            <table class="w-full min-w-[1000px] border-collapse text-left text-sm">
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
                        <th class="px-3 py-3 text-right">İşlemler</th>
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
                        <td class="px-3 py-3 text-right">
                            <button
                                type="button"
                                class="inline-flex h-9 items-center gap-1.5 rounded-lg border border-gray-200 px-3 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
                                @click="toggleMenu(user, $event)"
                            >
                                Detay
                                <i class="pi pi-chevron-down text-xs" />
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

        <Teleport to="body">
            <div
                v-if="menuUser"
                class="fixed inset-0 z-[9990]"
                @click="closeMenu"
            />
            <div
                v-if="menuUser"
                class="fixed z-[9991] w-48 overflow-hidden rounded-xl border border-gray-200 bg-white py-1 shadow-xl"
                :style="{ top: `${menuPos.top}px`, left: `${menuPos.left}px` }"
            >
                <button
                    type="button"
                    class="flex w-full items-center gap-2 px-4 py-2.5 text-left text-sm text-gray-700 transition-colors hover:bg-gray-50"
                    @click="openExtendModal(menuUser)"
                >
                    <i class="pi pi-calendar-plus text-primary" />
                    Hesap Uzat
                </button>
                <button
                    type="button"
                    class="flex w-full items-center gap-2 px-4 py-2.5 text-left text-sm text-red-600 transition-colors hover:bg-red-50"
                    @click="openDeleteModal(menuUser)"
                >
                    <i class="pi pi-trash" />
                    Hesabı Sil
                </button>
            </div>
        </Teleport>

        <Teleport to="body">
            <div
                v-if="extendModal"
                class="fixed inset-0 z-[10000] flex items-center justify-center bg-black/55 p-4"
                @click.self="closeExtendModal"
            >
                <div class="w-full max-w-md rounded-2xl border border-gray-200 bg-white p-5 shadow-2xl sm:p-6">
                    <h3 class="text-lg font-semibold text-gray-900">Hesap Uzat</h3>
                    <p class="mt-1 text-sm text-gray-500">
                        {{ extendModal.full_name }}
                    </p>
                    <div class="mt-3 rounded-lg border border-gray-100 bg-gray-50 px-3 py-2.5 text-sm">
                        <span class="text-gray-500">Mevcut bitiş tarihi:</span>
                        <span class="font-medium text-gray-800">{{ formatDate(extendModal.end_payment_date) }}</span>
                        <template v-if="previewEndDate">
                            <span class="mx-1 text-gray-400">→</span>
                            <span class="font-semibold text-green-600">{{ formatDate(previewEndDate) }}</span>
                        </template>
                    </div>

                    <div class="mt-5">
                        <p class="mb-2 text-xs font-medium uppercase tracking-wide text-gray-500">Hızlı Uzat</p>
                        <div class="grid grid-cols-4 gap-2">
                            <button
                                v-for="option in monthOptions"
                                :key="option"
                                type="button"
                                class="inline-flex h-11 items-center justify-center rounded-lg border text-sm font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-50"
                                :class="selectedMonths === option
                                    ? 'border-primary bg-primary/10 text-primary'
                                    : 'border-gray-200 text-gray-700 hover:border-primary hover:bg-primary/5 hover:text-primary'"
                                :disabled="extendSubmitting"
                                @click="selectMonths(option)"
                            >
                                {{ option }} Ay
                            </button>
                        </div>
                    </div>

                    <div class="my-5 flex items-center gap-3 text-xs text-gray-400">
                        <span class="h-px flex-1 bg-gray-200" />
                        veya tarih seç
                        <span class="h-px flex-1 bg-gray-200" />
                    </div>

                    <input
                        :value="extendDate"
                        type="date"
                        :min="todayStr"
                        class="h-11 w-full rounded-lg border px-3 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary/20"
                        :class="extendDate ? 'border-primary' : 'border-gray-200 focus:border-primary'"
                        @input="onDateInput"
                    />

                    <div class="mt-6 flex justify-end gap-2">
                        <button
                            type="button"
                            class="rounded-lg border border-gray-200 px-4 py-2 text-sm text-gray-700 transition-colors hover:bg-gray-50"
                            :disabled="extendSubmitting"
                            @click="closeExtendModal"
                        >
                            Kapat
                        </button>
                        <button
                            type="button"
                            class="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
                            :disabled="extendSubmitting || !canSubmitExtend"
                            @click="submitExtend"
                        >
                            {{ extendSubmitting ? 'Uzatılıyor...' : 'Uzat' }}
                        </button>
                    </div>
                </div>
            </div>
        </Teleport>

        <Teleport to="body">
            <div
                v-if="deleteModal"
                class="fixed inset-0 z-[10000] flex items-center justify-center bg-black/55 p-4"
                @click.self="closeDeleteModal"
            >
                <div class="w-full max-w-md rounded-2xl border border-gray-200 bg-white p-5 shadow-2xl sm:p-6">
                    <h3 class="text-lg font-semibold text-gray-900">Hesabı Sil</h3>
                    <p class="mt-2 text-sm text-gray-600">
                        <strong>{{ deleteModal.full_name }}</strong> adlı kullanıcının hesabını kalıcı olarak silmek
                        istediğinize emin misiniz? Bu işlem geri alınamaz.
                    </p>

                    <div class="mt-4">
                        <label class="mb-1 block text-sm font-medium text-gray-700">Admin Şifreniz</label>
                        <input
                            v-model="deletePassword"
                            type="password"
                            autocomplete="current-password"
                            placeholder="Şifrenizi girin"
                            class="h-11 w-full rounded-lg border border-gray-200 px-3 text-sm text-gray-900 placeholder:text-gray-400 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                            @keyup.enter="submitDelete"
                        />
                        <p v-if="deleteError" class="mt-2 text-sm text-red-600">{{ deleteError }}</p>
                    </div>

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
const monthOptions = [1, 3, 6, 12];

const users = ref([]);
const loading = ref(false);
const error = ref('');
const searchQuery = ref('');
const currentPage = ref(1);
const lastPage = ref(1);
const total = ref(0);
let searchTimer = null;

const menuUser = ref(null);
const menuPos = ref({ top: 0, left: 0 });

const extendModal = ref(null);
const extendDate = ref('');
const selectedMonths = ref(null);
const extendSubmitting = ref(false);

const deleteModal = ref(null);
const deletePassword = ref('');
const deleteSubmitting = ref(false);
const deleteError = ref('');

const todayStr = new Date().toISOString().slice(0, 10);

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

function toggleMenu(user, event) {
    if (menuUser.value && menuUser.value.id === user.id) {
        closeMenu();
        return;
    }
    const rect = event.currentTarget.getBoundingClientRect();
    const menuWidth = 192;
    menuPos.value = {
        top: rect.bottom + 4,
        left: Math.max(8, rect.right - menuWidth),
    };
    menuUser.value = user;
}

function closeMenu() {
    menuUser.value = null;
}

const canSubmitExtend = computed(() => Boolean(selectedMonths.value || extendDate.value));

const previewEndDate = computed(() => {
    if (!extendModal.value) return null;

    if (selectedMonths.value) {
        const current = extendModal.value.end_payment_date
            ? new Date(extendModal.value.end_payment_date)
            : null;
        const now = new Date();
        const base = current && current.getTime() > now.getTime() ? new Date(current) : now;
        const result = new Date(base);
        result.setMonth(result.getMonth() + selectedMonths.value);
        return result;
    }

    if (extendDate.value) {
        const date = new Date(extendDate.value);
        return Number.isNaN(date.getTime()) ? null : date;
    }

    return null;
});

function selectMonths(option) {
    selectedMonths.value = option;
    extendDate.value = '';
}

function onDateInput(event) {
    extendDate.value = event.target.value;
    if (extendDate.value) {
        selectedMonths.value = null;
    }
}

function openExtendModal(user) {
    extendModal.value = user;
    extendDate.value = '';
    selectedMonths.value = null;
    closeMenu();
}

function closeExtendModal() {
    if (extendSubmitting.value) return;
    extendModal.value = null;
    extendDate.value = '';
    selectedMonths.value = null;
}

async function submitExtend() {
    if (!extendModal.value || extendSubmitting.value || !canSubmitExtend.value) return;

    const payload = selectedMonths.value
        ? { months: selectedMonths.value }
        : { end_payment_date: extendDate.value };

    extendSubmitting.value = true;
    try {
        const result = await adminStore.extendUserPayment(extendModal.value.id, payload);
        if (!result.success) {
            toast.error(result.error || 'Hesap uzatma başarısız.', { duration: 5000 });
            return;
        }
        toast.success(result.data?.message || 'Hesap uzatıldı.', { duration: 5000 });
        extendModal.value = null;
        extendDate.value = '';
        selectedMonths.value = null;
        fetchUsers(currentPage.value);
    } finally {
        extendSubmitting.value = false;
    }
}

function openDeleteModal(user) {
    deleteModal.value = user;
    deletePassword.value = '';
    deleteError.value = '';
    closeMenu();
}

function closeDeleteModal() {
    if (deleteSubmitting.value) return;
    deleteModal.value = null;
    deletePassword.value = '';
    deleteError.value = '';
}

async function submitDelete() {
    if (!deleteModal.value || deleteSubmitting.value) return;
    if (!deletePassword.value) {
        deleteError.value = 'Admin şifrenizi girmeniz gerekir.';
        return;
    }

    deleteSubmitting.value = true;
    deleteError.value = '';
    try {
        const result = await adminStore.deleteUser(deleteModal.value.id, deletePassword.value);
        if (!result.success) {
            deleteError.value = result.error || 'Silme işlemi başarısız.';
            return;
        }
        toast.success(result.data?.message || 'Kullanıcı silindi.', { duration: 5000 });
        deleteModal.value = null;
        deletePassword.value = '';
        fetchUsers(currentPage.value);
    } finally {
        deleteSubmitting.value = false;
    }
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
