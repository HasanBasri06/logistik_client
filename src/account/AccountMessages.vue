<template>
    <div class="flex flex-row gap-4 h-full">
        <!-- Sol: Mesaj Listesi (Mesaj seçilmediğinde görünür) -->
        <div v-if="!route.params.id" class="w-full flex flex-col overflow-y-auto">
            <h2 class="text-2xl font-semibold text-gray-900 mb-6">Yük Sahibi Mesajları</h2>

            <div class="flex flex-col gap-4">
                <div
                    v-for="message in displayMessages"
                    :key="message.id"
                    :class="[
                        'w-full min-h-[100px] rounded-2xl bg-white border border-gray-200 overflow-hidden cursor-pointer transition-all duration-300 shadow-sm hover:border-primary hover:shadow-md hover:-translate-y-0.5',
                        message.isRead ? 'opacity-60' : 'opacity-100'
                    ]"
                    @click="openMessageDetail(message)"
                >
                    <div class="flex justify-between items-center px-6 py-4 gap-6">
                        <div class="flex items-center gap-4 shrink-0">
                            <div class="w-14 h-14 rounded-full border-[1.5px] border-primary overflow-hidden flex items-center justify-center bg-white shrink-0">
                                <img src="@/assets/images/person.png" :alt="message.name" class="w-full h-full object-cover" />
                            </div>
                            <div class="flex flex-col gap-1">
                                <h3
                                    :class="[
                                        'text-base font-semibold leading-tight',
                                        message.isRead ? 'text-gray-500' : 'text-gray-900'
                                    ]"
                                >
                                    {{ message.name }}
                                </h3>
                                <p :class="['text-xs', message.isRead ? 'text-gray-400' : 'text-gray-500']">
                                    {{ message.time }}
                                </p>
                            </div>
                        </div>
                        <div class="flex-1 text-right">
                            <p
                                :class="[
                                    'text-sm text-gray-700 leading-relaxed line-clamp-2',
                                    message.isRead ? 'text-gray-500' : 'text-gray-700'
                                ]"
                            >
                                {{ message.lastMessage }}
                            </p>
                        </div>
                    </div>
                </div>
                <p
                    v-if="!displayMessages.length"
                    class="text-sm text-gray-500 py-8 text-center"
                >
                    Henüz mesaj gönderilmemiş
                </p>
            </div>
        </div>

        <!-- Mesaj Detayı ve Yazma Alanı (Mesaj seçildiğinde tam ekran) -->
        <div v-if="route.params.id && selectedMessage" class="w-full flex flex-col">
            <!-- Üst: Geri Butonu ve Mesaj Gönderen Bilgisi -->
            <div class="flex items-center gap-4 px-4 py-3 border-b border-gray-200 shrink-0">
                <button
                    type="button"
                    @click="goBackToMessages"
                    class="flex items-center justify-center w-10 h-10 rounded-full hover:bg-gray-100 transition-colors"
                    title="Geri"
                >
                    <i class="pi pi-arrow-left text-gray-700 text-lg" aria-hidden="true"></i>
                </button>
                <div class="w-14 h-14 rounded-full border-[1.5px] border-primary overflow-hidden flex items-center justify-center bg-white shrink-0">
                    <img src="@/assets/images/person.png" :alt="selectedMessage?.name" class="w-full h-full object-cover" />
                </div>
                <div class="flex-1 min-w-0">
                    <h3 class="text-lg font-semibold text-gray-900 truncate">{{ selectedMessage?.name }}</h3>
                    <p class="text-sm text-gray-500">{{ selectedMessage?.time }}</p>
                </div>
            </div>

            <!-- İlan (Shipment) kartı – en üstte -->
            <div
                v-if="conversationShipment && !threadLoading"
                class="mx-4 mt-2 mb-2 rounded-xl border border-gray-200 bg-white p-4 shadow-sm shrink-0"
            >
                <p class="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">İlan özeti</p>
                <div class="flex items-center gap-2 flex-wrap text-sm">
                    <span class="font-semibold text-gray-900">{{ conversationShipment.f_where_city }} / {{ conversationShipment.f_where_district }}</span>
                    <i class="pi pi-arrow-right text-primary text-xs"></i>
                    <span class="font-semibold text-gray-900">{{ conversationShipment.t_where_city }} / {{ conversationShipment.t_where_district }}</span>
                </div>
                <div class="flex items-center gap-3 mt-2 text-sm text-gray-600">
                    <span v-if="conversationShipment.hours">{{ conversationShipment.hours }}</span>
                    <span v-if="conversationShipment.price" class="font-semibold text-primary">{{ conversationShipment.price }}</span>
                </div>
            </div>

            <!-- Orta: Mesajlar (Scrollable) -->
            <div ref="messageThreadContainer" class="flex-1 overflow-y-auto px-4 py-4 bg-gray-50">
                <p v-if="threadLoading" class="text-sm text-gray-500 py-4">Mesajlar yükleniyor...</p>
                <div v-else class="flex flex-col gap-4">
                    <div
                        v-for="(msg, index) in messageThread"
                        :key="msg.type === 'teklif' ? `teklif-${msg.id}` : `msg-${msg.id ?? index}`"
                        :class="[
                            'max-w-[70%] flex flex-col gap-1',
                            msg.type === 'teklif' ? (msg.isMe ? 'self-end' : 'self-start') : 'py-3 px-4 rounded-2xl',
                            msg.type !== 'teklif' && (msg.isMe
                                ? 'bg-primary text-white self-end rounded-br-md'
                                : 'bg-white text-gray-700 self-start rounded-bl-md border border-gray-200')
                        ]"
                    >
                        <div v-if="msg.type === 'teklif'" class="rounded-lg border-2 border-primary/30 bg-white p-3 shadow-sm min-w-[200px] max-w-full">
                            <p class="text-xs font-semibold text-primary uppercase tracking-wide mb-2">Verilen Teklif</p>
                            <p v-if="msg.carName" class="text-sm font-medium text-gray-900 mb-1">{{ msg.carName }}</p>
                            <p class="text-sm font-semibold text-primary mb-1">{{ msg.price }}</p>
                            <p v-if="msg.message" class="text-sm text-gray-600 mt-2 border-t border-gray-100 pt-2">{{ msg.message }}</p>
                            <span class="text-xs text-gray-500 mt-2 block">{{ msg.time }}</span>
                            <button
                                v-if="isShipmentOwner && msg.status !== 'accepted'"
                                type="button"
                                class="mt-3 w-full py-2 rounded-lg bg-primary text-white font-semibold text-sm hover:bg-primary/90 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                                :disabled="teklifAcceptLoading === msg.id"
                                @click="acceptTeklif(msg.id)"
                            >
                                {{ teklifAcceptLoading === msg.id ? 'İşleniyor...' : 'Teklifi Kabul Et' }}
                            </button>
                            <p v-else-if="isShipmentOwner && msg.status === 'accepted'" class="mt-2 text-sm font-medium text-green-600">Kabul edildi</p>
                        </div>
                        <template v-else>
                            <p class="text-sm leading-relaxed m-0">{{ msg.text }}</p>
                            <span class="text-xs opacity-70 self-end">{{ msg.time }}</span>
                        </template>
                    </div>
                </div>
            </div>

            <!-- Özel teklif gönder (sadece araç sahibi /vehicle-owner/messages sayfasında) -->
            <div v-if="conversationShipment?.slug && isVehicleOwnerMessages" class="w-full shrink-0 border-t border-gray-200 p-3 bg-white">
                <button
                    type="button"
                    class="w-full py-2.5 px-3 rounded-lg border-2 border-primary text-primary font-semibold text-sm hover:bg-primary/5 transition-colors"
                    @click="showTeklifModal = true"
                >
                    Özel teklif gönder
                </button>
            </div>
            <!-- Alt: Mesaj Inputu -->
            <div class="px-4 py-3 border-t border-gray-200 shrink-0 bg-white">
                <form @submit.prevent="sendMessage" class="flex gap-3">
                    <input
                        v-model="newMessageText"
                        type="text"
                        class="flex-1 h-14 rounded-md text-sm outline-none px-4 bg-white border border-gray-200 text-gray-700 focus:ring-2 focus:ring-primary/20 focus:border-primary"
                        placeholder="Mesajınızı yazın..."
                    />
                    <button
                        type="submit"
                        class="px-6 py-3 bg-primary text-white font-semibold rounded-lg hover:bg-primary/90 transition-colors"
                    >
                        Gönder
                    </button>
                </form>
            </div>
        </div>

        <!-- Teklif Ver modal (sadece araç sahibi sayfasında) -->
        <Teleport to="body">
            <TeklifVerModal
                v-if="showTeklifModal && conversationShipment?.slug && isVehicleOwnerMessages"
                :slug="conversationShipment.slug"
                :shipment="conversationShipment"
                @close="showTeklifModal = false"
                @success="onTeklifModalSuccess"
            />
        </Teleport>
    </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, onBeforeUnmount, nextTick } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useMessageStore, formatMessageTime } from '@/stores/message';
