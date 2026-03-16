<template>
    <div class="flex flex-col h-full">
        <h2 class="text-xl font-semibold text-gray-900 mb-4">Tüm Siparişlerim</h2>
        
        <!-- Filtre Sekmeleri -->
        <div class="inline-flex p-1 rounded-xl bg-gray-100 border border-gray-200/80 mb-4 ">
            <button
                v-for="tab in orderTabs"
                :key="tab.value"
                @click="selectedOrderStatus = tab.value"
                :class="[
                    'inline-flex items-center gap-2 px-4 py-2.5 rounded-lg font-medium text-sm transition-all duration-200',
                    selectedOrderStatus === tab.value
                        ? 'bg-white text-primary shadow-sm border border-gray-200/60'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50/80'
                ]"
            >
                <i :class="['pi text-[13px]', tab.icon]"></i>
                <span>{{ tab.label }}</span>
            </button>
        </div>
        
        <!-- Sipariş Listesi -->
        <div class="flex-1 overflow-y-auto pr-2">
            <div v-if="ordersLoading" class="flex flex-col items-center justify-center py-16 gap-3">
                <img
                    :src="loadingGifUrl"
                    alt=""
                    class="w-16 h-16 object-contain"
                />
                <p class="text-sm text-gray-600">İlanlar yükleniyor</p>
            </div>
            <div v-else class="flex flex-col gap-5 pt-4">
                <template v-if="!orders?.length">
                    <p class="text-gray-500">Henüz sipariş bulunmuyor.</p>
                </template>
                <template v-else>
                    <Product
                        v-for="item in orders"
                        :key="item.id"
                        :shipment="item.shipment"
                        :slug="item.shipment?.slug ?? item.slug ?? String(item.id)"
                    />
                </template>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import Product from '@/components/Product.vue';
import api from '@/api';

const loadingGifUrl = new URL('../assets/gifs/loading_gif.gif', import.meta.url).href;

const selectedOrderStatus = ref('accepted');
const orders = ref([]);
const ordersLoading = ref(false);

const orderTabs = [
    { value: 'accepted', label: 'Devam Eden', icon: 'pi-sync' },
    { value: 'done', label: 'Tamamlanan', icon: 'pi-check-circle' },
    { value: 'cancelled', label: 'İptal Edilen', icon: 'pi-times-circle' },
];

const getOrders = async () => {
    ordersLoading.value = true;
    try {
        const response = await api.get('/vehicle/orders', { params: { status: selectedOrderStatus.value } });
        const { content } = await response.data;
        orders.value = content.shipmentOrders ?? [];
    } catch (err) {
        console.log(err);
        orders.value = [];
    } finally {
        ordersLoading.value = false;
    }
}

watch(selectedOrderStatus, () => {
    getOrders();
});

onMounted(() => {
    getOrders();
});
</script>
