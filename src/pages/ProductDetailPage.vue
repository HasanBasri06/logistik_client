<template>
    <Header />
    <div class="min-h-[calc(100vh-64px)] bg-gray-50/60">
        <Content class="py-6 md:py-8">
            <div class="flex flex-col gap-6 lg:flex-row lg:gap-8">
                <!-- Sol: Ana içerik -->
                <div class="flex-1 min-w-0 flex flex-col gap-6 order-2 lg:order-1">
                    <!-- İlan özeti kartı (mobilde üstte) -->
                    <section
                        v-if="!loading && !error && shipment"
                        class="rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden"
                    >
                        <div class="p-5 md:p-6">
                            <div class="flex flex-col gap-4 md:flex-row md:items-center md:justify-between md:gap-6">
                                <div class="flex flex-col gap-1">
                                    <p class="text-xs font-medium text-primary uppercase tracking-wide">Güzergah</p>
                                    <div class="flex flex-wrap items-center gap-2 md:gap-3">
                                        <span class="text-lg md:text-xl font-bold text-gray-900">{{ routeFrom }}</span>
                                        <i class="pi pi-arrow-right text-primary text-sm"></i>
                                        <span class="text-lg md:text-xl font-bold text-gray-900">{{ routeTo }}</span>
                                    </div>
                                </div>
                                <div class="flex items-center gap-3 pt-2 md:pt-0 md:pl-4 border-t border-gray-100 md:border-t-0 md:border-l md:border-gray-200">
                                    <span class="text-2xl font-bold text-primary">{{ priceDisplay }}</span>
                                </div>
                            </div>
                            <div class="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-sm text-gray-600">
                                <span v-if="vehicleLabel" class="flex items-center gap-1.5">
                                    <i class="pi pi-truck text-primary text-base"></i>
                                    {{ vehicleLabel }}
                                </span>
                                <span v-if="weightDisplay" class="flex items-center gap-1.5">
                                    <i class="pi pi-box text-primary text-base"></i>
                                    {{ weightDisplay }}
                                </span>
                                <span v-if="timeDisplay" class="flex items-center gap-1.5">
                                    <i class="pi pi-clock text-primary text-base"></i>
                                    {{ timeDisplay }}
                                </span>
                                <span class="flex items-center gap-1.5">
                                    <i class="pi pi-tag text-primary text-base"></i>
                                    {{ postTypeLabel }}
                                </span>
                            </div>
                            <div v-if="isCreator && shipment?.status !== 'active'" class="mt-4 pt-4 border-t border-gray-100">
                                <span
                                    class="inline-flex items-center rounded-lg border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm font-medium text-slate-700"
                                >
                                    İlan şu an listelenmemektedir
                                </span>
                            </div>
                            <div v-else-if="isCreator && shipment?.status === 'active'" class="mt-4 pt-4 border-t border-gray-100">
                                <button
                                    type="button"
                                    class="w-full sm:w-auto px-4 py-2.5 rounded-lg bg-red-100 hover:bg-red-200 text-red-700 text-sm font-semibold transition-colors"
                                    @click="openCancelModal"
                                >
                                    İptal Et
                                </button>
                            </div>
                        </div>
                    </section>

                    <!-- Loading -->
                    <template v-if="loading">
                        <div class="rounded-2xl border border-gray-200 bg-white p-12 flex flex-col items-center justify-center gap-3">
                            <i class="pi pi-spin pi-spinner text-3xl text-primary"></i>
                            <p class="text-gray-600 font-medium">İlan yükleniyor...</p>
                        </div>
                    </template>

                    <!-- Error -->
                    <template v-else-if="error">
                        <div class="rounded-2xl border border-red-200 bg-red-50 p-6 text-center">
                            <i class="pi pi-exclamation-triangle text-2xl text-red-500 mb-2"></i>
                            <p class="font-medium text-red-700">{{ error }}</p>
                        </div>
                    </template>

                    <!-- Teklifler bölümü -->
                    <template v-else-if="shipment">
                        <section class="rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden">
                            <div class="px-5 py-4 border-b border-gray-100 bg-gray-50/80">
                                <h2 class="text-base font-semibold text-gray-900">
                                    Teklifler
                                    <span v-if="requestCount > 0" class="ml-2 text-primary font-bold">({{ requestCount }})</span>
                                </h2>
                            </div>
                            <div class="p-5">
                                <template v-if="requestCount === 0">
                                    <div class="flex flex-col items-center justify-center py-12 text-center">
                                        <div class="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                                            <i class="pi pi-inbox text-3xl text-gray-400"></i>
                                        </div>
                                        <p class="text-gray-600 font-medium">Henüz teklif bulunmuyor</p>
                                        <p class="text-sm text-gray-500 mt-1">Teklifler burada listelenecek.</p>
                                    </div>
                                </template>
                                <div v-else class="flex flex-col gap-4">
                                    <RequestCard
                                        v-for="req in (shipment?.requests || [])"
                                        :key="req?.id ?? req?.created_at"
                                        :request="req"
                                        :show-accept-button="isCreator && canAcceptOffers"
                                        :accept-loading="acceptOfferLoadingId === req?.id"
                                        :messaging-disabled="!isShipmentActive"
                                        :shipment-inactive="!isShipmentActive"
                                        @message-click="openMessagePanel"
                                        @accept-click="openAcceptOfferModal"
                                    />
                                </div>
                            </div>
                        </section>

                        <!-- En yakın kullanıcılar (sadece giriş yapmış kullanıcıya gösterilir) -->
                        <section v-if="authStore.isAuthenticated" class="rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden">
                            <div class="px-5 py-4 border-b border-gray-100 bg-gray-50/80">
                                <h2 class="text-base font-semibold text-gray-900">Yakındaki taşıyıcılar</h2>
                                <p class="text-xs text-gray-500 mt-0.5">Konum paylaştığınızda size yakın kullanıcılar listelenir.</p>
                            </div>
                            <div class="p-5">
                                <template v-if="closeUsersLoading">
                                    <p class="text-sm text-gray-500 flex items-center gap-2">
                                        <i class="pi pi-spin pi-spinner text-primary"></i>
                                        Yükleniyor...
                                    </p>
                                </template>
                                <template v-else-if="closeUsersList.length === 0">
                                    <p class="text-sm text-gray-500">Henüz yakın kullanıcı bilgisi yok.</p>
                                </template>
                                <div v-else class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    <div
                                        v-for="u in closeUsersList"
                                        :key="u.id"
                                        class="flex items-center gap-3 rounded-xl border border-gray-100 bg-gray-50/50 p-4 hover:border-primary/30 hover:bg-primary/5 transition-colors"
                                    >
                                        <span
                                            class="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/15 text-sm font-semibold text-primary"
                                            :title="u.full_name || u.first_name || '?'"
                                        >
                                            {{ (u.full_name || u.first_name || '?')[0] }}
                                        </span>
                                        <div class="min-w-0 flex-1">
                                            <p class="text-sm font-semibold text-gray-900 truncate">
                                                {{ u.full_name || [u.first_name, u.last_name].filter(Boolean).join(' ') || 'Kullanıcı' }}
                                            </p>
                                            <p class="text-xs text-gray-500 truncate mt-0.5">
                                                {{ [u.user_city, u.user_district].filter(Boolean).join(' / ') || '—' }}
                                            </p>
                                            <p v-if="u.distance_km != null" class="text-xs text-primary font-medium mt-1">
                                                ~{{ Math.round(u.distance_km) }} km
                                            </p>
                                        </div>
                                        <button
                                            type="button"
                                            class="shrink-0 flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 text-gray-500 transition-colors"
                                            :class="
                                                isShipmentActive
                                                    ? 'hover:border-primary hover:bg-primary/10 hover:text-primary'
                                                    : 'opacity-50 cursor-not-allowed'
                                            "
                                            :disabled="!isShipmentActive"
                                            title="Mesaj gönder"
                                            @click="openMessagePanel({ user: u, fromCloseUser: true })"
                                        >
                                            <i class="pi pi-comments text-base"></i>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </section>
                    </template>
                </div>

                <!-- Sağ: Sticky özet (masaüstü) -->
                <aside
                    v-if="!loading && !error && shipment"
                    class="w-full lg:w-80 shrink-0 order-1 lg:order-2 lg:self-start lg:sticky lg:top-24"
                >
                    <div class="flex flex-col gap-4">
                        <div class="rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden p-5">
                            <p class="text-xs font-medium text-gray-500 uppercase tracking-wide mb-3">Araç</p>
                            <div class="flex flex-col items-center gap-3">
                                <img
                                    v-if="vehicleImageUrl"
                                    :src="vehicleImageUrl"
                                    :alt="vehicleLabel || 'Araç'"
                                    class="w-full max-w-36 h-24 object-contain rounded-xl"
                                />
                                <span v-if="vehicleLabel" class="text-sm font-semibold text-gray-900 text-center">{{ vehicleLabel }}</span>
                                <span v-else-if="!vehicleImageUrl" class="text-sm text-gray-400">—</span>
                            </div>
                        </div>
                        <div class="rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden p-5">
                            <p class="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">Yük tipi</p>
                            <p class="text-base font-semibold text-gray-900">{{ postTypeLabel }}</p>
                        </div>
                    </div>
                </aside>
            </div>
        </Content>
    </div>

    <!-- Mesaj paneli -->
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
                class="relative h-full w-full max-w-md bg-white border-l border-gray-200 shadow-xl flex flex-col transition-transform duration-300 ease-out"
                :class="messagePanelVisible ? 'translate-x-0' : 'translate-x-full'"
            >
                <div class="flex items-center justify-between px-4 py-3 border-b border-gray-200 bg-white">
                    <span class="text-sm font-semibold text-gray-900 truncate">
                        {{ selectedReceiver?.full_name ? `Mesaj: ${selectedReceiver.full_name}` : 'Mesaj' }}
                    </span>
                    <button
                        type="button"
                        class="p-2 rounded-lg hover:bg-gray-100 text-gray-500 hover:text-gray-700 transition-colors"
                        aria-label="Kapat"
                        @click="closeMessagePanel"
                    >
                        <i class="pi pi-times text-lg"></i>
                    </button>
                </div>
                <div class="flex-1 flex flex-col min-h-0">
                    <div
                        ref="panelMessagesContainer"
                        class="flex-1 overflow-y-auto px-4 py-3 flex flex-col gap-3 bg-gray-50"
                    >
                        <div
                            v-for="(msg, index) in panelMessages"
                            :key="msg.id ?? index"
                            :class="msg.type === 'system' || msg.type === 'request' ? 'flex justify-center' : msg.isMe ? 'flex justify-end' : 'flex justify-start'"
                        >
                            <div
                                v-if="msg.type === 'request'"
                                class="rounded-full border border-pink-200 bg-pink-50/95 px-3 py-2 sm:px-4 text-center max-w-[95%] shadow-sm"
                            >
                                <p class="text-xs sm:text-sm font-medium text-pink-900 m-0 leading-snug">{{ msg.text }}</p>
                                <span class="text-[10px] sm:text-xs text-pink-600 mt-1 block">{{ msg.time }}</span>
                            </div>
                            <div
                                v-else-if="msg.type === 'system'"
                                class="rounded-full border border-slate-200 bg-slate-100/90 px-3 py-2 sm:px-4 text-center max-w-[95%] shadow-sm"
                            >
                                <p class="text-xs sm:text-sm font-medium text-slate-700 m-0 leading-snug">{{ msg.text }}</p>
                                <span class="text-[10px] sm:text-xs text-slate-500 mt-1 block">{{ msg.time }}</span>
                            </div>
                            <div
                                v-else
                                :class="[
                                    'max-w-[85%] px-4 py-2.5 rounded-2xl flex flex-col gap-0.5',
                                    msg.isMe
                                        ? 'bg-primary text-white rounded-br-md'
                                        : 'bg-white text-gray-800 border border-gray-200 rounded-bl-md'
                                ]"
                            >
                                <p class="text-sm leading-snug">{{ msg.text }}</p>
                                <span class="text-xs opacity-80">{{ msg.time }}</span>
                            </div>
                        </div>
                        <p v-if="!panelMessages.length && !panelMessagesLoading" class="text-sm text-gray-500 text-center py-8">
                            Henüz mesaj yok. Aşağıdan mesaj göndererek sohbeti başlatın.
                        </p>
                        <p v-if="panelMessagesLoading" class="text-sm text-gray-500 text-center py-8 flex items-center justify-center gap-2">
                            <i class="pi pi-spin pi-spinner text-primary"></i>
                            Mesajlar yükleniyor...
                        </p>
                    </div>
                    <div class="relative w-full shrink-0 border-t border-gray-200 bg-white p-4">
                        <div
                            v-if="showCloseUserBadge"
                            class="absolute left-4 right-4 bottom-full mb-2 px-3 py-2 rounded-lg bg-primary/10 text-primary text-xs font-medium text-center"
                        >
                            Bu taşıyıcıya mesaj göndererek iletişime geçin.
                        </div>
                        <form @submit.prevent="sendPanelMessage" class="flex items-center gap-2">
                            <input
                                v-model="newMessageText"
                                type="text"
                                placeholder="Mesajınızı yazın..."
                                :maxlength="MESSAGE_MAX_LENGTH"
                                :disabled="!isShipmentActive"
                                class="flex-1 rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary disabled:bg-gray-100 disabled:text-gray-500 disabled:cursor-not-allowed"
                            />
                            <button
                                type="submit"
                                :disabled="!isShipmentActive"
                                class="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary text-white hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-primary"
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

    <!-- İptal onayı (yalnızca ilan active iken) -->
    <Teleport to="body">
        <Transition name="modal">
            <div
                v-if="cancelModalOpen"
                class="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 px-4"
                role="dialog"
                aria-modal="true"
            >
                <div class="w-full max-w-md bg-white rounded-2xl shadow-xl p-5 sm:p-6">
                    <h2 class="text-lg font-semibold text-gray-900 mb-1">İlanı iptal et</h2>
                    <p class="text-sm text-gray-600 mb-4">
                        Lütfen iptal nedenini seçin. Bu bilgi hizmet kalitesini artırmak için kullanılacaktır.
                    </p>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Nedeni</label>
                    <select
                        v-model="cancelReason"
                        :class="[
                            'w-full rounded-lg border px-3 py-2 text-sm text-gray-800 focus:outline-none focus:ring-2 mb-3',
                            cancelReason
                                ? 'border-red-400 focus:ring-red-200 focus:border-red-500 text-red-700'
                                : 'border-gray-300 focus:ring-red-200 focus:border-red-500'
                        ]"
                    >
                        <option value="" disabled>Bir neden seçin</option>
                        <option v-for="r in cancelReasons" :key="r" :value="r">{{ r }}</option>
                    </select>
                    <div v-if="cancelReason === 'Diğer'" class="mb-3">
                        <label class="block text-sm font-medium text-gray-700 mb-1">Diğer neden</label>
                        <textarea
                            v-model="cancelOtherReason"
                            rows="3"
                            class="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-red-200 focus:border-red-500 resize-none"
                            placeholder="Kısaca açıklayın..."
                        />
                    </div>
                    <div class="flex justify-end gap-2 mt-4">
                        <button
                            type="button"
                            class="px-4 py-2 rounded-lg border border-gray-200 text-gray-700 text-sm font-medium hover:bg-gray-50 transition-colors"
                            :disabled="cancelSubmitting"
                            @click="cancelModalOpen = false"
                        >
                            Vazgeç
                        </button>
                        <button
                            type="button"
                            class="px-4 py-2 rounded-lg bg-red-600 text-white text-sm font-semibold hover:bg-red-700 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
                            :disabled="cancelSubmitting || !cancelReason || (cancelReason === 'Diğer' && !cancelOtherReason.trim())"
                            @click="submitCancel"
                        >
                            {{ cancelSubmitting ? 'İptal ediliyor...' : 'İptal et' }}
                        </button>
                    </div>
                </div>
            </div>
        </Transition>
    </Teleport>

    <!-- Hemen Al — teklifi kabul onayı (ilan sahibi) -->
    <Teleport to="body">
        <Transition name="modal">
            <div
                v-if="acceptOfferModalOpen"
                class="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 px-4"
                role="dialog"
                aria-modal="true"
                aria-labelledby="accept-offer-title"
            >
                <div class="w-full max-w-md bg-white rounded-2xl shadow-xl p-5 sm:p-6">
                    <h2 id="accept-offer-title" class="text-lg font-semibold text-gray-900 mb-2">Teklifi kabul et</h2>
                    <p class="text-sm text-gray-600 mb-6">
                        Bu taşıyıcıyı seçmek üzeresiniz. Emin misiniz?
                    </p>
                    <div class="flex justify-end gap-2">
                        <button
                            type="button"
                            class="px-4 py-2 rounded-lg border border-gray-200 text-gray-700 text-sm font-medium hover:bg-gray-50 transition-colors"
                            :disabled="acceptOfferLoadingId != null"
                            @click="closeAcceptOfferModal"
                        >
                            Hayır
                        </button>
                        <button
                            type="button"
                            class="px-4 py-2 rounded-lg bg-primary text-white text-sm font-semibold hover:bg-primary/90 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
                            :disabled="acceptOfferLoadingId != null"
                            @click="confirmAcceptOffer"
                        >
                            {{ acceptOfferLoadingId != null ? 'İşleniyor...' : 'Evet' }}
                        </button>
                    </div>
                </div>
            </div>
        </Transition>
    </Teleport>
