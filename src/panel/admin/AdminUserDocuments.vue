<template>
    <div class="rounded-2xl border border-gray-200 bg-white p-6 md:p-8 shadow-sm">
        <h1 class="text-2xl font-bold text-gray-900">Kullanıcı Evrakları</h1>
        <p class="mt-2 text-sm text-gray-500">
            Kullanıcıların yüklediği belgeleri ve e-posta doğrulama durumunu inceleyin.
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

        <div v-else class="mt-8 flex flex-col gap-6">
            <article
                v-for="user in users"
                :key="user.id"
                class="rounded-xl border border-gray-200 p-5"
            >
                <div class="flex flex-wrap items-start justify-between gap-3 border-b border-gray-100 pb-4">
                    <div>
                        <h2 class="text-base font-semibold text-gray-900">{{ user.full_name }}</h2>
                        <p class="mt-1 text-sm text-gray-500">
                            {{ user.email }} · {{ user.phone }} · {{ userTypeLabel(user.type) }}
                        </p>
                    </div>
                    <div class="flex flex-wrap items-center gap-2">
                        <span
                            class="inline-flex items-center rounded-full px-3 py-1 text-xs font-medium"
                            :class="user.verified
                                ? 'bg-green-50 text-green-700'
                                : 'bg-gray-100 text-gray-600'"
                        >
                            Hesap: {{ user.verified ? 'Onaylı' : 'Onaysız' }}
                        </span>
                        <span
                            class="inline-flex items-center rounded-full px-3 py-1 text-xs font-medium"
                            :class="user.email_verify
                                ? 'bg-green-50 text-green-700'
                                : 'bg-amber-50 text-amber-700'"
                        >
                            E-posta: {{ user.email_verify ? 'Doğrulandı' : 'Doğrulanmadı' }}
                        </span>
                    </div>
                </div>

                <div class="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    <div
                        v-for="doc in documentFields"
                        :key="doc.key"
                        class="rounded-lg border border-gray-100 bg-gray-50 p-3"
                    >
                        <p class="text-xs font-medium uppercase tracking-wide text-gray-500">
                            {{ doc.label }}
                        </p>

                        <div v-if="user[doc.key]" class="mt-2">
                            <template v-if="isPdf(user[doc.key])">
                                <a
                                    :href="user[doc.key]"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    class="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-primary transition-colors hover:bg-gray-50"
                                >
                                    <i class="pi pi-file-pdf text-red-500" />
                                    PDF Belgesini Aç
                                </a>
                            </template>
                            <template v-else>
                                <button
                                    type="button"
                                    class="group block w-full overflow-hidden rounded-lg border border-gray-200 bg-white"
                                    @click="openPreview(doc.label, user[doc.key])"
                                >
                                    <img
                                        :src="user[doc.key]"
                                        :alt="doc.label"
                                        class="h-36 w-full object-cover transition-transform group-hover:scale-105"
                                        loading="lazy"
                                    />
                                </button>
                            </template>
                        </div>
                        <p v-else class="mt-2 text-sm text-gray-400">Yüklenmemiş</p>
                    </div>
                </div>

                <div class="mt-5 flex flex-wrap items-center justify-end gap-2 border-t border-gray-100 pt-4">
                    <button
                        type="button"
                        class="inline-flex h-10 items-center rounded-lg border border-gray-300 bg-white px-4 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                        :disabled="actionUserId === user.id"
                        @click="openRejectModal(user)"
                    >
                        Reddet
                    </button>
                    <button
                        type="button"
                        class="inline-flex h-10 items-center rounded-lg border border-red-200 bg-red-50 px-4 text-sm font-medium text-red-600 transition-colors hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-50"
                        :disabled="!user.verified || actionUserId === user.id"
                        @click="openConfirmModal('revoke', user)"
                    >
                        Onayı Geri Al
                    </button>
                    <button
                        type="button"
                        class="inline-flex h-10 items-center rounded-lg bg-green-600 px-4 text-sm font-semibold text-white transition-colors hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-50"
                        :disabled="user.verified || actionUserId === user.id"
                        @click="openConfirmModal('approve', user)"
                    >
                        Onayla
                    </button>
                </div>
            </article>

            <nav
                v-if="lastPage > 1"
                class="flex flex-wrap items-center justify-between gap-4 border-t border-gray-100 pt-6"
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
                v-if="confirmModal"
                class="fixed inset-0 z-[10000] flex items-center justify-center bg-black/55 p-4"
                @click.self="closeConfirmModal"
            >
                <div class="w-full max-w-md rounded-2xl border border-gray-200 bg-white p-5 shadow-2xl sm:p-6">
                    <h3 class="text-lg font-semibold text-gray-900">Emin misiniz?</h3>
                    <p class="mt-2 text-sm text-gray-600">
                        <template v-if="confirmModal.type === 'approve'">
                            {{ confirmModal.user.full_name }} adlı kullanıcının hesabını onaylamak istediğinize emin misiniz?
                        </template>
                        <template v-else>
                            {{ confirmModal.user.full_name }} adlı kullanıcının onayını geri almak istediğinize emin misiniz?
                        </template>
                    </p>
                    <div class="mt-5 flex justify-end gap-2">
                        <button
                            type="button"
                            class="rounded-lg border border-gray-200 px-4 py-2 text-sm text-gray-700 transition-colors hover:bg-gray-50"
                            :disabled="actionSubmitting"
                            @click="closeConfirmModal"
                        >
                            Vazgeç
                        </button>
                        <button
                            type="button"
                            class="rounded-lg px-4 py-2 text-sm font-semibold text-white transition-colors disabled:cursor-not-allowed disabled:opacity-60"
                            :class="confirmModal.type === 'approve'
                                ? 'bg-green-600 hover:bg-green-700'
                                : 'bg-red-600 hover:bg-red-700'"
                            :disabled="actionSubmitting"
                            @click="submitConfirmModal"
                        >
                            {{ actionSubmitting ? 'İşleniyor...' : 'Evet' }}
                        </button>
                    </div>
                </div>
            </div>
        </Teleport>

        <Teleport to="body">
            <div
                v-if="rejectModal"
                class="fixed inset-0 z-[10000] flex items-center justify-center bg-black/55 p-4"
                @click.self="closeRejectModal"
            >
                <div class="w-full max-w-md rounded-2xl border border-gray-200 bg-white p-5 shadow-2xl sm:p-6">
                    <h3 class="text-lg font-semibold text-gray-900">Kullanıcıyı Reddet</h3>
                    <p class="mt-2 text-sm text-gray-600">
                        {{ rejectModal.user.full_name }} için red açıklaması girin.
                    </p>
                    <textarea
                        v-model="rejectDescription"
                        rows="4"
                        placeholder="Açıklama (isteğe bağlı)"
                        class="mt-4 w-full resize-y rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                    />
                    <div class="mt-5 flex justify-end gap-2">
                        <button
                            type="button"
                            class="rounded-lg border border-gray-200 px-4 py-2 text-sm text-gray-700 transition-colors hover:bg-gray-50"
                            :disabled="actionSubmitting"
                            @click="closeRejectModal"
                        >
                            Vazgeç
                        </button>
                        <button
                            type="button"
                            class="rounded-lg bg-gray-800 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-gray-900 disabled:cursor-not-allowed disabled:opacity-60"
                            :disabled="actionSubmitting"
                            @click="submitRejectModal"
                        >
                            {{ actionSubmitting ? 'Gönderiliyor...' : 'Reddet' }}
                        </button>
                    </div>
                </div>
            </div>
        </Teleport>

        <Teleport to="body">
            <div
                v-if="preview"
                class="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
                @click.self="closePreview"
            >
                <div class="relative max-h-[90vh] max-w-4xl overflow-hidden rounded-xl bg-white shadow-2xl">
                    <div class="flex items-center justify-between border-b border-gray-200 px-4 py-3">
                        <h3 class="text-sm font-semibold text-gray-900">{{ preview.label }}</h3>
                        <button
                            type="button"
                            class="rounded-lg p-2 text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-700"
                            @click="closePreview"
                        >
                            <i class="pi pi-times" />
                        </button>
                    </div>
                    <div class="max-h-[calc(90vh-56px)] overflow-auto p-4">
                        <img
                            :src="preview.url"
                            :alt="preview.label"
                            class="mx-auto max-h-[75vh] w-auto max-w-full rounded-lg object-contain"
                        />
                    </div>
                    <div class="border-t border-gray-200 px-4 py-3 text-right">
                        <a
                            :href="preview.url"
                            target="_blank"
                            rel="noopener noreferrer"
                            class="text-sm font-medium text-primary hover:underline"
                        >
                            Yeni sekmede aç
                        </a>
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
const PER_PAGE = 10;