import { useAuthStore } from '@/stores/auth';
import { getEcho } from '@/echo';
import api from '@/api';
import TeklifVerModal from '@/components/TeklifVerModal.vue';

const props = defineProps({
    messagesList: { type: Array, default: null },
    basePath: { type: String, default: '/vehicle-owner/messages' },
});

const route = useRoute();
const router = useRouter();
const messageStore = useMessageStore();
const authStore = useAuthStore();

const displayMessages = computed(() => props.messagesList ?? messages.value);

const messages = ref([
    {
        id: 1,
        name: 'Ahmet Yılmaz',
        avatar: '../assets/images/person.png',
        time: '2 saat önce',
        lastMessage: 'Merhaba, yükünüz için teklif hazırladım. Detayları görüşebilir miyiz?',
        isRead: true
    },
    {
        id: 2,
        name: 'Mehmet Demir',
        avatar: '../assets/images/person.png',
        time: '5 saat önce',
        lastMessage: 'Ankara\'dan İstanbul\'a taşımacılık için uygunum. Fiyat teklifi gönderebilirim.',
        isRead: false
    },
    {
        id: 3,
        name: 'Ali Kaya',
        avatar: '../assets/images/person.png',
        time: '1 gün önce',
        lastMessage: 'Yükünüz için uygun araçlarım var. İletişime geçebilir miyiz?',
        isRead: false
    },
    {
        id: 4,
        name: 'Fatma Şahin',
        avatar: '../assets/images/person.png',
        time: '2 gün önce',
        lastMessage: 'Taşımacılık konusunda deneyimliyim. Size yardımcı olabilirim.',
        isRead: true
    }
]);

