<template>
    <Header class="hidden md:block" />
    <div class="h-[100dvh] md:h-[calc(100vh-4rem)] min-h-0 flex flex-col overflow-hidden">
        <Content class="flex-1 min-h-0 flex flex-col !p-0 overflow-hidden">
            <div class="flex flex-row gap-3 w-full flex-1 min-h-0 overflow-hidden">
                <CargoOwner />
                <div class="flex h-full md:h-[calc(100vh-150px)] min-h-0 min-w-0 flex-1 flex-col overflow-hidden border border-gray-200 md:mt-3 md:rounded-md">
                    <p v-if="messagesLoading" class="text-sm text-gray-500 p-4">Mesajlar yükleniyor...</p>
                    <AccountMessages
                        v-else
                        :messages-list="messagesList"
                        base-path="/cargo-owner/messages"
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
import CargoOwner from '@/components/CargoOwner.vue';
import AccountMessages from '@/account/AccountMessages.vue';
import { useMessageStore } from '@/stores/message';
import { useAuthStore } from '@/stores/auth';
import { buildInboxMessagesList } from '@/lib/message-helpers';
import { useGlobalInboxUnread } from '@/composables/useGlobalInboxUnread';

useGlobalInboxUnread();

const authStore = useAuthStore();
const messageStore = useMessageStore();
const messagesLoading = ref(true);
const rawMessages = ref([]);

const messagesList = computed(() => buildInboxMessagesList(rawMessages.value, authStore.user?.id));

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
