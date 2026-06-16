<template>
    <div class="flex h-full min-h-0 w-full min-w-0 flex-1 flex-col overflow-hidden">
        <!-- Sol: Mesaj Listesi (Mesaj seçilmediğinde görünür) -->
        <div v-if="!route.params.id" class="flex h-full min-h-0 w-full min-w-0 flex-1 flex-col overflow-y-auto overflow-x-hidden md:p-4">
            <!-- Mobil: üst bar geri butonu + başlık -->
            <div class="md:hidden flex items-center gap-3 px-1 py-3 pb-4 border-b border-gray-100 shrink-0">
                <button
                    type="button"
                    @click="goBackFromList"
                    class="flex items-center justify-center min-w-[44px] min-h-[44px] rounded-full hover:bg-gray-100 active:bg-gray-200 transition-colors touch-manipulation text-gray-700"
                    aria-label="Geri"
                >
                    <i class="pi pi-arrow-left text-lg" aria-hidden="true"></i>
                </button>
                <h2 class="text-lg font-semibold text-gray-900 truncate flex-1">Mesajlar</h2>
            </div>

            <h2 class="hidden md:block text-xl sm:text-2xl font-semibold text-gray-900 mb-4 sm:mb-6">
                {{ isVehicleOwnerMessages ? 'Yük Sahibi Mesajları' : 'Araç Sahibi Mesajları' }}
            </h2>
            <p class="hidden md:block text-sm text-gray-500 -mt-3 mb-4 sm:mb-6">
                {{ isVehicleOwnerMessages ? 'Yük sahipleriyle mesajlaşın.' : 'Araç sahipleriyle mesajlaşın.' }}
            </p>

            <div
                v-if="isVehicleOwnerMessages && !hasVehicle"
                class="mb-3 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3"
            >
                <p class="text-sm text-amber-900">
                    Mesaj göndermek için önce bir araç eklemelisiniz.
                </p>
                <button
                    type="button"
                    class="mt-2 inline-flex items-center gap-2 rounded-lg border border-amber-300 bg-white px-3 py-2 text-sm font-semibold text-amber-800 hover:bg-amber-100 transition-colors"
                    @click="router.push('/vehicle-owner/vehicles')"
                >
                    <i class="pi pi-car" aria-hidden="true"></i>
                    Araç Ekle
                </button>
            </div>

            <div class="flex flex-col gap-5 sm:gap-7 pt-2 md:pt-0">
                <div
                    v-for="message in displayMessages"
                    :key="message.rowKey ?? `${message.id}-${message.shipmentId ?? 'none'}`"
                    :class="[
                        'group relative w-full rounded-2xl  cursor-pointer transition-all duration-200',
                        'bg-white border border-gray-300 hover:border-primary/30 hover:shadow-md hover:shadow-primary/5',
                        'active:scale-[0.99] sm:active:scale-100',
                        message.isRead ? 'opacity-75' : 'opacity-100'
                    ]"
                    @click="openMessageDetail(message)"
                >
                    <div
                        v-if="message.shipmentRoute"
                        class="absolute right-2 -top-3 z-1 max-w-[62%] rounded-md bg-primary px-2 py-1 text-[10px] font-semibold text-white shadow-sm truncate"
                        :title="message.shipmentRoute"
                    >
                        {{ message.shipmentRoute }}
                    </div>
                    <div class="flex items-center gap-4 p-4 sm:p-5">
                        <div class="relative shrink-0">
                            <div class="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl overflow-hidden bg-primary/10 text-primary flex items-center justify-center ring-2 ring-gray-100 group-hover:ring-primary/20 transition-all font-semibold text-sm sm:text-base">
                                <span>{{ getInitials(message.name) }}</span>
                            </div>
                            <span
                                v-if="!message.isRead"
                                class="absolute -top-0.5 -right-0.5 w-3 h-3 rounded-full bg-primary ring-2 ring-white"
                                aria-hidden="true"
                            />
                        </div>
                        <div class="flex-1 min-w-0">
                            <div class="flex items-baseline justify-between gap-2 mb-0.5">
                                <h3
                                    :class="[
                                        'text-sm sm:text-base font-semibold truncate',
                                        message.isRead ? 'text-gray-600' : 'text-gray-900'
                                    ]"
                                >
                                    {{ message.name }}
                                </h3>
                                <span :class="['text-xs shrink-0', message.isRead ? 'text-gray-400' : 'text-gray-500']">
                                    {{ message.time }}
                                </span>
                            </div>
                            <p
                                :class="[
                                    'text-sm leading-snug line-clamp-2',
                                    message.isRead ? 'text-gray-500' : 'text-gray-700'
                                ]"
                            >
                                {{ message.lastMessage || 'Mesaj yok' }}
                            </p>
                        </div>
                        <div class="shrink-0">
                            <img
                                v-if="message.avatarUrl"
                                :src="message.avatarUrl"
                                :alt="message.name"
                                class="h-10 w-10 rounded-full object-cover ring-2 ring-primary/15"
                                loading="lazy"
                                referrerpolicy="no-referrer"
                                @error="message.avatarUrl = null"
                            />
                            <i
                                v-else
                                class="pi pi-chevron-right text-gray-300 group-hover:text-primary text-sm transition-colors"
                                aria-hidden="true"
                            ></i>
                        </div>
                    </div>
                </div>
                <p
                    v-if="!displayMessages.length"
                    class="text-sm text-gray-500 py-12 text-center rounded-2xl bg-gray-50/80 border border-dashed border-gray-200"
                >
                    Henüz mesaj gönderilmemiş
                </p>
            </div>
        </div>

        <!-- Mesaj Detayı ve Yazma Alanı (Mesaj seçildiğinde tam ekran) -->
        <div
            v-if="route.params.id && selectedMessage"
            class="flex h-full min-h-0 w-full min-w-0 flex-1 flex-col overflow-hidden"
        >
            <!-- Üst: Geri Butonu ve Mesaj Gönderen Bilgisi -->
            <div class="flex items-center gap-3 sm:gap-4 px-3 sm:px-4 py-2 sm:py-2.5 border-b border-gray-200 shrink-0 bg-white min-h-0">
                <button
                    type="button"
                    @click="goBackToMessages"
                    class="flex items-center justify-center min-w-[44px] min-h-[44px] w-10 h-10 rounded-full hover:bg-gray-100 active:bg-gray-200 transition-colors touch-manipulation"
                    title="Geri"
                    aria-label="Mesaj listesine dön"
                >
                    <i class="pi pi-arrow-left text-gray-700 text-lg" aria-hidden="true"></i>
                </button>
                <div class="w-12 h-12 sm:w-14 sm:h-14 rounded-full border-[1.5px] border-primary overflow-hidden flex items-center justify-center bg-primary/10 text-primary shrink-0 font-semibold text-sm sm:text-base">
                    {{ getInitials(selectedMessage?.name) }}
                </div>
                <div class="flex-1 min-w-0">
                    <h3 class="text-base sm:text-lg font-semibold text-gray-900 truncate">{{ selectedMessage?.name }}</h3>
                    <p class="text-xs sm:text-sm text-gray-500 truncate">{{ selectedMessage?.time }}</p>
                </div>
            </div>

            <!-- Üst: İlan özeti (Expo ConversationThreadContext) -->
            <div
                v-if="showListingPanel && !threadLoading"
                class="mx-3 sm:mx-4 mt-1.5 mb-1.5 shrink-0"
            >
                <div class="rounded-xl border border-gray-200 bg-gray-50 overflow-hidden shadow-sm">
                    <button
                        type="button"
                        class="w-full flex items-center justify-between gap-2 p-3 sm:p-4 text-left hover:bg-gray-100/80 transition-colors"
                        :aria-expanded="listingDetailsOpen"
                        @click="listingDetailsOpen = !listingDetailsOpen"
                    >
                        <div class="min-w-0 flex-1">
                            <p class="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">İlan özeti</p>
                            <p v-if="!listingDetailsOpen" class="text-sm font-semibold text-gray-900 truncate">
                                {{ listingRoutePreview }}
                            </p>
                        </div>
                        <i :class="['pi text-gray-500 shrink-0', listingDetailsOpen ? 'pi-chevron-up' : 'pi-chevron-down']" aria-hidden="true"></i>
                    </button>
                    <div v-if="listingDetailsOpen" class="px-3 sm:px-4 pb-3 sm:pb-4 border-t border-gray-200/80 space-y-2">
                        <div v-if="listingFromLine">
                            <p class="text-xs font-bold text-slate-600">Kalkış</p>
                            <p class="text-sm font-semibold text-gray-900">{{ listingFromLine }}</p>
                        </div>
                        <div v-if="listingToLine">
                            <p class="text-xs font-bold text-slate-600">Varış</p>
                            <p class="text-sm font-semibold text-gray-900">{{ listingToLine }}</p>
                        </div>
                        <div>
                            <p class="text-xs font-bold text-slate-600">Kalkış saati</p>
                            <p class="text-sm font-semibold text-gray-900">{{ conversationShipment.departure_time || '—' }}</p>
                        </div>
                        <div>
                            <p class="text-xs font-bold text-slate-600">Varış saati</p>
                            <p class="text-sm font-semibold text-gray-900">{{ conversationShipment.time_arrival || '—' }}</p>
                        </div>
                        <button
                            v-if="conversationShipment?.slug"
                            type="button"
                            class="mt-2 w-full py-2 rounded-lg border border-primary/35 bg-primary/10 text-primary text-sm font-bold hover:bg-primary/15 transition-colors"
                            @click="goToShipment(conversationShipment.slug)"
                        >
                            İlan detayı
                        </button>
                    </div>
                </div>
            </div>

            <!-- Orta: Mesajlar (Scrollable) - mobilde kutular en sola/en sağa yaslı, tek scroll alanı -->
            <div ref="messageThreadContainer" class="flex-1 min-h-0 min-w-0 overflow-y-auto overflow-x-hidden px-2 sm:px-4 py-3 sm:py-4 bg-gray-50 overscroll-contain">
                <p v-if="threadLoading" class="text-sm text-gray-500 py-4">Mesajlar yükleniyor...</p>
                <div v-else class="flex flex-col gap-3 sm:gap-4">
                    <div
                        v-for="(msg, index) in visibleMessageThread"
                        :key="msg.type === 'system' ? `sys-${msg.id}` : msg.type === 'request' ? `req-${msg.id}` : `msg-${msg.id ?? index}`"
                        :class="[
                            msg.type === 'system' || msg.type === 'request'
                                ? 'self-center max-w-[95%] sm:max-w-[90%]'
                                : 'flex flex-col gap-1 py-2.5 sm:py-3 px-3 sm:px-4 rounded-2xl max-w-[90%] sm:max-w-[70%]',
                            msg.type !== 'system' && msg.type !== 'request' && (msg.isMe ? 'self-end ml-auto' : 'self-start mr-auto'),
                            msg.type !== 'system' && msg.type !== 'request' && (msg.isMe
                                ? 'bg-primary text-white rounded-br-md'
                                : 'bg-white text-gray-700 rounded-bl-md border border-gray-200')
                        ]"
                    >
                        <template v-if="msg.type === 'request'">
                            <component
                                :is="canOpenRequestOffer(msg) ? 'button' : 'div'"
                                type="button"
                                class="rounded-full border border-pink-200 bg-pink-50/95 px-3 py-2 sm:px-4 sm:py-2.5 text-center shadow-sm w-full"
                                :class="canOpenRequestOffer(msg) ? 'cursor-pointer hover:bg-pink-100/90 active:bg-pink-100' : ''"
                                @click="canOpenRequestOffer(msg) && openRequestOffer()"
                            >
                                <p class="text-xs sm:text-sm font-medium text-pink-900 m-0 leading-snug">{{ msg.text }}</p>
                                <span class="text-[10px] sm:text-xs text-pink-600 mt-1 block">{{ msg.time }}</span>
                            </component>
                        </template>
                        <template v-else-if="msg.type === 'system'">
                            <div
                                class="rounded-full border border-slate-200 bg-slate-100/90 px-3 py-2 sm:px-4 sm:py-2.5 text-center shadow-sm w-full"
                            >
                                <p class="text-xs sm:text-sm font-medium text-slate-700 m-0 leading-snug">{{ msg.text }}</p>
                                <span class="text-[10px] sm:text-xs text-slate-500 mt-1 block">{{ msg.time }}</span>
                            </div>
                        </template>
                        <div v-else class="min-w-0">
                            <p class="md:text-sm text-xs leading-relaxed m-0 break-words">{{ msg.text }}</p>
                            <span class="md:text-xs text-xs opacity-70 mt-1 block">{{ msg.time }}</span>
                        </div>
                    </div>
                </div>
            </div>

        
            <div
                v-if="conversationShipment?.slug && isVehicleOwnerMessages && !shipmentAccepted"
                class="w-full shrink-0 border-t border-gray-200 p-2 sm:p-3 bg-white min-h-0"
            >
                <button
                    type="button"
                    class="w-full min-h-[44px] py-2.5 sm:py-2.5 px-3 rounded-lg border-2 border-primary text-primary font-semibold text-sm hover:bg-primary/5 active:bg-primary/10 transition-colors touch-manipulation disabled:opacity-50 disabled:cursor-not-allowed"
                    :disabled="!canSendMessage"
                    @click="showTeklifModal = true"
                >
                    Özel teklif gönder
                </button>
            </div>
            <!-- Alt: Mesaj Inputu (tam genişlik, taşma yok; güvenli alan) -->
            <div
                class="w-full min-w-0 max-w-full shrink-0 border-t border-gray-200 bg-white px-2 pt-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] sm:px-4 sm:py-3"
            >
                <form
                    @submit.prevent="sendMessage"
                    class="flex w-full min-w-0 max-w-full items-stretch gap-2 sm:gap-3"
                >
                    <input
                        v-model="newMessageText"
                        type="text"
                        enterkeyhint="send"
                        autocomplete="off"
                        :maxlength="MESSAGE_MAX_LENGTH"
                        class="min-w-0 flex-1 rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-[16px] leading-snug text-gray-700 outline-none sm:rounded-lg sm:py-3 sm:text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-400"
                        :disabled="!canSendMessage"
                        :placeholder="
                            !canSendMessage
                                ? 'Mesaj göndermek için önce araç ekleyin.'
                                : 'Mesajınızı yazın...'
                        "
                    />
                    <button
                        type="submit"
                        class="shrink-0 rounded-xl bg-primary px-3 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-primary/90 active:bg-primary/80 disabled:cursor-not-allowed disabled:opacity-50 sm:rounded-lg sm:px-5 sm:py-3 sm:text-base touch-manipulation"
                        :disabled="!canSendMessage"
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
import { useRoute, useRouter, RouterLink } from 'vue-router';
import { useMessageStore } from '@/stores/message';
import { useAuthStore } from '@/stores/auth';
import { useInboxUnreadStore } from '@/stores/inbox-unread';
import { usePusherMessages } from '@/composables/usePusherMessages';
import {
    conversationEventMatchesThread,
    conversationShipmentHasListingPanel,
    formatConversationShipmentEndpoint,
    mapConversationMessageFromEvent,
} from '@/lib/message-helpers';
import api from '@/api';
import TeklifVerModal from '@/components/TeklifVerModal.vue';
import { MESSAGE_MAX_LENGTH } from '@/lib/message-limits';

