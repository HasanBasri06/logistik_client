<template>
    <Header />
    <div class="h-[calc(100vh-64px)]">
        <Content>
            <div class="flex flex-row gap-3 w-full h-[calc(100vh-64px)]">
                <CargoOwner />
                <div class="bg-white flex-1 mt-3 border border-gray-200 p-3 rounded-md flex flex-col overflow-hidden">
                    <p v-if="messagesLoading" class="text-sm text-gray-500 p-4">Mesajlar yükleniyor...</p>
                    <AccountMessages
                        v-else
                        :messages-list="messagesList"
                        base-path="/cargo-owner/messages"
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
import CargoOwner from '@/components/CargoOwner.vue';
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

const messagesList = computed(() => {
    const userId = authStore.user?.id;
    if (!userId || !rawMessages.value.length) return [];
    const byOther = new Map();
    for (const m of rawMessages.value) {
        const otherId = Number(m.sender_id) === Number(userId) ? m.receiver_id : m.sender_id;
        const existing = byOther.get(otherId);
        if (!existing || new Date(m.created_at) > new Date(existing.created_at)) {
            byOther.set(otherId, { ...m, otherId });
        }
    }
    return Array.from(byOther.values()).map((m) => {
        const isCurrentUserSender = Number(m.sender_id) === Number(userId);
        const otherName = isCurrentUserSender ? m.receiver?.full_name : m.sender?.full_name;
        return {
            id: m.otherId,
            name: otherName || `Kullanıcı #${m.otherId}`,
            time: formatTime(m.created_at),
            lastMessage: m.message || '',
            isRead: !!m.is_read,
        };
    });
});

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