</template>

<script setup>
import Header from '@/components/Header.vue';
import Content from '@/components/Content.vue';
import RequestCard from '@/components/RequestCard.vue';
import { onMounted, ref, computed, watch, nextTick } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import api from '@/api';
import { useMessageStore } from '@/stores/message';
import { useAuthStore } from '@/stores/auth';
import { usePusherMessages } from '@/composables/usePusherMessages';
import {
    conversationEventMatchesThread,
    mapConversationMessageFromEvent,
} from '@/lib/message-helpers';
import { useLocationStore } from '@/stores/location';
import { storeToRefs } from 'pinia';
import { MESSAGE_MAX_LENGTH } from '@/lib/message-limits';

const route = useRoute();
const router = useRouter();
const slug = computed(() => route.params.slug);

const isCreator = computed(() => {
    const u = authStore.user?.id;
    const s = shipment.value;
    if (!u || !s) return false;
    return Number(s.creater_id) === Number(u) || Number(s.creator?.id) === Number(u);
});

/** İlan hâlâ teklif kabul edilebilir durumda mı (shipment.status) */
const canAcceptOffers = computed(() => {
    const st = shipment.value?.status;
    if (st == null || st === '') return true;
    return st === 'active' || st === 'pending';
});

const acceptOfferModalOpen = ref(false);
const acceptOfferTarget = ref(null);
const acceptOfferLoadingId = ref(null);

