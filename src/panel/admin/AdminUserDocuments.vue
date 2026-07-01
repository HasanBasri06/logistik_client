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

        <div v-if="loading" class="mt-10 flex items-center justify-center gap-2 text-sm text-gray-500">
            <i class="pi pi-spin pi-spinner" />
            Yükleniyor...
        </div>

        <div v-else-if="error" class="mt-8 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
            {{ error }}
        </div>

        <div v-else-if="!users.length" class="mt-10 text-center text-sm text-gray-500">
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
                    <span
                        class="inline-flex items-center rounded-full px-3 py-1 text-xs font-medium"
                        :class="user.email_verify
                            ? 'bg-green-50 text-green-700'
                            : 'bg-amber-50 text-amber-700'"
                    >
                        E-posta: {{ user.email_verify ? 'Doğrulandı' : 'Doğrulanmadı' }}
                    </span>
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
            </article>
        </div>

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
import { onMounted, ref } from 'vue';
import { useAdminStore } from '@/stores/admin';

const adminStore = useAdminStore();

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
let searchTimer = null;

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

async function fetchUsers() {
    loading.value = true;
    error.value = '';

    try {
        const result = await adminStore.fetchUserDocuments(searchQuery.value.trim());
        if (!result.success) {
            error.value = result.error || 'Kullanıcılar yüklenemedi.';
            users.value = [];
            return;
        }
        users.value = result.users;
    } finally {
        loading.value = false;
    }
}

function onSearchInput() {
    clearTimeout(searchTimer);
    searchTimer = setTimeout(() => {
        fetchUsers();
    }, 300);
}

onMounted(() => {
    fetchUsers();
});
</script>
