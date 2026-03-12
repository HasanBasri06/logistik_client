<template>
    <Header />
    <div class="h-[calc(100vh-64px)] flex flex-col">
        <Content class="flex-1 flex gap-6 py-6 min-h-0 flex-row">

            <div class="flex-1 min-w-0 flex flex-col gap-4 overflow-y-auto no_scrool">
                <!-- En yakın kullanıcılar (sol üst) -->
                <div class="rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden shrink-0">
                    <div class="px-4 py-3 border-b border-gray-100 bg-primary/5">
                        <span class="text-sm font-semibold text-primary">En yakın kullanıcılar</span>
                    </div>
                    <div class="p-4">
                        <template v-if="closeUsersLoading">
                            <p class="text-sm text-gray-500 flex items-center gap-2">
                                <i class="pi pi-spin pi-spinner text-primary"></i>
                                Yükleniyor...
                            </p>
                        </template>
                        <template v-else-if="closeUsersList.length === 0">
                            <p class="text-sm text-gray-500">Konum paylaştığınızda size yakın kullanıcılar burada listelenecek.</p>
                        </template>
                        <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                            <div
                                v-for="u in closeUsersList"
                                :key="u.id"
                                class="rounded-xl border border-gray-200 bg-gray-50/50 p-4 flex items-center gap-3"
                            >
                                <span class="flex items-center justify-center w-10 h-10 rounded-full bg-primary/15 text-primary text-sm font-semibold shrink-0" :title="u.full_name || u.first_name || '?'">
                                    {{ (u.full_name || u.first_name || '?')[0] }}
                                </span>
                                <div class="min-w-0 flex-1">
                                    <p class="text-sm font-semibold text-gray-900 truncate" :title="u.full_name || [u.first_name, u.last_name].filter(Boolean).join(' ') || 'Kullanıcı'">{{ u.full_name || [u.first_name, u.last_name].filter(Boolean).join(' ') || 'Kullanıcı' }}</p>
                                    <p :title="[u.user_city, u.user_district].filter(Boolean).join(' / ') || '—'" class="text-xs text-gray-500 truncate mt-0.5">{{ [u.user_city, u.user_district].filter(Boolean).join(' / ') || '—' }}</p>
                                    <p v-if="distanceKmByUserId[u.id] != null" class="text-xs text-primary font-medium mt-1">~{{ Math.round(distanceKmByUserId[u.id]) }} km uzakta</p>
                                </div>
                                <button
                                    type="button"
                                    class="flex items-center justify-center w-9 h-9 rounded-lg border border-gray-200 text-gray-500 hover:border-primary hover:bg-primary/10 hover:text-primary transition-colors shrink-0"
                                    title="Mesaj gönder"
                                    @click="openMessagePanel({ user: u, fromCloseUser: true })"
                                >
                                    <i class="pi pi-comments text-base"></i>
                                </button>
                            </div>
                        </div>

                    </div>
                </div>

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
                    <img src="../assets/images/no_teklif.png" alt="No offer" class="w-[500px] h-auto mx-auto">
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
                            <span class="text-lg font-semibold text-gray-900">{{ routeFrom }}</span>
                            <i class="pi pi-arrow-right text-primary text-sm shrink-0"></i>
                            <span class="text-lg font-semibold text-gray-900">{{ routeTo }}</span>
                        </div>
                        <div class="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-gray-600">
                            <span v-if="vehicleLabel" class="font-medium text-gray-700">{{ vehicleLabel }}</span>
                            <span v-if="weightDisplay">{{ weightDisplay }}</span>
                            <span v-if="timeDisplay" class="text-primary font-semibold">({{ timeDisplay }})</span>
                        </div>
                        <div class="pt-3 border-t border-gray-100 flex justify-between items-center">
                            <span class="text-sm text-gray-500">Ücret</span>
                            <span class="text-lg font-semibold text-primary">{{ priceDisplay }}</span>
                        </div>
                    </div>
                </div>

                <div class="rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden w-full sticky top-6 self-start">
                    <div class="px-5 py-4 border-b border-gray-100 bg-primary/5">
                        <span class="text-sm font-semibold text-primary">Araç</span>
                    </div>
                    <div class="flex flex-col gap-4 p-5 items-center">
                        <img
                            v-if="vehicleImageUrl"
                            :src="vehicleImageUrl"
                            :alt="vehicleLabel || 'Araç'"
                            class="w-full max-w-40 h-28 object-contain rounded-lg"
                        />
                        <span v-if="vehicleLabel" class="text-xs font-semibold text-primary max-w-fit px-2 py-1 rounded-full text-center">{{ vehicleLabel }}</span>
                        <span v-else-if="!vehicleImageUrl" class="text-xs text-gray-400">—</span>
                    </div>
                </div>
                
                <div class="rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden w-full sticky top-6 self-start">
                    <div class="px-5 py-4 border-b border-gray-100 bg-primary/5">
                        <span class="text-sm font-semibold text-primary">Yük Tipi</span>
                    </div>
                    <div class="p-5 flex flex-col gap-5">
                        <div class="flex items-center gap-3">
                            <span class="text-lg font-semibold text-gray-900">{{ postTypeLabel }}</span>
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
                    <div class="relative w-full shrink-0 border-t border-gray-200 bg-white pt-2 pb-2 px-2">
                        <div
                            v-if="showCloseUserBadge"
                            class="absolute left-2 right-2 bottom-full mb-1 px-3 py-2 rounded-lg bg-primary/15 text-primary text-xs font-medium text-center opacity-70"
                        >
                            Yakındaki bu araç sahibine yükünüzü taşıtmak için hemen mesaj gönderiniz.
                        </div>
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
import { useMessageStore, formatMessageTime } from '@/stores/message';
import { useAuthStore } from '@/stores/auth';
import { usePusherMessages } from '@/composables/usePusherMessages';
import { useLocationStore } from '@/stores/location';
import { storeToRefs } from 'pinia';

