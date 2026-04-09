<template>
    <div class="flex flex-col h-full min-h-0 flex-1">
        <h2 class="text-xl font-semibold text-gray-900 mb-4">Tüm İşlerim</h2>
        
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
                <span>{{ tab.label }} ({{ statusCounts[tab.value] ?? 0 }})</span>
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
                <p class="text-sm text-gray-600">Siparişler yükleniyor…</p>
            </div>
            <div v-else class="flex flex-col gap-5 pt-4">
                <template v-if="!orders.length">
                    <p class="text-gray-500">Henüz sipariş bulunmuyor.</p>
                </template>
                <template v-else>
                    <Product
                        v-for="(item, idx) in orders"
                        :key="item.id ?? idx"
                        :shipment="item.shipment ?? item.shipment_order ?? {}"
                        :slug="item.shipment?.slug ?? item.shipment_order?.slug ?? item.slug ?? String(item.id ?? idx)"
                        :prevent-navigation="selectedOrderStatus === 'accepted'"
                        @card-click="openOrderActionModal(item)"
                    />
                </template>
            </div>
        </div>

        <Teleport to="body">
            <Transition name="modal">
                <div
                    v-if="orderActionModalOpen"
                    class="fixed inset-0 z-[9999] bg-black/50 flex items-center justify-center px-4"
                    @click.self="closeOrderActionModal"
                >
                    <div class="w-full max-w-lg rounded-2xl border border-gray-200 bg-white shadow-2xl p-5 sm:p-6">
                        <div class="flex items-center justify-between gap-3 mb-4">
                            <h3 class="text-lg font-semibold text-gray-900">Devam Eden İlan İşlemleri</h3>
                            <button type="button" class="p-2 rounded-lg text-gray-500 hover:bg-gray-100" @click="closeOrderActionModal">
                                <i class="pi pi-times"></i>
                            </button>
                        </div>

                        <p class="text-sm text-gray-600 mb-4">Bu ilan için yapmak istediğiniz işlemi seçin.</p>

                        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <button
                                type="button"
                                class="rounded-xl border border-primary/30 bg-primary/5 px-4 py-4 text-left hover:bg-primary/10 transition-colors"
                                @click="openFinishConfirmModal"
                            >
                                <p class="text-sm font-semibold text-primary">Sürüşü Bitir</p>
                                <p class="text-xs text-gray-600 mt-1">İlanı başarıyla tamamlandı olarak işaretle.</p>
                            </button>
                            <button
                                type="button"
                                class="rounded-xl border-2 border-red-200 bg-red-50 px-4 py-4 text-left hover:bg-red-100 transition-colors"
                                @click="openCancelConfirmModal"
                            >
                                <p class="text-sm font-semibold text-red-700">Sürüşü İptal Et</p>
                                <p class="text-xs text-red-600/90 mt-1">Sürüşü iptal edilir; ilan iptal edilmiş sayılır.</p>
                            </button>
                        </div>
                    </div>
                </div>
            </Transition>
        </Teleport>

        <Teleport to="body">
            <Transition name="modal">
                <div
                    v-if="finishConfirmModalOpen"
                    class="fixed inset-0 z-[10000] bg-black/55 flex items-center justify-center px-4"
                    @click.self="closeFinishConfirmModal"
                >
                    <div class="w-full max-w-md rounded-2xl border border-gray-200 bg-white shadow-2xl p-5 sm:p-6">
                        <h3 class="text-lg font-semibold text-gray-900">Emin misiniz?</h3>
                        <p class="text-sm text-gray-600 mt-2">Bunu yapmak istediğinize emin misiniz?</p>
                        <div class="mt-5 flex justify-end gap-2">
                            <button type="button" class="px-4 py-2 rounded-lg border border-gray-200 text-gray-700 hover:bg-gray-50" @click="closeFinishConfirmModal">
                                Vazgeç
                            </button>
                            <button
                                type="button"
                                class="px-4 py-2 rounded-lg bg-primary text-white font-semibold hover:bg-primary/90 disabled:opacity-60 disabled:cursor-not-allowed"
                                :disabled="finishSubmitting"
                                @click="finishDrive"
                            >
                                {{ finishSubmitting ? 'İşleniyor...' : 'Sürüşü Bitir' }}
                            </button>
                        </div>
                    </div>
                </div>
            </Transition>
        </Teleport>

        <Teleport to="body">
            <Transition name="modal">
                <div
                    v-if="cancelConfirmModalOpen"
                    class="fixed inset-0 z-[10001] bg-black/55 flex items-center justify-center px-4"
                    @click.self="closeCancelConfirmModal"
                >
                    <div class="w-full max-w-md rounded-2xl border border-gray-200 bg-white shadow-2xl p-5 sm:p-6">
                        <h3 class="text-lg font-semibold text-gray-900">Emin misiniz?</h3>
                        <p class="text-sm text-gray-600 mt-2">Sürüşü iptal etmek istediğinize emin misiniz?</p>
                        <div class="mt-5 flex justify-end gap-2">
                            <button
                                type="button"
                                class="px-4 py-2 rounded-lg border border-gray-200 text-gray-700 hover:bg-gray-50"
                                @click="closeCancelConfirmModal"
                            >
                                Hayır
                            </button>
                            <button
                                type="button"
                                class="px-4 py-2 rounded-lg bg-red-600 text-white font-semibold hover:bg-red-700 disabled:opacity-60 disabled:cursor-not-allowed"
                                :disabled="cancelSubmitting"
                                @click="cancelDrive"
                            >
                                {{ cancelSubmitting ? 'İşleniyor...' : 'Evet' }}
                            </button>
                        </div>
                    </div>
                </div>
            </Transition>
        </Teleport>
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
const orderActionModalOpen = ref(false);
const finishConfirmModalOpen = ref(false);
const cancelConfirmModalOpen = ref(false);
const finishSubmitting = ref(false);
const cancelSubmitting = ref(false);
const selectedOrder = ref(null);
/** Sekme sayıları — API `status_counts` (getOrders ile güncellenir) */
const statusCounts = ref({
    accepted: 0,
    done: 0,
    cancelled: 0,
});