function openAcceptOfferModal(request) {
    if (!request?.id) return;
    acceptOfferTarget.value = request;
    acceptOfferModalOpen.value = true;
}

function closeAcceptOfferModal() {
    if (acceptOfferLoadingId.value != null) return;
    acceptOfferModalOpen.value = false;
    acceptOfferTarget.value = null;
}

async function confirmAcceptOffer() {
    const req = acceptOfferTarget.value;
    const slugVal = slug.value;
    if (!req?.id || !slugVal || acceptOfferLoadingId.value != null) return;
    acceptOfferLoadingId.value = req.id;
    error.value = null;
    try {
        await api.post(`/shipments/${slugVal}/requests/${req.id}/accept`);
        acceptOfferModalOpen.value = false;
        acceptOfferTarget.value = null;
        router.push('/cargo-owner/posts');
    } catch (err) {
        console.error(err);
        error.value = err?.response?.data?.message ?? err?.message ?? 'Teklif kabul edilemedi.';
    } finally {
        acceptOfferLoadingId.value = null;
    }
}

const cancelModalOpen = ref(false);
const cancelReason = ref('');
const cancelOtherReason = ref('');
const cancelSubmitting = ref(false);
const cancelReasons = [
    'Yük artık taşınmayacak',
    'Yanlış bilgi ile ilan açtım',
    'Farklı bir firma ile anlaştım',
    'Fiyat / şartlar değişti',
    'Diğer',
];