const selectedMessage = ref(null);
const newMessageText = ref('');
const messageThread = ref([]);
const threadLoading = ref(false);
const messageThreadContainer = ref(null);
const conversationShipmentId = ref(null);
const conversationShipment = ref(null);
const teklifAcceptLoading = ref(null);
const showTeklifModal = ref(false);
let echoChannel = null;

async function onTeklifModalSuccess() {
    showTeklifModal.value = false;
    const otherUserId = route.params.id ? parseInt(route.params.id, 10) : null;
    const slug = conversationShipment.value?.slug;
    if (otherUserId && slug) {
        const res = await messageStore.getBySenderAndReceiver(otherUserId);
        const data = res?.data ?? [];
        try {
            const requestsRes = await api.get(`/shipments/${slug}/requests`);
            const content = requestsRes.data?.content ?? requestsRes.data?.data ?? requestsRes.data ?? {};
            const requests = content?.shipment?.requests ?? [];
            messageThread.value = buildMessageThreadWithTeklif(data, requests, authStore.user?.id, otherUserId);
        } catch (_) {
            if (Array.isArray(data)) messageThread.value = data;
        }
        scrollMessagesToBottom();
    }
}

const isShipmentOwner = computed(() => {
    const createrId = conversationShipment.value?.creater_id ?? conversationShipment.value?.creator_id;
    return createrId != null && Number(createrId) === Number(authStore.user?.id);
});

const isVehicleOwnerMessages = computed(() => String(props.basePath || '').includes('vehicle-owner'));