const orderTabs = [
    { value: 'accepted', label: 'Devam Eden', icon: 'pi-sync' },
    { value: 'done', label: 'Tamamlanan', icon: 'pi-check-circle' },
    { value: 'cancelled', label: 'İptal Edilen', icon: 'pi-times-circle' },
];

/** API yanıtı: content / data; liste: shipmentOrders veya shipment_orders; bazen dizi yerine nesne */
function shipmentOrdersFromResponse(res) {
    const root = res?.data ?? res;
    const content = root?.content ?? root?.data?.content ?? root?.data ?? root;
    const raw =
        content?.shipmentOrders ??
        content?.shipment_orders ??
        (Array.isArray(content) ? content : null);
    if (Array.isArray(raw)) return raw;
    if (raw && typeof raw === 'object') {
        const vals = Object.values(raw);
        if (vals.length && vals.every((v) => v != null && typeof v === 'object')) return vals;
    }
    return [];
}

function applyStatusCountsFromResponse(res) {
    const root = res?.data ?? res;
    const content = root?.content ?? root?.data?.content ?? root?.data ?? root;
    const sc = content?.status_counts;
    if (sc && typeof sc === 'object') {
        statusCounts.value = {
            accepted: Number(sc.accepted) || 0,
            done: Number(sc.done) || 0,
            cancelled: Number(sc.cancelled) || 0,
        };
    }
}

const getOrders = async () => {
    ordersLoading.value = true;
    try {
        const response = await api.get('/vehicle/orders', { params: { status: selectedOrderStatus.value } });
        orders.value = shipmentOrdersFromResponse(response);
        applyStatusCountsFromResponse(response);
    } catch (err) {
        console.log(err);
        orders.value = [];
    } finally {
        ordersLoading.value = false;
    }
}

function openOrderActionModal(item) {
    if (selectedOrderStatus.value !== 'accepted') return;
    selectedOrder.value = item;
    orderActionModalOpen.value = true;
}

function closeOrderActionModal() {
    orderActionModalOpen.value = false;
}

function openFinishConfirmModal() {
    finishConfirmModalOpen.value = true;
}

function closeFinishConfirmModal() {
    if (finishSubmitting.value) return;
    finishConfirmModalOpen.value = false;
}

function openCancelConfirmModal() {
    cancelConfirmModalOpen.value = true;
}

function closeCancelConfirmModal() {
    if (cancelSubmitting.value) return;
    cancelConfirmModalOpen.value = false;
}

async function finishDrive() {
    if (finishSubmitting.value) return;
    const shipment = selectedOrder.value?.shipment ?? selectedOrder.value?.shipment_order;
    const shipmentId = shipment?.id;
    if (!shipmentId) return;
    finishSubmitting.value = true;
    try {
        await api.post(`/vehicle/orders/${shipmentId}/finish-drive`);
        finishConfirmModalOpen.value = false;
        orderActionModalOpen.value = false;
        selectedOrder.value = null;
        await getOrders();
    } catch (err) {
        console.log(err);
    } finally {
        finishSubmitting.value = false;
    }
}

async function cancelDrive() {
    if (cancelSubmitting.value) return;
    const shipment = selectedOrder.value?.shipment ?? selectedOrder.value?.shipment_order;
    const shipmentId = shipment?.id;
    if (!shipmentId) return;
    cancelSubmitting.value = true;
    try {
        await api.post(`/vehicle/orders/${shipmentId}/cancel-drive`);
        cancelConfirmModalOpen.value = false;
        orderActionModalOpen.value = false;
        selectedOrder.value = null;
        await getOrders();
    } catch (err) {
        console.log(err);
    } finally {
        cancelSubmitting.value = false;
    }
}

watch(selectedOrderStatus, () => {
    getOrders();
});

onMounted(() => {
    getOrders();
});
</script>