// Route & stores
const route = useRoute();
const slug = computed(() => route.params.slug);
const messageStore = useMessageStore();
const authStore = useAuthStore();
const locationStore = useLocationStore();
const { userCity, userDistrict, userCoords } = storeToRefs(locationStore);

// İlan state
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

// İlan computed (güzergah, araç, fiyat) 
const requestCount = computed(() => shipment.value?.requests?.length ?? 0);

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

// En yakın kullanıcılar: AuthController getCloseUsers (şehir/ilçe param ile)
const closeUsersList = ref([]);
const closeUsersLoading = ref(false);
const distanceFromShipmentKm = ref(null);
const distanceKmByUserId = ref({});

function haversineKm(lat1, lon1, lat2, lon2) {
    const R = 6371;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat / 2) ** 2 + Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLon / 2) ** 2;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
}

async function geocodeCityDistrict(city, district) {
    if (!city && !district) return null;
    const q = [city, district, 'Türkiye'].filter(Boolean).join(', ');
    try {
        const res = await fetch(
            `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(q)}&format=json&limit=1&countrycodes=tr`,
            { headers: { 'Accept-Language': 'tr' } }
        );
        const data = await res.json();
        const item = data?.[0];
        if (item?.lat != null && item?.lon != null) return { lat: parseFloat(item.lat), lng: parseFloat(item.lon) };
    } catch (_) {}
    return null;
}

async function updateDistanceToShipment() {
    const coords = userCoords.value;
    const s = shipment.value;
    if (!coords?.lat || !coords?.lng || !s?.f_where_city) {
        distanceFromShipmentKm.value = null;
        return;
    }
    const fromCoords = await geocodeCityDistrict(s.f_where_city, s.f_where_district);
    if (!fromCoords) {
        distanceFromShipmentKm.value = null;
        return;
    }
    distanceFromShipmentKm.value = haversineKm(coords.lat, coords.lng, fromCoords.lat, fromCoords.lng);
}

watch([() => shipment.value, userCoords], () => updateDistanceToShipment(), { immediate: true });

async function updateDistancesForCloseUsers() {
    const coords = userCoords.value;
    const list = closeUsersList.value;
    if (!coords?.lat || !coords?.lng || !list.length) {
        distanceKmByUserId.value = {};
        return;
    }
    const map = {};
    for (const u of list) {
        const pt = await geocodeCityDistrict(u.user_city, u.user_district);
        if (pt) map[u.id] = haversineKm(coords.lat, coords.lng, pt.lat, pt.lng);
        await new Promise((r) => setTimeout(r, 200));
    }
    distanceKmByUserId.value = map;
}

async function fetchCloseUsers() {
    closeUsersLoading.value = true;
    distanceKmByUserId.value = {};
    try {
        const res = await api.get('/auth/close-users', {
            params: {
                user_city: userCity.value ?? undefined,
                user_district: userDistrict.value ?? undefined,
            },
        });
        const content = res.data?.content ?? res.data;
        closeUsersList.value = Array.isArray(content?.users) ? content.users : [];
        await updateDistancesForCloseUsers();
    } catch (err) {
        console.error(err);
        closeUsersList.value = [];
    } finally {
        closeUsersLoading.value = false;
    }
}

// Mesaj paneli
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
    const user = request?.user;
    if (!user?.id) return;
    selectedReceiver.value = user;
    messagePanelOpenedFromCloseUser.value = !!request?.fromCloseUser;
    closeUserBadgeHidden.value = false;
    panelMessages.value = [];
    panelMessagesLoading.value = true;
    const { success, data } = await messageStore.getBySenderAndReceiver(user.id);
    panelMessagesLoading.value = false;
    if (success && Array.isArray(data)) {
        panelMessages.value = data;
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
    const { success, data } = await messageStore.getBySenderAndReceiver(selectedReceiver.value.id);
    if (success && Array.isArray(data)) panelMessages.value = data;
    scrollPanelToBottom();
}

usePusherMessages(computed(() => authStore.user?.id), {
    onMessageSent(e) {
        if (!authStore.user?.id || Number(e.receiver_id) !== Number(authStore.user.id)) return;
        if (selectedReceiver.value?.id == null || Number(e.sender_id) !== Number(selectedReceiver.value.id)) return;
        panelMessages.value = [...panelMessages.value, { id: e.id, text: e.message, time: formatMessageTime(e.created_at), isMe: false }];
        scrollPanelToBottom();
    },
});

onMounted(() => {
    loadShipment();
    fetchCloseUsers();
});
</script>