async function acceptTeklif(requestId) {
    const slug = conversationShipment.value?.slug;
    if (!slug) return;
    teklifAcceptLoading.value = requestId;
    try {
        await api.post(`/shipments/${slug}/requests/${requestId}/accept`);
        const otherUserId = route.params.id ? parseInt(route.params.id, 10) : null;
        if (otherUserId) {
            const res = await messageStore.getBySenderAndReceiver(otherUserId);
            const data = res?.data ?? [];
            const reqRes = await api.get(`/shipments/${slug}/requests`).catch(() => ({ data: {} }));
            const content = reqRes.data?.content ?? reqRes.data?.data ?? reqRes.data ?? {};
            const requests = content?.shipment?.requests ?? [];
            messageThread.value = buildMessageThreadWithTeklif(data, requests, authStore.user?.id, otherUserId);
            scrollMessagesToBottom();
        }
    } catch (err) {
        console.warn('Teklif kabul edilemedi:', err?.response?.data?.message ?? err?.message);
    } finally {
        teklifAcceptLoading.value = null;
    }
}

function buildMessageThreadWithTeklif(messages, requests, currentUserId, otherUserId) {
    const currentId = Number(currentUserId);
    const otherId = otherUserId != null ? Number(otherUserId) : null;
    const teklifItems = (requests || [])
        .filter((r) => {
            const uid = Number(r.user_id);
            return uid === currentId || (otherId != null && uid === otherId);
        })
        .map((r) => ({
            type: 'teklif',
            id: r.id,
            isMe: Number(r.user_id) === currentId,
            carName: r.car?.name ?? '',
            price: r.price ?? '—',
            message: r.message ?? '',
            time: formatMessageTime(r.created_at_raw ?? r.created_at),
            created_at: r.created_at_raw ?? r.created_at,
            status: r.status ?? 'pending',
        }));
    const withDate = [...(messages || []), ...teklifItems].filter((m) => m.created_at);
    withDate.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
    return withDate;
}

const openMessageDetail = (message) => {
    router.push(`${props.basePath}/${message.id}`);
};

const goBackToMessages = () => {
    router.push(props.basePath);
};

function scrollMessagesToBottom() {
    nextTick(() => {
        setTimeout(() => {
            const el = messageThreadContainer.value;
            if (el) el.scrollTop = el.scrollHeight;
        }, 50);
    });
}

const loadMessageDetail = async (messageId) => {
    const list = props.messagesList ?? messages.value;
    const message = list.find(m => m.id === messageId || m.id === parseInt(messageId, 10));
    if (message) {
        selectedMessage.value = message;
        if (props.messagesList) {
            threadLoading.value = true;
            conversationShipmentId.value = null;
            conversationShipment.value = null;
            const otherUserId = typeof messageId === 'string' ? parseInt(messageId, 10) : messageId;
            const result = await messageStore.getBySenderAndReceiver(otherUserId);
            const data = result?.data ?? [];
            conversationShipmentId.value = result?.conversationShipmentId ?? null;
            conversationShipment.value = result?.conversationShipment ?? null;
            const slug = conversationShipment.value?.slug;
            let thread = Array.isArray(data) ? data : [];
            if (slug) {
                try {
                    const requestsRes = await api.get(`/shipments/${slug}/requests`);
                    const content = requestsRes.data?.content ?? requestsRes.data?.data ?? requestsRes.data ?? {};
                    const requests = content?.shipment?.requests ?? [];
                    thread = buildMessageThreadWithTeklif(data, requests, authStore.user?.id, otherUserId);
                } catch (_) {}
            }
            messageThread.value = thread;
            threadLoading.value = false;
            scrollMessagesToBottom();
            const idsToMarkRead = (data || []).filter((m) => !m.isMe && m.id).map((m) => m.id);
            if (idsToMarkRead.length) await messageStore.markAsRead(idsToMarkRead);
        } else {
            messageThread.value = [
                { text: message.lastMessage, time: message.time, isMe: false },
                { text: 'Teşekkür ederim, detayları paylaşabilir misiniz?', time: '1 saat önce', isMe: true },
                { text: 'Tabii ki, yükünüzün ağırlığı ve boyutları nedir?', time: '30 dakika önce', isMe: false }
            ];
            scrollMessagesToBottom();
        }
    }
};

