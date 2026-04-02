<template>
    <Header />
    <div class="h-[calc(100vh-64px)]">
        <Content>
            <div class="flex flex-row gap-3 w-full h-[calc(100vh-64px)]">
                <CargoOwner />
                <div class="bg-white flex-1 mt-3 border border-gray-200 p-4 sm:p-5 rounded-md flex flex-col overflow-hidden">
                    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
                        <h2 class="text-2xl font-semibold text-gray-900">İlanlarım</h2>
                        <router-link
                            to="/cargo-owner/posts/create"
                            class="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white font-semibold rounded-lg hover:bg-primary/90 transition-colors shrink-0"
                        >
                            <i class="pi pi-plus" style="font-size: 14px;"></i>
                            İlan Oluştur
                        </router-link>
                    </div>

                    <!-- Sekmeler: Devam eden, Tamamlanan, İptal edilen -->
                    <div class="inline-flex p-1 rounded-xl bg-gray-100 border border-gray-200/80 mb-4">
                        <button
                            v-for="tab in postTabs"
                            :key="tab.value"
                            type="button"
                            @click="selectedStatus = tab.value"
                            :class="[
                                'inline-flex items-center gap-2 px-4 py-2.5 rounded-lg font-medium text-sm transition-all duration-200',
                                selectedStatus === tab.value
                                    ? 'bg-white text-primary shadow-sm border border-gray-200/60'
                                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50/80'
                            ]"
                        >
                            <i :class="['pi text-[13px]', tab.icon]"></i>
                            <span>{{ tab.label }}</span>
                        </button>
                    </div>

                    <div v-if="loading" class="flex items-center justify-center flex-1 text-gray-500">
                        <i class="pi pi-spin pi-spinner text-2xl"></i>
                        <span class="ml-2">İlanlar yükleniyor...</span>
                    </div>
                    <div v-else-if="error" class="flex flex-col items-center justify-center flex-1 text-red-600">
                        <i class="pi pi-exclamation-triangle text-2xl mb-2"></i>
                        <p>{{ error }}</p>
                    </div>
                    <div v-else-if="!shipments.length" class="flex flex-col items-center justify-center flex-1 text-gray-500 py-12">
                        <i class="pi pi-inbox text-4xl mb-2 text-gray-300"></i>
                        <p>{{ emptyMessage }}</p>
                    </div>
                    <div v-else class="flex flex-col gap-4 overflow-y-auto pt-1">
                        <Product
                            v-for="shipment in shipments"
                            :key="shipment.id"
                            :shipment="shipment"
                            :slug="String(shipment.slug)"
                            @canceled="onShipmentCanceled"
                        />
                    </div>
                </div>
            </div>
        </Content>
    </div>
</template>

<script setup>
import { ref, onMounted, watch, computed } from 'vue';
import { storeToRefs } from 'pinia';
import Header from '@/components/Header.vue';
import Content from '@/components/Content.vue';
import CargoOwner from '@/components/CargoOwner.vue';
import Product from '@/components/Product.vue';
import api from '@/api';
import { useAuthStore } from '@/stores/auth';

const { user } = storeToRefs(useAuthStore());

const loading = ref(true);
const error = ref(null);
const shipments = ref([]);
const selectedStatus = ref('active');

const postTabs = [
    { value: 'active', label: 'İlanda Olanlar', icon: 'pi-sync' },
    { value: 'accepted', label: 'Devam Eden', icon: 'pi-sync' },
    { value: 'done', label: 'Tamamlanan', icon: 'pi-check-circle' },
    { value: 'canceled', label: 'İptal Edilen', icon: 'pi-times-circle' },
];

const emptyMessage = computed(() => {
    if (selectedStatus.value === 'active') return 'Henüz yayında (teklif bekleyen) ilanınız yok.';
    if (selectedStatus.value === 'accepted') return 'Henüz devam eden (anlaşılmış) ilanınız yok.';
    if (selectedStatus.value === 'done') return 'Henüz tamamlanan ilanınız yok.';
    if (selectedStatus.value === 'canceled') return 'İptal edilen ilanınız yok.';
    return 'Henüz ilanınız bulunmuyor.';
});

async function loadShipments() {
    const id = user.value?.id;
    if (!id) {
        error.value = 'Kullanıcı bilgisi bulunamadı. Lütfen tekrar giriş yapın.';
        loading.value = false;
        return;
    }
    try {
        loading.value = true;
        error.value = null;
        const res = await api.get(`/shipments/creator/${id}`, {
            params: { status: selectedStatus.value },
        });
        const content = res.data?.content ?? res.data;
        // Laravel sayfalama: { data: [...], current_page, ... } veya düz dizi
        const list = content?.data ?? (Array.isArray(content) ? content : []);
        shipments.value = Array.isArray(list) ? list : [];
    } catch (err) {
        error.value = err.response?.data?.message || err.message || 'İlanlar yüklenirken bir hata oluştu';
        shipments.value = [];
    } finally {
        loading.value = false;
    }
}

function onShipmentCanceled() {
    loadShipments();
}

watch(selectedStatus, () => {
    loadShipments();
});

onMounted(() => {
    loadShipments();
});
</script>