const documentFields = [
    { key: 'profile_image', label: 'Profil Fotoğrafı' },
    { key: 'id_image', label: 'Kimlik Belgesi' },
    { key: 'src_doc', label: 'SRC Belgesi' },
    { key: 'psikoteknik_doc', label: 'Psikoteknik Belgesi' },
    { key: 'driving_licance_doc', label: 'Ehliyet Belgesi' },
];

const users = ref([]);
const loading = ref(false);
const error = ref('');
const searchQuery = ref('');
const preview = ref(null);
const currentPage = ref(1);
const lastPage = ref(1);
const total = ref(0);
const confirmModal = ref(null);
const rejectModal = ref(null);
const rejectDescription = ref('');
const actionSubmitting = ref(false);
const actionUserId = ref(null);
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
    return type;
}

function isPdf(url) {
    return /\.pdf(\?|$)/i.test(url || '');
}

function openPreview(label, url) {
    preview.value = { label, url };
}

function closePreview() {
    preview.value = null;
}

function updateUserVerified(userId, verified) {
    const index = users.value.findIndex((entry) => entry.id === userId);
    if (index !== -1) {
        users.value[index] = { ...users.value[index], verified };
    }
}

function openConfirmModal(type, user) {
    confirmModal.value = { type, user };
}

function closeConfirmModal() {
    if (actionSubmitting.value) return;
    confirmModal.value = null;
}

