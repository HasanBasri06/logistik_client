<template>
    <div class="flex flex-col h-full">
        <h2 class="text-xl font-semibold text-gray-900 mb-4">Tüm Siparişlerim</h2>
        
        <!-- Filtre Butonları -->
        <div class="flex gap-3 mb-4 pb-4">
            <button
                @click="selectedOrderStatus = 'active'"
                :class="[
                    'px-4 py-2 rounded-lg font-medium text-sm transition-colors',
                    selectedOrderStatus === 'active'
                        ? 'bg-primary text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                ]"
            >
                Devam Eden
            </button>
            <button
                @click="selectedOrderStatus = 'pending'"
                :class="[
                    'px-4 py-2 rounded-lg font-medium text-sm transition-colors',
                    selectedOrderStatus === 'pending'
                        ? 'bg-primary text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                ]"
            >
                Bekleyen
            </button>
            <button
                @click="selectedOrderStatus = 'cancelled'"
                :class="[
                    'px-4 py-2 rounded-lg font-medium text-sm transition-colors',
                    selectedOrderStatus === 'cancelled'
                        ? 'bg-primary text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                ]"
            >
                İptal Edilen
            </button>
        </div>
        
        <!-- Sipariş Listesi -->
        <div class="flex-1 overflow-y-auto pr-2">
            <p v-if="shipmentsError" class="text-sm text-red-600">{{ shipmentsError }}</p>
            <template v-else-if="shipmentsLoading">
                <p class="text-sm text-gray-500 pt-4">Yükleniyor...</p>
            </template>
            <div v-else class="flex flex-col gap-5 pt-4">
                <template v-if="!shipmentsList.length">
                    <p class="text-gray-500">Henüz sipariş bulunmuyor.</p>
                </template>
                <template v-else>
                    <Product
                        v-for="item in shipmentsList"
                        :key="item.id"
                        :shipment="item"
                        :slug="item.slug ?? String(item.id)"
                    />
                </template>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { storeToRefs } from 'pinia';
import Product from '@/components/Product.vue';
import { useShipmentsStore } from '@/stores/shipments';

const selectedOrderStatus = ref('active');

const shipmentsStore = useShipmentsStore();
const { list: shipmentsList, loading: shipmentsLoading, error: shipmentsError } = storeToRefs(shipmentsStore);

onMounted(() => {
    shipmentsStore.fetchShipments();
});
</script>