function openCancelModal() {
    cancelReason.value = '';
    cancelOtherReason.value = '';
    cancelModalOpen.value = true;
}

const selectedReasonText = computed(() => {
    if (!cancelReason.value) return '';
    if (cancelReason.value === 'Diğer') return cancelOtherReason.value?.trim() || 'Diğer';
    return cancelReason.value;
});

async function submitCancel() {
    const id = shipment.value?.id;
    if (!id || cancelSubmitting.value) return;
    if (!cancelReason.value) return;
    if (cancelReason.value === 'Diğer' && !cancelOtherReason.value.trim()) return;
    try {
        cancelSubmitting.value = true;
        await api.post(`/shipments/${id}/cancel`, { reason: selectedReasonText.value });
        cancelModalOpen.value = false;
        router.push('/panel');
    } catch (err) {
        console.error(err);
        error.value = err?.response?.data?.message ?? 'İptal işlemi başarısız.';
    } finally {
        cancelSubmitting.value = false;
    }
}

const messageStore = useMessageStore();
const authStore = useAuthStore();
const locationStore = useLocationStore();
const { userCity, userDistrict, userCoords } = storeToRefs(locationStore);

const shipment = ref(null);
const loading = ref(false);
const error = ref(null);

const loadShipment = async () => {
    const slugVal = slug.value;
    if (!slugVal) { shipment.value = null; return; }
    loading.value = true;
    error.value = null;
    try {
        const res = await api.get(`/shipments/${slugVal}/requests`);
        const data = res.data?.content ?? res.data;
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

const requestCount = computed(() => shipment.value?.requests?.length ?? 0);

/** Teklif / yakın taşıyıcı mesajları yalnızca ilan yayında (active) iken */
const isShipmentActive = computed(() => shipment.value?.status === 'active');

const routeFrom = computed(() => {
    const s = shipment.value;
    if (!s) return '—';
    const parts = [s.f_where_city, s.f_where_district].filter(Boolean);
    return parts.length ? parts.join(' / ') : '—';
});
const routeTo = computed(() => {
    const s = shipment.value;
    if (!s) return '—';
    const parts = [s.t_where_city, s.t_where_district].filter(Boolean);
    return parts.length ? parts.join(' / ') : '—';
});
const vehicleLabel = computed(() => {
    const s = shipment.value;
    const car = s?.car;
    const detail = s?.get_car_detail ?? s?.getCarDetail;
    if (!car?.name) return detail?.value ?? null;
    return detail?.value ? `${car.name} / ${detail.value}` : car.name;
});
const weightDisplay = computed(() => {
    const w = shipment.value?.weight;
    return w ? String(w).trim() : null;
});
const timeDisplay = computed(() => {
    const s = shipment.value;
    const dep = s?.departure_time ?? s?.departureTime;
    const arr = s?.time_arrival ?? s?.timeArrival;
    if (!dep && !arr) return null;
    return [dep, arr].filter(Boolean).join(' - ');
});
const priceDisplay = computed(() => {
    const p = shipment.value?.price;
    if (p == null) return '—';
    if (typeof p === 'string') return p;
    return Number(p) === 0 ? 'Fiyat görüşülecektir' : `${Number(p).toLocaleString('tr-TR', { minimumFractionDigits: 2 })} ₺`;
});
const postTypeLabel = computed(() => {
    const pt = shipment.value?.post_type ?? shipment.value?.postType;
    return pt?.value ?? '—';
});

function getCarImageUrl(image) {
    if (!image) return '';
    if (typeof image === 'string' && image.startsWith('http')) return image;
    try {
        return new URL(`../assets/images/vehicles/${image}`, import.meta.url).href;
    } catch {
        return '';
    }
}
const vehicleImageUrl = computed(() => {
    const car = shipment.value?.car;
    const detail = shipment.value?.get_car_detail ?? shipment.value?.getCarDetail;
    const image = detail?.image ?? car?.image;
    return getCarImageUrl(image) || '';
});

const closeUsersList = ref([]);
const closeUsersLoading = ref(false);

async function geocodeCityDistrict(city, district) {
    if (!city && !district) return null;
    const q = [city, district, 'Türkiye'].filter(Boolean).join(', ');
    try {
        const res = await fetch(
            `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(q)}&format=json&limit=1&countrycodes=tr`,
            {
                headers: {
                    'Accept-Language': 'tr',
                    'User-Agent': 'TasibulLogistics/1.0 (close-users geocode)',
                },
            }
        );
        const data = await res.json();
        const item = data?.[0];
        if (item?.lat != null && item?.lon != null) return { lat: parseFloat(item.lat), lng: parseFloat(item.lon) };
    } catch (_) {}
    return null;
}

async function fetchCloseUsers() {
    closeUsersLoading.value = true;
    const s = shipment.value;
    const city = s?.f_where_city ?? userCity.value;
    const district = s?.f_where_district ?? userDistrict.value;
    try {
        const ref = city ? await geocodeCityDistrict(city, district) : null;
        const res = await api.get('/auth/close-users', {
            params: {
                user_city: city ?? undefined,
                user_district: district ?? undefined,
                ...(ref ? { ref_lat: ref.lat, ref_lng: ref.lng } : {}),
            },
        });
        const content = res.data?.content ?? res.data;
        closeUsersList.value = Array.isArray(content?.users) ? content.users : [];
    } catch (err) {
        console.error(err);
        closeUsersList.value = [];
    } finally {
        closeUsersLoading.value = false;
    }
}

const showMessagePanel = ref(false);
const messagePanelVisible = ref(false);
const panelMessagesContainer = ref(null);
const panelMessages = ref([]);
const panelMessagesLoading = ref(false);
const newMessageText = ref('');
const selectedReceiver = ref(null);
const messagePanelOpenedFromCloseUser = ref(false);
const closeUserBadgeHidden = ref(false);

const showCloseUserBadge = computed(() => messagePanelOpenedFromCloseUser.value && !closeUserBadgeHidden.value);

function scrollPanelToBottom() {
    nextTick(() => { const el = panelMessagesContainer.value; if (el) el.scrollTop = el.scrollHeight; });
}

async function openMessagePanel(request) {
    if (!isShipmentActive.value) return;
    const user = request?.user;
    if (!user?.id) return;
    selectedReceiver.value = user;
    messagePanelOpenedFromCloseUser.value = !!request?.fromCloseUser;
    closeUserBadgeHidden.value = false;
    panelMessages.value = [];
    panelMessagesLoading.value = true;
    const shipmentId = shipment.value?.id ?? null;
    const { success, data } = await messageStore.getBySenderAndReceiver(user.id, shipmentId);
    panelMessagesLoading.value = false;
    if (success && Array.isArray(data)) {
        panelMessages.value = data;
        const idsToMark = data.filter((m) => m.id && !m.isMe).map((m) => m.id);
        if (idsToMark.length) await messageStore.markAsRead(idsToMark);
    }
    newMessageText.value = '';
    showMessagePanel.value = true;
    nextTick(() => { messagePanelVisible.value = true; scrollPanelToBottom(); });
}

function closeMessagePanel() {
    messagePanelVisible.value = false;
    setTimeout(() => {
        showMessagePanel.value = false;
        selectedReceiver.value = null;
        panelMessages.value = [];
        messagePanelOpenedFromCloseUser.value = false;
        closeUserBadgeHidden.value = false;
    }, 300);
}

async function sendPanelMessage() {
    if (!isShipmentActive.value) return;
    const text = newMessageText.value?.trim();
    if (!text || !selectedReceiver.value?.id) return;
    panelMessages.value = [...panelMessages.value, { id: `temp-${Date.now()}`, text, time: 'Şimdi', isMe: true }];
    newMessageText.value = '';
    scrollPanelToBottom();
    const result = await messageStore.createMessage({
        shipment_id: shipment.value?.id ?? null,
        receiver_id: selectedReceiver.value.id,
        message: text,
    });
    if (!result.success) {
        panelMessages.value = panelMessages.value.filter((m) => !m.id?.toString().startsWith('temp-'));
        return;
    }
    closeUserBadgeHidden.value = true;
    const shipmentId = shipment.value?.id ?? null;
    const { success, data } = await messageStore.getBySenderAndReceiver(selectedReceiver.value.id, shipmentId);
    if (success && Array.isArray(data)) panelMessages.value = data;
    scrollPanelToBottom();
}

usePusherMessages(computed(() => authStore.user?.id), {
    onMessageSent(e) {
        const uid = authStore.user?.id;
        if (!uid || !showMessagePanel.value || selectedReceiver.value?.id == null) return;
        const sid = shipment.value?.id;
        if (!conversationEventMatchesThread(e, uid, Number(selectedReceiver.value.id), sid ?? null)) return;
        const row = mapConversationMessageFromEvent(e, uid);
        panelMessages.value = [...panelMessages.value, row].sort(
            (x, y) => new Date(x.created_at) - new Date(y.created_at)
        );
        if (Number(e.receiver_id) === Number(uid) && e.id) {
            void messageStore.markAsRead([e.id]);
        }
        scrollPanelToBottom();
    },
    onOfferSent(e) {
        if (!showMessagePanel.value || selectedReceiver.value?.id == null) return;
        if (e.shipment_slug != null && shipment.value?.slug && e.shipment_slug !== shipment.value.slug) return;
        void (async () => {
            const shipmentId = shipment.value?.id ?? null;
            const { success, data } = await messageStore.getBySenderAndReceiver(
                selectedReceiver.value.id,
                shipmentId
            );
            if (success && Array.isArray(data)) panelMessages.value = data;
            scrollPanelToBottom();
        })();
    },
    onOfferAccepted(e) {
        if (!showMessagePanel.value || !shipment.value?.slug) return;
        if (e.shipment_slug != null && e.shipment_slug !== shipment.value.slug) return;
        if (selectedReceiver.value?.id == null) return;
        void (async () => {
            const shipmentId = shipment.value?.id ?? null;
            const { success, data } = await messageStore.getBySenderAndReceiver(
                selectedReceiver.value.id,
                shipmentId
            );
            if (success && Array.isArray(data)) panelMessages.value = data;
            scrollPanelToBottom();
        })();
    },
});

onMounted(async () => {
    await loadShipment();
    if (authStore.isAuthenticated) fetchCloseUsers();
});

watch(slug, async () => {
    await loadShipment();
    if (authStore.isAuthenticated) fetchCloseUsers();
});
</script>
