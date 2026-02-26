<template>
    <Header />
    <div class="h-[calc(100vh-64px)] flex flex-col">
        <Content class="flex-1 flex gap-6 py-6 min-h-0 flex-row">

            <div class="flex-1 min-w-0 flex flex-col gap-4 overflow-y-auto no_scrool">
                <template v-if="loading">
                    <div class="flex items-center justify-center py-12">
                        <i class="pi pi-spin pi-spinner text-2xl text-primary"></i>
                        <span class="ml-2 text-gray-600">Yükleniyor...</span>
                    </div>
                </template>
                <template v-else-if="error">
                    <p class="text-red-600 font-medium">{{ error }}</p>
                </template>
                <template v-else-if="requestCount == 0">
                    <div class="text-center text-gray-500 py-40 bg-primary/10 rounded-lg border border-primary/20">Henüz teklif verilmemiş</div>
                </template>
                <template v-else>
                    <h2 class="text-lg font-semibold text-gray-900">{{ requestCount }} adet teklif bulunmaktadır.</h2>
                    <RequestCard
                        v-for="req in (shipment?.requests || [])"
                        :key="req?.id ?? req?.created_at"
                        :request="req"
                        @message-click="openMessagePanel"
                    />
                </template>
                
            </div>

            <div class="w-1/3 shrink-0 flex flex-col space-y-4">
                <div class="rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden sticky w-full top-6 self-start">
                    <div class="px-5 py-4 border-b border-gray-100 bg-primary/5">
                        <span class="text-sm font-semibold text-primary">Güzergah</span>
                    </div>
                    <div class="p-5 flex flex-col gap-5">
                        <div class="flex items-center gap-3">
                            <span class="text-lg font-semibold text-gray-900">İstanbul / Kadıköy</span>
                            <i class="pi pi-arrow-right text-primary text-sm shrink-0"></i>
                            <span class="text-lg font-semibold text-gray-900">Ankara / Bahçeli</span>
                        </div>
                        <div class="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-gray-600">
                            <span class="font-medium text-gray-700">Tır / Tenteli</span>
                            <span>10 Ton</span>
                            <span>1000 km</span>
                            <span class="text-primary font-semibold">(14:00 - 18:00)</span>
                        </div>
                        <div class="pt-3 border-t border-gray-100 flex justify-between items-center">
                            <span class="text-sm text-gray-500">Ücret</span>
                            <span class="text-lg font-semibold text-primary">15.000 ₺</span>
                        </div>
                    </div>
                </div>

                <div class="rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden w-full sticky top-6 self-start">
                    <div class="px-5 py-4 border-b border-gray-100 bg-primary/5">
                        <span class="text-sm font-semibold text-primary">Araç</span>
                    </div>
                    <div class="flex flex-col gap-5 px-20 py-5">
                        <!-- <img src="/src/assets/images/vehicles/tenteli.png" alt="Araç" class="w-full h-full object-cover"> -->
                        <span class="text-xs font-semibold text-primary max-w-fit mx-auto px-2 py-1 rounded-full text-center">Tır / Tenteli</span>
                    </div>
                </div>
                
                <div class="rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden w-full sticky top-6 self-start">
                    <div class="px-5 py-4 border-b border-gray-100 bg-primary/5">
                        <span class="text-sm font-semibold text-primary">Yük Tipi</span>
                    </div>
                    <div class="p-5 flex flex-col gap-5">
                        <div class="flex items-center gap-3">
                            <span class="text-lg font-semibold text-gray-900">Paletli</span>
                        </div>
                    </div>
                </div>
            </div>
        </Content>
    </div>

    <!-- Mesaj duvarı – sağdan kayan panel -->
    <Teleport to="body">
        <div
            v-if="showMessagePanel"
            class="fixed inset-0 z-50 flex justify-end"
            aria-hidden="true"
        >
            <div
                class="absolute inset-0 bg-black/30 transition-opacity"
                @click="closeMessagePanel"
            />
            <div
                class="relative h-screen w-96 bg-white border-l border-gray-200 shadow-xl flex flex-col transition-transform duration-300 ease-out"
                :class="messagePanelVisible ? 'translate-x-0' : 'translate-x-full'"
            >
                <div class="flex items-center justify-between p-3 border-b border-gray-200">
                    <span class="text-sm font-semibold text-gray-900">
                        {{ selectedReceiver?.full_name ? `Mesaj: ${selectedReceiver.full_name}` : 'Mesaj' }}
                    </span>
                    <button
                        type="button"
                        class="p-1 rounded hover:bg-gray-100 text-gray-500 hover:text-gray-700"
                        aria-label="Kapat"
                        @click="closeMessagePanel"
                    >
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
                <div class="flex-1 flex flex-col min-h-0">
                    <div
                        ref="panelMessagesContainer"
                        class="flex-1 overflow-y-auto px-3 py-2 flex flex-col gap-3 bg-gray-50"
                    >
                        <div
                            v-for="(msg, index) in panelMessages"
                            :key="index"
                            :class="msg.isMe ? 'flex justify-end' : 'flex justify-start'"
                        >
                            <div
                                :class="[
                                    'max-w-[85%] px-3 py-2 rounded-lg flex flex-col gap-0.5',
                                    msg.isMe
                                        ? 'bg-primary text-white rounded-br-none'
                                        : 'bg-white text-gray-800 border border-gray-200 rounded-bl-none'
                                ]"
                            >
                                <p class="text-sm leading-snug">{{ msg.text }}</p>
                                <span class="text-xs opacity-80">{{ msg.time }}</span>
                            </div>
                        </div>
                        <p v-if="!panelMessages.length && !panelMessagesLoading" class="text-sm text-gray-500 text-center py-4">
                            Henüz mesaj yok. Aşağıdan mesaj göndererek başlayın.
                        </p>
                        <p v-if="panelMessagesLoading" class="text-sm text-gray-500 text-center py-4">Mesajlar yükleniyor...</p>
                    </div>
                    <div class="w-full shrink-0 border-t border-gray-200 p-2 bg-white">
                        <form @submit.prevent="sendPanelMessage" class="flex items-center gap-2">
                            <input
                                v-model="newMessageText"
                                type="text"
                                placeholder="Mesajınızı yazın..."
                                class="flex-1 rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
                            />
                            <button
                                type="submit"
                                class="flex items-center justify-center w-10 h-10 shrink-0 rounded-lg bg-primary text-white hover:bg-primary/90 transition-colors"
                                aria-label="Gönder"
                            >
                                <i class="pi pi-send text-sm"></i>
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </Teleport>
</template>

