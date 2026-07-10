<template>
    <Teleport to="body">
        <Transition name="modal">
            <div
                v-if="open"
                class="fixed inset-0 z-[9999] bg-black/50 flex items-center justify-center px-4"
                @click.self="closeMain"
            >
                <div class="w-full max-w-lg rounded-2xl border border-gray-200 bg-white shadow-2xl p-5 sm:p-6 max-h-[90vh] overflow-y-auto">
                    <div class="flex items-center justify-between gap-3 mb-4">
                        <div>
                            <h3 class="text-lg font-semibold text-gray-900">İlan Belgeleri</h3>
                            <p v-if="routeLabel" class="text-sm text-gray-500 mt-0.5">{{ routeLabel }}</p>
                        </div>
                        <button type="button" class="p-2 rounded-lg text-gray-500 hover:bg-gray-100" @click="closeMain">
                            <i class="pi pi-times"></i>
                        </button>
                    </div>

                    <div v-if="loading" class="flex items-center justify-center py-10 text-gray-500">
                        <i class="pi pi-spin pi-spinner text-xl"></i>
                        <span class="ml-2 text-sm">Belgeler yükleniyor...</span>
                    </div>

                    <template v-else>
                        <button
                            type="button"
                            class="w-full rounded-xl border-2 border-dashed border-primary/40 bg-primary/5 px-4 py-8 text-center hover:bg-primary/10 hover:border-primary/60 transition-colors"
                            @click="openUploadModal"
                        >
                            <i class="pi pi-upload text-2xl text-primary mb-2"></i>
                            <p class="text-sm font-semibold text-primary">Belge Yükle</p>
                            <p class="text-xs text-gray-500 mt-1">Teslimat belgesi, irsaliye veya fotoğraf ekleyin</p>
                        </button>

                        <div v-if="attachments.length" class="mt-5">
                            <h4 class="text-sm font-semibold text-gray-800">Yüklenen Belgeler</h4>
                            <div class="attachments-scroll mt-3 space-y-3 overflow-y-auto overscroll-contain pr-1">
                                <div
                                    v-for="item in attachments"
                                    :key="item.id"
                                    class="rounded-xl border border-gray-200 p-3 flex gap-3 min-h-[5.5rem]"
                                >
                                <a
                                    :href="item.image_url"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    class="shrink-0 w-14 h-14 rounded-lg border border-gray-200 bg-gray-50 flex items-center justify-center overflow-hidden"
                                >
                                    <img
                                        v-if="isImage(item.image_url)"
                                        :src="item.image_url"
                                        :alt="item.title"
                                        class="w-full h-full object-cover"
                                    />
                                    <i v-else class="pi pi-file-pdf text-2xl text-red-500"></i>
                                </a>
                                <div class="min-w-0 flex-1">
                                    <p class="text-sm font-semibold text-gray-900 truncate">{{ item.title }}</p>
                                    <p v-if="creatorLabel(item)" class="text-xs text-gray-500 mt-0.5">
                                        Oluşturan: <span class="font-medium text-gray-700">{{ creatorLabel(item) }}</span>
                                    </p>
                                    <p v-if="item.description" class="text-xs text-gray-600 mt-1 line-clamp-2">{{ item.description }}</p>
                                    <a
                                        :href="item.image_url"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        class="inline-flex items-center gap-1 text-xs text-primary font-medium mt-2 hover:underline"
                                    >
                                        Belgeyi görüntüle
                                        <i class="pi pi-external-link text-[10px]"></i>
                                    </a>
                                </div>
                                </div>
                            </div>
                        </div>
                        <p v-else class="mt-4 text-sm text-gray-500 text-center">Henüz belge yüklenmemiş.</p>
                    </template>
                </div>
            </div>
        </Transition>
    </Teleport>

    <Teleport to="body">
        <Transition name="modal">
            <div
                v-if="uploadOpen"
                class="fixed inset-0 z-[10000] bg-black/55 flex items-center justify-center px-4"
                @click.self="closeUploadModal"
            >
                <div class="w-full max-w-md rounded-2xl border border-gray-200 bg-white shadow-2xl p-5 sm:p-6">
                    <div class="flex items-center justify-between gap-3 mb-4">
                        <h3 class="text-lg font-semibold text-gray-900">Belge Ekle</h3>
                        <button type="button" class="p-2 rounded-lg text-gray-500 hover:bg-gray-100" @click="closeUploadModal">
                            <i class="pi pi-times"></i>
                        </button>
                    </div>

                    <form class="space-y-4" @submit.prevent="submitUpload">
                        <div>
                            <label for="attachment-title" class="block text-sm font-medium text-gray-700 mb-1">Başlık</label>
                            <input
                                id="attachment-title"
                                v-model="form.title"
                                type="text"
                                maxlength="255"
                                placeholder="Örn: Teslimat irsaliyesi"
                                class="w-full h-10 px-3 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                            />
                            <p v-if="errors.title" class="text-xs text-red-500 mt-1">{{ errors.title }}</p>
                        </div>

                        <div>
                            <label for="attachment-description" class="block text-sm font-medium text-gray-700 mb-1">Açıklama</label>
                            <textarea
                                id="attachment-description"
                                v-model="form.description"
                                rows="3"
                                maxlength="5000"
                                placeholder="Belge hakkında kısa açıklama (isteğe bağlı)"
                                class="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary resize-none"
                            />
                        </div>

                        <div>
                            <label for="attachment-file" class="block text-sm font-medium text-gray-700 mb-1">Belge</label>
                            <input
                                id="attachment-file"
                                ref="fileInputRef"
                                type="file"
                                accept="image/jpeg,image/png,image/webp,application/pdf"
                                class="w-full text-sm text-gray-600 file:mr-3 file:py-2 file:px-3 file:rounded-lg file:border-0 file:bg-primary/10 file:text-primary file:font-medium"
                                @change="onFileChange"
                            />
                            <p class="text-xs text-gray-400 mt-1">JPG, PNG, WEBP veya PDF — en fazla 5MB</p>
                            <p v-if="errors.image" class="text-xs text-red-500 mt-1">{{ errors.image }}</p>
                        </div>

                        <div class="flex justify-end gap-2 pt-2">
                            <button
                                type="button"
                                class="px-4 py-2 rounded-lg border border-gray-200 text-gray-700 hover:bg-gray-50"
                                :disabled="submitting"
                                @click="closeUploadModal"
                            >
                                Vazgeç
                            </button>
                            <button
                                type="submit"
                                class="px-4 py-2 rounded-lg bg-primary text-white font-semibold hover:bg-primary/90 disabled:opacity-60 disabled:cursor-not-allowed"
                                :disabled="submitting"
                            >
                                {{ submitting ? 'Yükleniyor...' : 'Yükle' }}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </Transition>
    </Teleport>