const props = defineProps({
    messagesList: { type: Array, default: null },
    basePath: { type: String, default: '/vehicle-owner/messages' },
});

const route = useRoute();
const router = useRouter();
const messageStore = useMessageStore();
const authStore = useAuthStore();

const emit = defineEmits(['refresh']);

const inboxUnread = useInboxUnreadStore();

const displayMessages = computed(() => props.messagesList ?? []);

const selectedMessage = ref(null);
const newMessageText = ref('');
const messageThread = ref([]);
const threadLoading = ref(false);
const messageThreadContainer = ref(null);
const conversationShipmentId = ref(null);
const conversationShipment = ref(null);
const showTeklifModal = ref(false);
const hasVehicle = ref(true);
const listingDetailsOpen = ref(false);

const canSendMessage = computed(() => {
    if (!isVehicleOwnerMessages.value) return true;
    return hasVehicle.value;
});

const showListingPanel = computed(() => conversationShipmentHasListingPanel(conversationShipment.value));

const listingFromLine = computed(() =>
    conversationShipment.value
        ? formatConversationShipmentEndpoint(
              conversationShipment.value.f_where_city,
              conversationShipment.value.f_where_district
          )
        : ''
);

const listingToLine = computed(() =>
    conversationShipment.value
        ? formatConversationShipmentEndpoint(
              conversationShipment.value.t_where_city,
              conversationShipment.value.t_where_district
          )
        : ''
);