const sendMessage = async () => {
    const text = newMessageText.value?.trim();
    if (!text) return;

    if (props.messagesList) {
        const otherUserId = route.params.id ? parseInt(route.params.id, 10) : null;
        if (!otherUserId) return;
        newMessageText.value = '';
        const result = await messageStore.createMessage({
            receiver_id: otherUserId,
            message: text,
            shipment_id: conversationShipmentId.value ?? undefined,
        });
        if (!result.success) return;
        const res = await messageStore.getBySenderAndReceiver(otherUserId);
        const data = res?.data ?? [];
        conversationShipmentId.value = res?.conversationShipmentId ?? conversationShipmentId.value;
        conversationShipment.value = res?.conversationShipment ?? conversationShipment.value;
        const slug = conversationShipment.value?.slug;
        if (slug) {
            try {
                const requestsRes = await api.get(`/shipments/${slug}/requests`);
                const content = requestsRes.data?.content ?? requestsRes.data?.data ?? requestsRes.data ?? {};
                const requests = content?.shipment?.requests ?? [];
                messageThread.value = buildMessageThreadWithTeklif(data, requests, authStore.user?.id, otherUserId);
            } catch (_) {
                if (Array.isArray(data)) messageThread.value = data;
            }
        } else if (Array.isArray(data)) {
            messageThread.value = data;
        }
    } else {
        messageThread.value.push({ text, time: 'Şimdi', isMe: true });
        newMessageText.value = '';
    }
    scrollMessagesToBottom();
};

watch(
    () => [route.params.id, route.path],
    ([messageId, path]) => {
        if (path.includes('/messages') && messageId) {
            loadMessageDetail(parseInt(messageId));
        } else if (path === props.basePath || path === '/vehicle-owner/messages') {
            selectedMessage.value = null;
            messageThread.value = [];
            newMessageText.value = '';
            conversationShipmentId.value = null;
            conversationShipment.value = null;
        }
    },
    { immediate: true }
);

function handleOfferSent(e) {
    const currentOtherId = route.params.id ? parseInt(route.params.id, 10) : null;
    if (currentOtherId == null || Number(e.sender_id) !== Number(currentOtherId)) return;
    if (conversationShipment.value?.slug != null && e.shipment_slug !== conversationShipment.value.slug) return;
    const createdAt = e.created_at_raw || e.created_at;
    const teklifItem = {
        type: 'teklif',
        id: e.id,
        isMe: false,
        carName: e.car_name ?? '',
        price: e.price ?? '—',
        message: e.message ?? '',
        time: formatMessageTime(createdAt),
        created_at: createdAt,
        status: e.status ?? 'pending',
    };
    messageThread.value = [...messageThread.value, teklifItem].filter((m) => m.created_at).sort(
        (a, b) => new Date(a.created_at) - new Date(b.created_at)
    );
    scrollMessagesToBottom();
}

function setupPusherListener() {
    const echo = getEcho();
    const userId = authStore.user?.id;
    if (!echo || !userId) return;
    if (echoChannel) return;
    echoChannel = echo.private(`user.${userId}`)
        .listen('.message.sent', (e) => {
            const currentOtherId = route.params.id ? parseInt(route.params.id, 10) : null;
            if (e.receiver_id !== userId) return;
            if (currentOtherId !== null && Number(e.sender_id) !== Number(currentOtherId)) return;
            const time = formatMessageTime(e.created_at);
            messageThread.value = [...messageThread.value, { id: e.id, text: e.message, time, isMe: false, type: 'message', created_at: e.created_at }];
            scrollMessagesToBottom();
        })
        .listen('.offer.sent', handleOfferSent);
}

function removePusherListener() {
    if (echoChannel) {
        echoChannel.stopListening('.message.sent');
        echoChannel.stopListening('.offer.sent');
        echoChannel = null;
    }
}

onMounted(() => {
    if (route.path.includes('/messages') && route.params.id) {
        loadMessageDetail(parseInt(route.params.id));
    }
    setupPusherListener();
});

onBeforeUnmount(() => {
    removePusherListener();
});
</script>
