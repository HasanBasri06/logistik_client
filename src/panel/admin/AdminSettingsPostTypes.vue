<template>
    <div class="rounded-2xl border border-gray-200 bg-white p-6 md:p-8 shadow-sm">
        <div class="flex flex-wrap items-start justify-between gap-4">
            <div>
                <h1 class="text-2xl font-bold text-gray-900">Yük Tipleri</h1>
                <p class="mt-2 text-sm text-gray-500">Yük tipi tanımlarını görüntüleyin, ekleyin ve güncelleyin.</p>
            </div>
            <button
                type="button"
                class="inline-flex h-10 items-center gap-2 rounded-lg bg-primary px-4 text-sm font-semibold text-white hover:brightness-105"
                @click="openCreateModal"
            >
                <i class="pi pi-plus" />
                Yeni Yük Tipi Ekle
            </button>
        </div>

        <div class="mt-6">
            <input
                v-model="searchQuery"
                type="search"
                placeholder="Yük tipi ile ara..."
                class="h-11 w-full max-w-md rounded-lg border border-gray-200 px-4 text-sm text-gray-900 placeholder:text-gray-400 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                @input="onSearchInput"
            />
        </div>

        <div v-if="loading && !postTypes.length" class="mt-10 flex items-center justify-center gap-2 text-sm text-gray-500">
            <i class="pi pi-spin pi-spinner" />
            Yükleniyor...
        </div>

        <div v-else-if="error" class="mt-8 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
            {{ error }}
        </div>

        <div v-else-if="!postTypes.length" class="mt-10 text-center text-sm text-gray-500">
            Yük tipi bulunamadı.
        </div>

        <div v-else class="mt-8 overflow-x-auto">
            <table class="w-full min-w-[880px] border-collapse text-left text-sm">
                <thead>
                    <tr class="border-b border-gray-200 text-xs font-semibold uppercase tracking-wide text-gray-500">
                        <th class="px-3 py-3">Görsel</th>
                        <th class="px-3 py-3">Görünen Ad</th>
                        <th class="px-3 py-3">Sistem Adı</th>
                        <th class="px-3 py-3">Durum</th>
                        <th class="px-3 py-3 text-right">İşlem</th>
                    </tr>
                </thead>
                <tbody>
                    <tr
                        v-for="postType in postTypes"
                        :key="postType.id"
                        class="border-b border-gray-100 transition-colors hover:bg-gray-50"
                    >
                        <td class="px-3 py-3">
                            <img
                                v-if="postType.image_url"
                                :src="postType.image_url"
                                :alt="postType.value"
                                class="h-10 w-10 rounded object-contain bg-gray-50"
                            />
                            <span v-else class="text-xs text-gray-400">—</span>
                        </td>
                        <td class="px-3 py-3 font-medium text-gray-900">{{ postType.value }}</td>
                        <td class="px-3 py-3 text-gray-600">{{ postType.name }}</td>
                        <td class="px-3 py-3">
                            <span class="inline-flex rounded-full px-2.5 py-1 text-xs font-medium" :class="postType.status === 'active' ? 'bg-green-50 text-green-700' : 'bg-gray-100 text-gray-600'">
                                {{ postType.status === 'active' ? 'Aktif' : 'Pasif' }}
                            </span>
                        </td>
                        <td class="px-3 py-3 text-right">
                            <button
                                type="button"
                                class="inline-flex h-9 items-center rounded-lg border border-gray-200 px-3 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
                                @click="openEditModal(postType)"
                            >
                                Düzenle
                            </button>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>

        <Teleport to="body">
            <div
                v-if="formModalOpen"
                class="fixed inset-0 z-[10000] flex items-center justify-center bg-black/55 p-4"
                @click.self="closeFormModal"
            >
                <div class="w-full max-w-lg rounded-2xl border border-gray-200 bg-white p-5 shadow-2xl sm:p-6">
                    <h3 class="text-lg font-semibold text-gray-900">
                        {{ formMode === 'create' ? 'Yeni Yük Tipi Ekle' : 'Yük Tipi Düzenle' }}
                    </h3>

                    <form class="mt-5 space-y-4" @submit.prevent="submitForm">
                        <div>
                            <label class="text-sm font-medium text-gray-700">Görünen ad (value)</label>
                            <input v-model="form.value" type="text" required class="mt-1 h-11 w-full rounded-lg border border-gray-200 px-3 text-sm" />
                        </div>
                        <div>
                            <label class="text-sm font-medium text-gray-700">Sistem adı (name)</label>
                            <input v-model="form.name" type="text" required class="mt-1 h-11 w-full rounded-lg border border-gray-200 px-3 text-sm" />
                        </div>
                        <div>
                            <label class="text-sm font-medium text-gray-700">Görsel</label>
                            <input
                                type="file"
                                accept="image/*"
                                class="mt-1 block w-full text-sm text-gray-600 file:mr-3 file:rounded-lg file:border-0 file:bg-primary/10 file:px-3 file:py-2 file:text-sm file:font-medium file:text-primary"
                                @change="onImageChange"
                            />
                            <img
                                v-if="imagePreview"
                                :src="imagePreview"
                                alt="Önizleme"
                                class="mt-3 h-20 w-20 rounded-lg border border-gray-200 bg-gray-50 object-contain"
                            />
                        </div>
                        <div>
                            <label class="text-sm font-medium text-gray-700">Durum</label>
                            <select v-model="form.status" class="mt-1 h-11 w-full rounded-lg border border-gray-200 px-3 text-sm">
                                <option value="active">Aktif</option>
                                <option value="inactive">Pasif</option>
                            </select>
                        </div>

                        <div class="flex justify-end gap-2 pt-2">
                            <button type="button" class="rounded-lg border border-gray-200 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50" :disabled="submitting" @click="closeFormModal">
                                Vazgeç
                            </button>
                            <button type="submit" class="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white hover:brightness-105 disabled:opacity-60" :disabled="submitting">
                                {{ submitting ? 'Kaydediliyor...' : (formMode === 'create' ? 'Ekle' : 'Kaydet') }}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </Teleport>
    </div>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import { toast } from 'vue-sonner';