</template>

<script setup>
import { ref, watch } from 'vue';
import api from '@/api';
import { toast } from 'vue-sonner';

const props = defineProps({
    open: {
        type: Boolean,
        default: false,
    },
    shipmentId: {
        type: [Number, String],
        default: null,
    },
    routeLabel: {
        type: String,
        default: '',
    },
});

const emit = defineEmits(['update:open', 'uploaded']);

const loading = ref(false);
const attachments = ref([]);
const uploadOpen = ref(false);
const submitting = ref(false);
const fileInputRef = ref(null);
const selectedFile = ref(null);
const errors = ref({ title: '', image: '' });
const form = ref({ title: '', description: '' });

function isImage(url) {
    if (!url) return false;
    return /\.(jpe?g|png|webp)(\?|$)/i.test(url);
}

function creatorLabel(item) {
    return item?.creator?.full_name || item?.creator_name || '';
}

function resetForm() {
    form.value = { title: '', description: '' };
    selectedFile.value = null;
    errors.value = { title: '', image: '' };
    if (fileInputRef.value) fileInputRef.value.value = '';
}

async function loadAttachments() {
    if (!props.shipmentId) return;
    loading.value = true;
    try {
        const res = await api.get(`/shipments/${props.shipmentId}/attachments`);
        attachments.value = res.data?.content?.attachments ?? [];
    } catch (err) {
        attachments.value = [];
        toast.error(err.response?.data?.message || 'Belgeler yüklenemedi.');
    } finally {
        loading.value = false;
    }
}

function closeMain() {
    emit('update:open', false);
    uploadOpen.value = false;
}

function openUploadModal() {
    resetForm();
    uploadOpen.value = true;
}

function closeUploadModal() {
    if (submitting.value) return;
    uploadOpen.value = false;
    resetForm();
}

function onFileChange(e) {
    const file = e.target.files?.[0] ?? null;
    selectedFile.value = file;
    errors.value.image = '';
}

async function submitUpload() {
    errors.value = { title: '', image: '' };
    if (!form.value.title.trim()) {
        errors.value.title = 'Başlık gerekli.';
        return;
    }
    if (!selectedFile.value) {
        errors.value.image = 'Belge seçin.';
        return;
    }
    if (selectedFile.value.size > 5 * 1024 * 1024) {
        errors.value.image = 'Belge en fazla 5MB olabilir.';
        return;
    }

    submitting.value = true;
    try {
        const fd = new FormData();
        fd.append('title', form.value.title.trim());
        if (form.value.description.trim()) {
            fd.append('description', form.value.description.trim());
        }
        fd.append('image', selectedFile.value);

        const res = await api.post(`/shipments/${props.shipmentId}/attachments`, fd, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });

        const created = res.data?.content?.attachment;
        if (created) {
            attachments.value = [created, ...attachments.value];
        } else {
            await loadAttachments();
        }

        toast.success('Belge yüklendi.');
        emit('uploaded');
        closeUploadModal();
    } catch (err) {
        const data = err.response?.data;
        const validation = data?.errors ?? data?.content;
        if (validation?.title?.[0]) errors.value.title = validation.title[0];
        if (validation?.image?.[0]) errors.value.image = validation.image[0];
        toast.error(data?.message || 'Belge yüklenemedi.');
    } finally {
        submitting.value = false;
    }
}

watch(
    () => [props.open, props.shipmentId],
    ([isOpen, id]) => {
        if (isOpen && id) {
            loadAttachments();
        }
        if (!isOpen) {
            uploadOpen.value = false;
            resetForm();
        }
    },
);
</script>

<style scoped>
.modal-enter-active,
.modal-leave-active {
    transition: opacity 0.2s ease;
}
.modal-enter-from,
.modal-leave-to {
    opacity: 0;
}

/* En fazla 4 belge görünür; sonrası kaydırılır */
.attachments-scroll {
    max-height: calc(4 * 5.5rem + 3 * 0.75rem);
}
</style>