function openRejectModal(user) {
    rejectModal.value = { user };
    rejectDescription.value = '';
}

function closeRejectModal() {
    if (actionSubmitting.value) return;
    rejectModal.value = null;
    rejectDescription.value = '';
}

async function submitConfirmModal() {
    if (!confirmModal.value || actionSubmitting.value) return;

    const { type, user } = confirmModal.value;
    actionSubmitting.value = true;
    actionUserId.value = user.id;

    try {
        const result = type === 'approve'
            ? await adminStore.approveUser(user.id)
            : await adminStore.revokeUserApproval(user.id);

        if (!result.success) {
            toast.error(result.error || 'İşlem başarısız.', { duration: 5000 });
            return;
        }

        updateUserVerified(user.id, type === 'approve');
        toast.success(
            result.data?.message || (type === 'approve' ? 'Kullanıcı onaylandı.' : 'Onay geri alındı.'),
            { duration: 5000 },
        );
        confirmModal.value = null;
    } finally {
        actionSubmitting.value = false;
        actionUserId.value = null;
    }
}

async function submitRejectModal() {
    if (!rejectModal.value || actionSubmitting.value) return;

    const { user } = rejectModal.value;
    actionSubmitting.value = true;
    actionUserId.value = user.id;

    try {
        const result = await adminStore.rejectUser(user.id, rejectDescription.value.trim());

        if (!result.success) {
            toast.error(result.error || 'Red işlemi başarısız.', { duration: 5000 });
            return;
        }

        toast.success(result.data?.message || 'Red talebi alındı.', { duration: 5000 });
        rejectModal.value = null;
        rejectDescription.value = '';
    } finally {
        actionSubmitting.value = false;
        actionUserId.value = null;
    }
}

async function fetchUsers(page = currentPage.value) {
    loading.value = true;
    error.value = '';

    try {
        const result = await adminStore.fetchUserDocuments({
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
