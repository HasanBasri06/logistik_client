<template>
    <div class="flex flex-col h-full overflow-y-auto">
        <div class="flex items-center justify-between mb-6">
            <h2 class="text-2xl font-semibold text-gray-900">Adreslerim</h2>
            <button
                class="px-4 py-2 bg-primary text-white font-semibold rounded-lg hover:bg-primary/90 transition-colors flex items-center gap-2"
            >
                <i class="pi pi-plus" style="font-size: 14px;"></i>
                Yeni Adres Ekle
            </button>
        </div>
        <div v-if="addresses.length === 0" class="border border-gray-200 rounded-lg p-6 text-center text-gray-500">
            <i class="pi pi-map-marker text-4xl text-gray-300 mb-3"></i>
            <p>Kayıtlı adresiniz bulunmuyor.</p>
            <p class="text-sm mt-1">Yeni adres ekleyerek teslimat adreslerinizi yönetebilirsiniz.</p>
        </div>
        <div v-else class="grid grid-cols-3 gap-4">
            <div
                v-for="address in addresses"
                :key="address.id"
                class="border border-gray-200 rounded-lg p-4 flex flex-col bg-white hover:shadow-md transition-shadow"
            >
                <h3 class="text-base font-semibold text-gray-900 mb-2">{{ address.title }}</h3>
                <p class="text-sm text-gray-600 flex-1 line-clamp-3">{{ address.preview }}</p>
                <button
                    type="button"
                    class="mt-4 w-full py-2 border border-primary text-primary font-medium rounded-lg hover:bg-primary/5 transition-colors flex items-center justify-center gap-2"
                    @click="openEditModal(address)"
                >
                    <i class="pi pi-pencil" style="font-size: 14px;"></i>
                    Düzenle
                </button>
            </div>
        </div>

        <!-- Adres düzenleme modalı -->
        <Teleport to="body">
            <Transition name="modal">
                <div
                    v-show="editModalOpen"
                    class="fixed inset-0 z-100 flex items-center justify-center p-4"
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby="edit-address-modal-title"
                >
                    <div class="absolute inset-0 bg-black/50" @click="closeEditModal" />
                    <div
                        class="relative bg-white rounded-xl shadow-xl max-w-md w-full p-5"
                        @click.stop
                    >
                        <div class="flex items-center justify-between mb-4">
                            <h2 id="edit-address-modal-title" class="text-lg font-semibold text-gray-900">
                                Adresi Düzenle
                            </h2>
                            <button
                                type="button"
                                class="p-2 rounded-lg text-gray-500 hover:bg-gray-100 hover:text-gray-700"
                                aria-label="Kapat"
                                @click="closeEditModal"
                            >
                                <i class="pi pi-times" style="font-size: 18px;"></i>
                            </button>
                        </div>
                        <form class="flex flex-col gap-4" @submit.prevent="saveAddress">
                            <div>
                                <label for="edit-title" class="block text-sm font-medium text-gray-700 mb-1">Başlık</label>
                                <input
                                    id="edit-title"
                                    v-model="editForm.title"
                                    type="text"
                                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary"
                                    placeholder="Örn: Ev Adresim"
                                />
                            </div>
                            <div>
                                <label for="edit-city" class="block text-sm font-medium text-gray-700 mb-1">Şehir / İlçe</label>
                                <input
                                    id="edit-city"
                                    v-model="editForm.cityDistrict"
                                    type="text"
                                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary"
                                    placeholder="Örn: Kadıköy, İstanbul"
                                />
                            </div>
                            <div>
                                <label for="edit-desc" class="block text-sm font-medium text-gray-700 mb-1">Açıklama</label>
                                <textarea
                                    id="edit-desc"
                                    v-model="editForm.description"
                                    rows="3"
                                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary resize-none"
                                    placeholder="Mahalle, sokak, bina no vb."
                                />
                            </div>
                            <div class="flex justify-end gap-2 pt-2">
                                <button
                                    type="button"
                                    class="px-4 py-2 rounded-lg text-gray-700 bg-gray-100 hover:bg-gray-200 font-medium transition-colors"
                                    @click="closeEditModal"
                                >
                                    İptal
                                </button>
                                <button
                                    type="submit"
                                    class="px-4 py-2 rounded-lg text-white bg-primary hover:bg-primary/90 font-medium transition-colors"
                                >
                                    Kaydet
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </Transition>
        </Teleport>
    </div>
</template>

<script setup>
import { ref, reactive } from 'vue';

const editModalOpen = ref(false);
const editingAddressId = ref(null);

const editForm = reactive({
    title: '',
    cityDistrict: '',
    description: ''
});

const addresses = ref([
    {
        id: 1,
        title: 'Ev Adresim',
        cityDistrict: 'Kadıköy, İstanbul',
        description: 'Atatürk Mah. Cumhuriyet Cad. No: 42/5',
        preview: 'Atatürk Mah. Cumhuriyet Cad. No: 42/5 Kadıköy, İstanbul'
    },
    {
        id: 2,
        title: 'İş Adresi',
        cityDistrict: 'Şişli, İstanbul',
        description: 'Levent Mah. Büyükdere Cad. No: 185 Kat: 12',
        preview: 'Levent Mah. Büyükdere Cad. No: 185 Kat: 12 Şişli, İstanbul'
    },
    {
        id: 3,
        title: 'Depo',
        cityDistrict: 'Tuzla, İstanbul',
        description: 'Organize Sanayi Bölgesi 7. Cadde No: 15',
        preview: 'Organize Sanayi Bölgesi 7. Cadde No: 15 Tuzla, İstanbul'
    }
]);

function openEditModal(address) {
    editingAddressId.value = address.id;
    editForm.title = address.title;
    editForm.cityDistrict = address.cityDistrict ?? '';
    editForm.description = address.description ?? '';
    editModalOpen.value = true;
}

function closeEditModal() {
    editModalOpen.value = false;
    editingAddressId.value = null;
}

function saveAddress() {
    const address = addresses.value.find(a => a.id === editingAddressId.value);
    if (!address) return;
    address.title = editForm.title.trim();
    address.cityDistrict = editForm.cityDistrict.trim();
    address.description = editForm.description.trim();
    address.preview = [address.description, address.cityDistrict].filter(Boolean).join(' ');
    closeEditModal();
}
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
.modal-enter-active .relative.bg-white,
.modal-leave-active .relative.bg-white {
    transition: transform 0.2s ease;
}
.modal-enter-from .relative.bg-white,
.modal-leave-to .relative.bg-white {
    transform: scale(0.95);
}
</style>
