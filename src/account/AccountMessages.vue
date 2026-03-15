<template>
    <div class="flex flex-row gap-4 h-full min-h-0 w-full">
        <!-- Sol: Mesaj Listesi (Mesaj seçilmediğinde görünür) -->
        <div v-if="!route.params.id" class="w-full flex flex-col overflow-y-auto min-h-0">
            <h2 class="text-xl sm:text-2xl font-semibold text-gray-900 mb-4 sm:mb-6">Yük Sahibi Mesajları</h2>

            <div class="flex flex-col gap-3 sm:gap-4">
                <div
                    v-for="message in displayMessages"
                    :key="message.id"
                    :class="[
                        'w-full min-h-[80px] sm:min-h-[100px] rounded-xl sm:rounded-2xl bg-white border border-gray-200 overflow-hidden cursor-pointer transition-all duration-300 shadow-sm hover:border-primary hover:shadow-md active:scale-[0.99] sm:hover:-translate-y-0.5',
                        message.isRead ? 'opacity-60' : 'opacity-100'
                    ]"
                    @click="openMessageDetail(message)"
                >
                    <div class="flex flex-col sm:flex-row sm:justify-between sm:items-center px-4 sm:px-6 py-3 sm:py-4 gap-2 sm:gap-6">
                        <div class="flex items-center gap-3 sm:gap-4 shrink-0 min-w-0">
                            <div class="w-12 h-12 sm:w-14 sm:h-14 rounded-full border-[1.5px] border-primary overflow-hidden flex items-center justify-center bg-white shrink-0">
                                <img src="@/assets/images/person.png" :alt="message.name" class="w-full h-full object-cover" />
                            </div>
                            <div class="flex flex-col gap-0.5 min-w-0 flex-1 sm:flex-initial">
                                <h3
                                    :class="[
                                        'text-sm sm:text-base font-semibold leading-tight truncate',
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
                        <div class="flex-1 min-w-0 sm:text-right pl-[3.25rem] sm:pl-0">
                            <p
                                :class="[
                                    'text-xs sm:text-sm text-gray-700 leading-relaxed line-clamp-2',
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
        <div v-if="route.params.id && selectedMessage" class="w-full flex flex-col min-h-0 h-full">
            <!-- Üst: Geri Butonu ve Mesaj Gönderen Bilgisi -->
            <div class="flex items-center gap-3 sm:gap-4 px-3 sm:px-4 py-2.5 sm:py-3 border-b border-gray-200 shrink-0 bg-white">
                <button
                    type="button"
                    @click="goBackToMessages"
                    class="flex items-center justify-center min-w-[44px] min-h-[44px] w-10 h-10 rounded-full hover:bg-gray-100 active:bg-gray-200 transition-colors touch-manipulation"
                    title="Geri"
                    aria-label="Mesaj listesine dön"
                >
                    <i class="pi pi-arrow-left text-gray-700 text-lg" aria-hidden="true"></i>
                </button>
                <div class="w-12 h-12 sm:w-14 sm:h-14 rounded-full border-[1.5px] border-primary overflow-hidden flex items-center justify-center bg-white shrink-0">
                    <img src="@/assets/images/person.png" :alt="selectedMessage?.name" class="w-full h-full object-cover" />
                </div>
                <div class="flex-1 min-w-0">
                    <h3 class="text-base sm:text-lg font-semibold text-gray-900 truncate">{{ selectedMessage?.name }}</h3>
                    <p class="text-xs sm:text-sm text-gray-500 truncate">{{ selectedMessage?.time }}</p>
                </div>
            </div>

            <!-- Üst: İlan özeti + Talep (mobilde alt alta) -->
            <div
                v-if="(conversationShipment || conversationTeklif) && !threadLoading"
                class="mx-3 sm:mx-4 mt-2 mb-2 flex flex-col sm:flex-row gap-2 sm:gap-3 shrink-0"
            >
                <div
                    v-if="conversationShipment"
                    class="flex-1 rounded-xl border border-gray-200 bg-white p-3 sm:p-4 shadow-sm min-w-0"
                >
                    <p class="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5 sm:mb-2">İlan özeti</p>
                    <div class="flex items-center gap-1.5 sm:gap-2 flex-wrap text-xs sm:text-sm">
                        <span class="font-semibold text-gray-900">{{ conversationShipment.f_where_city }} / {{ conversationShipment.f_where_district }}</span>
                        <i class="pi pi-arrow-right text-primary text-xs shrink-0"></i>
                        <span class="font-semibold text-gray-900">{{ conversationShipment.t_where_city }} / {{ conversationShipment.t_where_district }}</span>
                    </div>
                    <div class="flex items-center gap-2 sm:gap-3 mt-1.5 sm:mt-2 text-xs sm:text-sm text-gray-600 flex-wrap">
                        <span v-if="conversationShipment.hours">{{ conversationShipment.hours }}</span>
                        <span v-if="conversationShipment.price" class="font-semibold text-primary">{{ conversationShipment.price }}</span>
                    </div>
                </div>
                <div
                    v-if="conversationTeklif"
                    class="flex-1 rounded-xl border-2 border-primary/30 bg-white p-3 sm:p-4 shadow-sm min-w-0"
                >
                    <p class="text-xs font-semibold text-primary uppercase tracking-wide mb-1.5 sm:mb-2">Talep / Teklif</p>
                    <p v-if="conversationTeklif.carName" class="text-xs sm:text-sm font-medium text-gray-900 mb-1">{{ conversationTeklif.carName }}</p>
                    <p class="text-xs sm:text-sm font-semibold text-primary mb-1">{{ conversationTeklif.price }}</p>
                    <p v-if="conversationTeklif.message" class="text-xs sm:text-sm text-gray-600 mt-2 border-t border-gray-100 pt-2 line-clamp-2">{{ conversationTeklif.message }}</p>
                    <span class="text-xs text-gray-500 mt-2 block">{{ conversationTeklif.time }}</span>
                    <button
                        v-if="isShipmentOwner && conversationTeklif.status !== 'accepted'"
                        type="button"
                        class="mt-3 w-full min-h-[44px] py-2.5 rounded-lg bg-primary text-white font-semibold text-sm hover:bg-primary/90 active:bg-primary/80 transition-colors disabled:opacity-60 disabled:cursor-not-allowed touch-manipulation"
                        :disabled="teklifAcceptLoading === conversationTeklif.id"
                        @click="acceptTeklif(conversationTeklif.id)"
                    >
                        {{ teklifAcceptLoading === conversationTeklif.id ? 'İşleniyor...' : 'Teklifi Kabul Et' }}
                    </button>
                    <p v-else-if="isShipmentOwner && conversationTeklif.status === 'accepted'" class="mt-2 text-xs sm:text-sm font-medium text-green-600">Kabul edildi</p>
                </div>
            </div>

            <!-- Orta: Mesajlar (Scrollable) - mobilde kutular en sola/en sağa yaslı -->
            <div ref="messageThreadContainer" class="flex-1 min-h-0 overflow-y-auto overflow-x-hidden px-2 sm:px-4 py-3 sm:py-4 bg-gray-50">
                <p v-if="threadLoading" class="text-sm text-gray-500 py-4">Mesajlar yükleniyor...</p>
                <div v-else class="flex flex-col gap-3 sm:gap-4">
                    <div
                        v-for="(msg, index) in messageThread"
                        :key="msg.type === 'teklif' ? `teklif-${msg.id}` : `msg-${msg.id ?? index}`"
                        :class="[
                            'flex flex-col gap-1 py-2.5 sm:py-3 px-3 sm:px-4 rounded-2xl',
                            'max-w-[90%] sm:max-w-[70%]',
                            msg.isMe ? 'self-end ml-auto' : 'self-start mr-auto',
                            msg.type !== 'teklif' && (msg.isMe
                                ? 'bg-primary text-white rounded-br-md'
                                : 'bg-white text-gray-700 rounded-bl-md border border-gray-200')
                        ]"
                    >
                        <div class="min-w-0">
                            <p class="md:text-sm text-xs leading-relaxed m-0 break-words">{{ msg.text }}</p>
                            <span class="md:text-xs text-xs opacity-70 mt-1 block">{{ msg.time }}</span>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Özel teklif gönder (sadece araç sahibi /vehicle-owner/messages sayfasında) -->
            <div v-if="conversationShipment?.slug && isVehicleOwnerMessages" class="w-full shrink-0 border-t border-gray-200 p-2.5 sm:p-3 bg-white">
                <button
                    type="button"
                    class="w-full min-h-[44px] py-2.5 sm:py-2.5 px-3 rounded-lg border-2 border-primary text-primary font-semibold text-sm hover:bg-primary/5 active:bg-primary/10 transition-colors touch-manipulation"
                    @click="showTeklifModal = true"
                >
                    Özel teklif gönder
                </button>
            </div>
            <!-- Alt: Mesaj Inputu -->
            <div class="px-3 sm:px-4 py-2.5 sm:py-3 border-t border-gray-200 shrink-0 bg-white">
                <form @submit.prevent="sendMessage" class="flex gap-2 sm:gap-3 items-end">
                    <input
                        v-model="newMessageText"
                        type="text"
                        class="flex-1 min-w-0 h-12 sm:h-14 rounded-xl sm:rounded-md text-sm outline-none px-3 sm:px-4 bg-white border border-gray-200 text-gray-700 focus:ring-2 focus:ring-primary/20 focus:border-primary"
                        placeholder="Mesajınızı yazın..."
                    />
                    <button
                        type="submit"
                        class="shrink-0 min-h-[48px] sm:min-h-[56px] px-4 sm:px-6 py-3 bg-primary text-white font-semibold rounded-xl sm:rounded-lg hover:bg-primary/90 active:bg-primary/80 transition-colors touch-manipulation text-sm sm:text-base"
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
import { usePusherMessages } from '@/composables/usePusherMessages';
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