const listingRoutePreview = computed(() => {
    if (listingFromLine.value && listingToLine.value) {
        return `${listingFromLine.value} → ${listingToLine.value}`;
    }
    return listingFromLine.value || listingToLine.value || 'İlan bilgisi';
});

async function onTeklifModalSuccess() {
    showTeklifModal.value = false;
    const otherUserId = route.params.id ? parseInt(route.params.id, 10) : null;
    if (otherUserId) {
        const res = await messageStore.getBySenderAndReceiver(otherUserId, conversationShipmentId.value);
        const data = res?.data ?? [];
        messageThread.value = buildMessageThread(data);
        scrollMessagesToBottom();
    }
}

const isVehicleOwnerMessages = computed(() => String(props.basePath || '').includes('vehicle-owner'));

const isShipmentOwner = computed(() => {
    const createrId = conversationShipment.value?.creater_id ?? conversationShipment.value?.creator_id;
    return createrId != null && Number(createrId) === Number(authStore.user?.id);
});

function canOpenRequestOffer(msg) {
    if (msg?.type !== 'request') return false;
    if (isVehicleOwnerMessages.value) return false;
    return isShipmentOwner.value && !!conversationShipment.value?.slug;
}

function openRequestOffer() {
    const slug = conversationShipment.value?.slug;
    if (slug) goToShipment(slug);
}

