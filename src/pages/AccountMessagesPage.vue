<template>
    <Header class="hidden md:block" />
    <div class="h-[100dvh] md:h-[calc(100vh-4rem)] min-h-0 flex flex-col overflow-hidden">
        <div class="flex-1 min-h-0 flex flex-col overflow-hidden w-full">
            <div class="flex flex-row w-full flex-1 min-h-0 overflow-hidden bg-gray-50">
                <AccountSidebar />
                <div class="flex h-full min-h-0 min-w-0 flex-1 flex-col overflow-hidden bg-white w-full">
                    <!-- Sayfa yolu: içerik alanının en üstünde -->
                    <AccountBreadcrumb class="mb-4 shrink-0 px-4 pt-4 sm:px-6" />
                    <p v-if="messagesLoading" class="text-sm text-gray-500 p-4">Mesajlar yükleniyor...</p>
                    <AccountMessages
                        v-else
                        :messages-list="messagesList"
                        base-path="/vehicle-owner/messages"
                        @refresh="refetchMessages"
                    />
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import Header from '@/components/Header.vue';
import AccountSidebar from '@/components/AccountSidebar.vue';
import AccountBreadcrumb from '@/components/AccountBreadcrumb.vue';
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