const emit = defineEmits(['refresh']);

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

/** Sohbette gönderilmiş talep/teklif – en üstte ilan özetinin yanında (en son teklif) */
const conversationTeklif = computed(() => {
    const list = messageThread.value || [];
    const teklifs = list.filter((m) => m.type === 'teklif');
    if (!teklifs.length) return null;
    return teklifs[teklifs.length - 1];
});

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
        const tempId = `temp-${Date.now()}`;
        const optimisticMsg = { id: tempId, text, time: 'Şimdi', isMe: true, type: 'message', created_at: new Date().toISOString() };
        messageThread.value = [...messageThread.value, optimisticMsg];
        newMessageText.value = '';
        scrollMessagesToBottom();

        const result = await messageStore.createMessage({
            receiver_id: otherUserId,
            message: text,
            shipment_id: conversationShipmentId.value ?? undefined,
        });
        if (!result.success) {
            messageThread.value = messageThread.value.filter((m) => m.id !== tempId);
            return;
        }
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
        scrollMessagesToBottom();
    } else {
        messageThread.value.push({ text, time: 'Şimdi', isMe: true });
        newMessageText.value = '';
        scrollMessagesToBottom();
    }
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
    if (conversationShipment.value?.slug != null && e.shipment_slug != null && e.shipment_slug !== conversationShipment.value.slug) return;
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

const userIdRef = computed(() => authStore.user?.id);
const { connect: connectPusher } = usePusherMessages(userIdRef, {
    onMessageSent(e) {
        const userId = authStore.user?.id;
        if (userId == null || Number(e.receiver_id) !== Number(userId)) return;
        const currentOtherId = route.params.id ? parseInt(route.params.id, 10) : null;
        if (currentOtherId !== null && Number(e.sender_id) !== Number(currentOtherId)) return;
        const time = formatMessageTime(e.created_at);
        messageThread.value = [...messageThread.value, { id: e.id, text: e.message, time, isMe: false, type: 'message', created_at: e.created_at }];
        scrollMessagesToBottom();
        emit('refresh');
    },
    onOfferSent(e) {
        handleOfferSent(e);
        emit('refresh');
    },
});

onMounted(() => {
    if (route.path.includes('/messages') && route.params.id) {
        loadMessageDetail(parseInt(route.params.id));
    }
    connectPusher();
});
</script>