<script setup>
import Header from '@/components/Header.vue';
import Content from '@/components/Content.vue';
import RequestCard from '@/components/RequestCard.vue';
import { onMounted, onBeforeUnmount, ref, computed, watch, nextTick } from 'vue';
import { useRoute } from 'vue-router';
import api from '@/api';
import { useMessageStore } from '@/stores/message';
import { useAuthStore } from '@/stores/auth';
import { getEcho } from '@/echo';
import { formatMessageTime } from '@/stores/message';

const route = useRoute();
const slug = computed(() => route.params.slug);
const messageStore = useMessageStore();
const authStore = useAuthStore();

const shipment = ref(null);
const loading = ref(false);
const error = ref(null);

const requestCount = computed(() => shipment.value?.requests?.length ?? 0);

const loadShipment = async () => {
    const slugVal = slug.value;
    if (!slugVal) {
        shipment.value = null;
        return;
    }
    loading.value = true;
    error.value = null;
    try {
        const response = await api.get(`/shipments/${slugVal}/requests`);
        const data = response.data?.content ?? response.data;
        shipment.value = data?.shipment ?? data ?? null;
    } catch (err) {
        console.error(err);
        error.value = err?.response?.data?.message ?? err?.message ?? 'İlan yüklenemedi.';
        shipment.value = null;
    } finally {
        loading.value = false;
    }
};

watch(slug, loadShipment);

// Mesaj paneli (sağdan kayan duvar)
const showMessagePanel = ref(false);
const messagePanelVisible = ref(false);
const panelMessagesContainer = ref(null);
const panelMessages = ref([]);
const panelMessagesLoading = ref(false);
const newMessageText = ref('');
const selectedReceiver = ref(null);

async function openMessagePanel(request) {
    const user = request?.user;
    if (!user?.id) return;
    selectedReceiver.value = user;
    panelMessages.value = [];
    panelMessagesLoading.value = true;
    const { success, data } = await messageStore.getBySenderAndReceiver(user.id);
    panelMessagesLoading.value = false;
    if (success && Array.isArray(data)) {
        panelMessages.value = data;
    }
    newMessageText.value = '';
    showMessagePanel.value = true;
    nextTick(() => {
        messagePanelVisible.value = true;
        nextTick(() => {
            const el = panelMessagesContainer.value;
            if (el) el.scrollTop = el.scrollHeight;
        });
    });
}

function closeMessagePanel() {
    messagePanelVisible.value = false;
    setTimeout(() => {
        showMessagePanel.value = false;
        selectedReceiver.value = null;
        panelMessages.value = [];
    }, 300);
}

async function sendPanelMessage() {
    const text = newMessageText.value?.trim();
    if (!text || !selectedReceiver.value?.id) return;
    const result = await messageStore.createMessage({
        shipment_id: shipment.value?.id ?? null,
        receiver_id: selectedReceiver.value.id,
        message: text,
    });
    if (!result.success) return;
    newMessageText.value = '';
    const { success, data } = await messageStore.getBySenderAndReceiver(selectedReceiver.value.id);
    if (success && Array.isArray(data)) {
        panelMessages.value = data;
    }
    nextTick(() => {
        const el = panelMessagesContainer.value;
        if (el) el.scrollTop = el.scrollHeight;
    });
}

let panelEchoChannel = null;
function setupPanelPusherListener() {
    const echo = getEcho();
    const userId = authStore.user?.id;
    if (!echo || !userId) return;
    if (panelEchoChannel) return;
    panelEchoChannel = echo.private(`user.${userId}`)
        .listen('.message.sent', (e) => {
            if (Number(e.receiver_id) !== Number(userId)) return;
            const openForSender = selectedReceiver.value?.id;
            if (openForSender == null || Number(e.sender_id) !== Number(openForSender)) return;
            const time = formatMessageTime(e.created_at);
            panelMessages.value = [...panelMessages.value, { id: e.id, text: e.message, time, isMe: false }];
            nextTick(() => {
                const el = panelMessagesContainer.value;
                if (el) el.scrollTop = el.scrollHeight;
            });
        });
}
function removePanelPusherListener() {
    if (panelEchoChannel) {
        panelEchoChannel.stopListening('.message.sent');
        panelEchoChannel = null;
    }
}

onMounted(() => {
    loadShipment();
    setupPanelPusherListener();
});
onBeforeUnmount(removePanelPusherListener);
</script>
