<template>
    <Header class="hidden md:block" />
    <div class="h-[100dvh] md:h-[calc(100vh-4rem)] min-h-0 flex flex-col overflow-hidden">
        <Content class="flex-1 min-h-0 flex flex-col !px-0 overflow-hidden">
            <div class="flex flex-row md:gap-3 w-full flex-1 min-h-0 overflow-hidden">
                <AccountSidebar />
                <div class="flex h-[calc(100vh-150px)] min-h-0 min-w-0 flex-1 flex-col overflow-hidden border border-gray-200 bg-white w-full md:mt-3 md:rounded-md md:p-3">
                    <p v-if="messagesLoading" class="text-sm text-gray-500 p-4">Mesajlar yükleniyor...</p>
                    <AccountMessages
                        v-else
                        :messages-list="messagesList"
                        base-path="/vehicle-owner/messages"
                        @refresh="refetchMessages"
                    />
                </div>
            </div>
        </Content>
    </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import Header from '@/components/Header.vue';
import Content from '@/components/Content.vue';
import AccountSidebar from '@/components/AccountSidebar.vue';
import AccountMessages from '@/account/AccountMessages.vue';
import { useMessageStore } from '@/stores/message';
import { useAuthStore } from '@/stores/auth';

const authStore = useAuthStore();
const messageStore = useMessageStore();
const messagesLoading = ref(true);
const rawMessages = ref([]);

function formatTime(createdAt) {
    if (!createdAt) return '—';
    const d = new Date(createdAt);
    const now = new Date();
    const diffMs = now - d;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);
    if (diffMins < 60) return `${diffMins} dakika önce`;
    if (diffHours < 24) return `${diffHours} saat önce`;
    if (diffDays < 7) return `${diffDays} gün önce`;
    return d.toLocaleDateString('tr-TR');
}

function getMessagePreview(m, userId) {
    const isSender = Number(m.sender_id) === Number(userId);
    if (m.type === 'system') {
        return isSender
            ? (m.sender_message || m.message || '')
            : (m.receiver_message || m.message || '');
    }
    return m.message || '';
}

function buildShipmentRouteLabel(shipment) {
    if (!shipment) return null;
    const fromCity = shipment.f_where_city ?? '';
    const fromDistrict = shipment.f_where_district ?? '';
    const toCity = shipment.t_where_city ?? '';
    const toDistrict = shipment.t_where_district ?? '';
    if (!fromCity || !toCity) return null;
    const from = fromDistrict ? `${fromCity} / ${fromDistrict}` : fromCity;
    const to = toDistrict ? `${toCity} / ${toDistrict}` : toCity;
    return `${from} -> ${to}`;
}

function buildUserAvatarUrl(user) {
    const profileImage = String(user?.profile_image ?? '').trim();
    if (profileImage) {
        if (/^https?:\/\//i.test(profileImage)) return profileImage;
        const base = (import.meta.env.VITE_APP_SERVER_URL || '').replace(/\/$/, '');
        if (profileImage.startsWith('/')) return `${base}${profileImage}`;
        return `${base}/storage/${profileImage}`;
    }
    const image = String(user?.image ?? '').trim();
    if (image) {
        if (/^https?:\/\//i.test(image)) return image;
        const base = (import.meta.env.VITE_APP_SERVER_URL || '').replace(/\/$/, '');
        if (image.startsWith('/')) return `${base}${image}`;
        return `${base}/storage/${image}`;
    }
    return null;
}

const messagesList = computed(() => {
    const userId = authStore.user?.id;
    if (!userId || !rawMessages.value.length) return [];
    const byOtherAndShipment = new Map();
    for (const m of rawMessages.value) {
        const otherId = Number(m.sender_id) === Number(userId) ? m.receiver_id : m.sender_id;
        const shipmentId = m.shipment_id ?? 'none';
        const key = `${otherId}-${shipmentId}`;
        const existing = byOtherAndShipment.get(key);
        if (!existing || new Date(m.created_at) > new Date(existing.created_at)) {
            byOtherAndShipment.set(key, { ...m, otherId });
        }
    }
    return Array.from(byOtherAndShipment.values())
        .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
        .map((m) => {
        const isCurrentUserSender = Number(m.sender_id) === Number(userId);
        const otherUser = isCurrentUserSender ? m.receiver : m.sender;
        const otherName = otherUser?.full_name;
        const shipmentId = m.shipment_id ?? null;
        return {
            id: m.otherId,
            rowKey: `${m.otherId}-${shipmentId ?? 'none'}`,
            shipmentId,
            shipmentRoute: buildShipmentRouteLabel(m.shipment),
            avatarUrl: buildUserAvatarUrl(otherUser),
            name: otherName || `Kullanıcı #${m.otherId}`,
            time: formatTime(m.created_at),
            lastMessage: getMessagePreview(m, userId),
            isRead: !!m.is_read,
        };
        });
});

async function refetchMessages() {
    const userId = authStore.user?.id;
    if (!userId) return;
    const { success, data } = await messageStore.getByUserId(userId);
    if (success && Array.isArray(data)) {
        rawMessages.value = data;
    }
}

onMounted(async () => {
    const userId = authStore.user?.id;
    if (!userId) {
        messagesLoading.value = false;
        return;
    }
    const { success, data } = await messageStore.getByUserId(userId);
    messagesLoading.value = false;
    if (success && Array.isArray(data)) {
        rawMessages.value = data;
    }
});
</script>