function getInitials(name) {
    if (!name || typeof name !== 'string') return '?';
    const words = name.trim().split(/\s+/).filter(Boolean);
    if (!words.length) return '?';
    const first = words[0][0] ?? '';
    const last = words.length > 1 ? (words[words.length - 1][0] ?? '') : (words[0][1] ?? words[0][0] ?? '');
    return (first + last).toUpperCase();
}

const visibleMessageThread = computed(() =>
    (messageThread.value || []).filter((m) => m.type !== 'teklif')
);

/** İlan anlaşmaya döndüyse (bilgilendirme amaçlı) */
const shipmentAccepted = computed(() => {
    const s = conversationShipment.value?.status ?? conversationShipment.value?.shipment?.status;
    return s === 'accepted';
});

function buildMessageThread(messages) {
    const withDate = (messages || []).filter((m) => m.created_at && m.type !== 'teklif');
    withDate.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
    return withDate;
}

const openMessageDetail = (message) => {
    const query = {};
    if (message?.shipmentId != null) {
        query.shipment_id = String(message.shipmentId);
    }
    router.push({ path: `${props.basePath}/${message.id}`, query });
};

const goBackToMessages = () => {
    router.push(props.basePath);
};

const goToShipment = (slug) => {
    if (!slug) return;
    if (isVehicleOwnerMessages.value) {
        router.push({ path: `/posts/${slug}` });
    } else {
        router.push({ path: `/product/${slug}` });
    }
};

