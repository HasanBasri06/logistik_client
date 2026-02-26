<template>
    <Header />
    <div class="h-[calc(100vh-64px)]">
        <Content>
            <div class="flex flex-row gap-3 w-full h-[calc(100vh-64px)]">
                <CargoOwner />
                <div class="bg-white flex-1 mt-3 border border-gray-200 p-3 rounded-md flex flex-col overflow-hidden">
                    <div class="flex items-center justify-between mb-4">
                        <h2 class="text-2xl font-semibold">İlanlarım</h2>
                        <router-link
                            to="/cargo-owner/posts/create"
                            class="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white font-semibold rounded-lg hover:bg-primary/90 transition-colors"
                        >
                            <i class="pi pi-plus" style="font-size: 14px;"></i>
                            İlan Oluştur
                        </router-link>
                    </div>
                    <div v-if="loading" class="flex items-center justify-center flex-1 text-gray-500">
                        <i class="pi pi-spin pi-spinner text-2xl"></i>
                        <span class="ml-2">İlanlar yükleniyor...</span>
                    </div>
                    <div v-else-if="error" class="flex flex-col items-center justify-center flex-1 text-red-600">
                        <i class="pi pi-exclamation-triangle text-2xl mb-2"></i>
                        <p>{{ error }}</p>
                    </div>
                    <div v-else-if="!shipments.length" class="flex flex-col items-center justify-center flex-1 text-gray-500">
                        <i class="pi pi-inbox text-4xl mb-2"></i>
                        <p>Henüz ilanınız bulunmuyor.</p>
                    </div>
                    <div v-else class="flex flex-col gap-4 overflow-y-auto pt-5">
                        <Product
                            v-for="shipment in shipments"
                            :key="shipment.id"
                            :shipment="shipment"
                            :slug="String(shipment.slug)"
                        />
                    </div>
                </div>
            </div>
        </Content>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
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

onMounted(async () => {
    const id = user.value?.id;
    if (!id) {
        error.value = 'Kullanıcı bilgisi bulunamadı. Lütfen tekrar giriş yapın.';
        loading.value = false;
        return;
    }
    try {
        loading.value = true;
        error.value = null;
        const res = await api.get(`/shipments/creator/${id}`);
        const content = res.data?.content;
        const list = content ? (Array.isArray(content) ? content : (content.data ?? content)) : [];
        shipments.value = Array.isArray(list) ? list : [];
    } catch (err) {
        error.value = err.response?.data?.message || err.message || 'İlanlar yüklenirken bir hata oluştu';
        shipments.value = [];
    } finally {
        loading.value = false;
    }
});
</script>