import { useAdminStore } from '@/stores/admin';

const adminStore = useAdminStore();

const postTypes = ref([]);
const loading = ref(false);
const error = ref('');
const searchQuery = ref('');
const formModalOpen = ref(false);
const formMode = ref('create');
const editingPostTypeId = ref(null);
const submitting = ref(false);
const imageFile = ref(null);
const imagePreview = ref('');
const form = ref({ name: '', value: '', status: 'active' });
let searchTimer = null;

function resetImageState(previewUrl = '') {
    imageFile.value = null;
    imagePreview.value = previewUrl;
}

function openCreateModal() {
    formMode.value = 'create';
    editingPostTypeId.value = null;
    form.value = { name: '', value: '', status: 'active' };
    resetImageState();
    formModalOpen.value = true;
}

function openEditModal(postType) {
    formMode.value = 'edit';
    editingPostTypeId.value = postType.id;
    form.value = {
        name: postType.name ?? '',
        value: postType.value ?? '',
        status: postType.status ?? 'active',
    };
    resetImageState(postType.image_url || '');
    formModalOpen.value = true;
}

function closeFormModal() {
    if (submitting.value) return;
    formModalOpen.value = false;
}

function onImageChange(event) {
    const file = event.target.files?.[0] ?? null;
    imageFile.value = file;
    if (!file) return;
    imagePreview.value = URL.createObjectURL(file);
}

function buildFormData() {
    const payload = new FormData();
    payload.append('name', form.value.name.trim());
    payload.append('value', form.value.value.trim());
    payload.append('status', form.value.status);
    if (imageFile.value) payload.append('image', imageFile.value);
    return payload;
}

async function fetchPostTypes() {
    loading.value = true;
    error.value = '';
    try {
        const result = await adminStore.fetchAdminPostTypes(searchQuery.value.trim());
        if (!result.success) {
            error.value = result.error || 'Yük tipleri yüklenemedi.';
            postTypes.value = [];
            return;
        }
        postTypes.value = result.postTypes;
    } finally {
        loading.value = false;
    }
}

async function submitForm() {
    if (submitting.value) return;
    submitting.value = true;
    try {
        const payload = buildFormData();
        const result = formMode.value === 'create'
            ? await adminStore.createAdminPostType(payload)
            : await adminStore.updateAdminPostType(editingPostTypeId.value, payload);

        if (!result.success) {
            toast.error(result.error || 'İşlem başarısız.', { duration: 5000 });
            return;
        }
        toast.success(formMode.value === 'create' ? 'Yük tipi eklendi.' : 'Yük tipi güncellendi.', { duration: 5000 });
        formModalOpen.value = false;
        fetchPostTypes();
    } finally {
        submitting.value = false;
    }
}

function onSearchInput() {
    clearTimeout(searchTimer);
    searchTimer = setTimeout(fetchPostTypes, 300);
}

onMounted(fetchPostTypes);
</script>