/** Mobil liste ekranında geri: ana panele (cargo-owner / vehicle-owner) dön */
const goBackFromList = () => {
    const path = (props.basePath || '').replace(/\/messages\/?$/, '') || '/cargo-owner';
    router.push(path);
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
    const list = props.messagesList ?? [];
    const shipmentIdFromRoute = route.query?.shipment_id != null ? Number(route.query.shipment_id) : null;
    const normalizedMessageId = typeof messageId === 'string' ? parseInt(messageId, 10) : messageId;
    const message = list.find((m) => {
        const sameUser = m.id === messageId || m.id === normalizedMessageId;
        if (!sameUser) return false;
        if (shipmentIdFromRoute == null) return true;
        return Number(m.shipmentId) === shipmentIdFromRoute;
    });
    if (message) {
        selectedMessage.value = message;
        if (props.messagesList) {
            threadLoading.value = true;
            conversationShipmentId.value = null;
            conversationShipment.value = null;
            const otherUserId = normalizedMessageId;
            const currentShipmentId = shipmentIdFromRoute ?? message.shipmentId ?? null;
            const result = await messageStore.getBySenderAndReceiver(otherUserId, currentShipmentId);
            const data = result?.data ?? [];
            conversationShipmentId.value = currentShipmentId ?? result?.conversationShipmentId ?? null;
            conversationShipment.value = result?.conversationShipment ?? null;
            listingDetailsOpen.value = false;
            messageThread.value = buildMessageThread(Array.isArray(data) ? data : []);
            threadLoading.value = false;
            scrollMessagesToBottom();
            const idsToMarkRead = (data || []).filter((m) => m.id && !m.isMe).map((m) => m.id);
            if (idsToMarkRead.length) {
                await messageStore.markAsRead(idsToMarkRead);
                void inboxUnread.fetchHasUnread();
            }
        }
    }
};

const sendMessage = async () => {
    const text = newMessageText.value?.trim();
    if (!text) return;
    if (!canSendMessage.value) return;
    if (!props.messagesList) return;

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
    const res = await messageStore.getBySenderAndReceiver(otherUserId, conversationShipmentId.value);
    const data = res?.data ?? [];
    conversationShipmentId.value = res?.conversationShipmentId ?? conversationShipmentId.value;
    conversationShipment.value = res?.conversationShipment ?? conversationShipment.value;
    messageThread.value = buildMessageThread(Array.isArray(data) ? data : []);
    scrollMessagesToBottom();
};

async function checkVehicleOwnerCars() {
    if (!isVehicleOwnerMessages.value) {
        hasVehicle.value = true;
        return;
    }
    try {
        const res = await api.get('/cars/my');
        const cars = res.data?.content?.cars;
        hasVehicle.value = Array.isArray(cars) && cars.length > 0;
    } catch {
        hasVehicle.value = false;
    }
}

watch(
    () => [route.params.id, route.path, route.query.shipment_id],
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

/** Socket: teklif kabul → mesajlar inactive; liste + açık sohbet anlık güncellenir */
function handleOfferAccepted(e) {
    emit('refresh');
    const slug = e?.shipment_slug;
    const sid = e?.shipment_id;
    const matchesOpenThread =
        route.params.id &&
        ((slug && conversationShipment.value?.slug === slug) ||
            (sid != null && conversationShipmentId.value != null && Number(conversationShipmentId.value) === Number(sid)));
    if (matchesOpenThread) {
        const id = parseInt(route.params.id, 10);
        if (!Number.isNaN(id)) loadMessageDetail(id);
    }
}

function handleOfferSent(e) {
    const currentOtherId = route.params.id ? parseInt(route.params.id, 10) : null;
    if (currentOtherId == null || Number(e.sender_id) !== Number(currentOtherId)) return;
    if (conversationShipment.value?.slug != null && e.shipment_slug != null && e.shipment_slug !== conversationShipment.value.slug) return;
    emit('refresh');
    if (!Number.isNaN(currentOtherId)) loadMessageDetail(currentOtherId);
}

const userIdRef = computed(() => authStore.user?.id);
const { connect: connectPusher } = usePusherMessages(userIdRef, {
    onMessageSent(e) {
        const userId = authStore.user?.id;
        if (userId == null) return;
        inboxUnread.applyMessageSent(e, userId);
        const currentOtherId = route.params.id ? parseInt(route.params.id, 10) : null;
        if (currentOtherId == null || Number.isNaN(currentOtherId)) {
            emit('refresh');
            return;
        }
        if (!conversationEventMatchesThread(e, userId, currentOtherId, conversationShipmentId.value)) return;
        const row = mapConversationMessageFromEvent(e, userId);
        messageThread.value = [...messageThread.value, row].sort(
            (x, y) => new Date(x.created_at) - new Date(y.created_at)
        );
        scrollMessagesToBottom();
        if (Number(e.receiver_id) === Number(userId) && e.id) {
            void messageStore.markAsRead([e.id]).then(() => inboxUnread.fetchHasUnread());
        }
        emit('refresh');
    },
    onInboxUnreadUpdated(e) {
        inboxUnread.syncFromCount(e?.unread_count);
    },
    onOfferSent(e) {
        handleOfferSent(e);
        emit('refresh');
    },
    onOfferAccepted(e) {
        handleOfferAccepted(e);
    },
});

onMounted(() => {
    if (route.path.includes('/messages') && route.params.id) {
        loadMessageDetail(parseInt(route.params.id));
    }
    void checkVehicleOwnerCars();
    connectPusher();
    document.body.style.overflow = 'hidden';
});

onBeforeUnmount(() => {
    document.body.style.overflow = '';
});
</script>
