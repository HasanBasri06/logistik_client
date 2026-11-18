<template>
    <DashboardSidebar :groups="groups" />
</template>

<script setup>
/** Yük sahibi hesap paneli menüsü (dashboard) */
import { computed, onMounted } from 'vue';
import { storeToRefs } from 'pinia';
import DashboardSidebar from './DashboardSidebar.vue';
import { useAuthStore } from '@/stores/auth';
import { useInboxUnreadStore } from '@/stores/inbox-unread';
import { useGlobalInboxUnread } from '@/composables/useGlobalInboxUnread';

const authStore = useAuthStore();
useGlobalInboxUnread();
const inboxUnread = useInboxUnreadStore();
const { hasUnread } = storeToRefs(inboxUnread);
onMounted(() => {
    if (authStore.isAuthenticated) void inboxUnread.fetchHasUnread();
});

const groups = computed(() => [
    {
        title: 'Genel',
        items: [
            { label: 'Genel Bakış', to: '/cargo-owner', icon: 'pi-th-large' },
            {
                label: 'Mesajlar',
                to: '/cargo-owner/messages',
                icon: 'pi-envelope',
                match: (p) => p.startsWith('/cargo-owner/messages'),
                badge: hasUnread.value,
            },
            { label: 'Değerlendirmelerim', to: '/cargo-owner/reviews', icon: 'pi-star' },
        ],
    },
    {
        title: 'İlanlar',
        items: [
            { label: 'İlanlarım', to: '/cargo-owner/posts', icon: 'pi-list' },
            { label: 'İlan Oluştur', to: '/cargo-owner/posts/create', icon: 'pi-plus-circle' },
            { label: 'Adreslerim', to: '/cargo-owner/addresses', icon: 'pi-map-marker' },
        ],
    },
    {
        title: 'Hesap',
        items: [
            { label: 'Hesap Doğrula', to: '/cargo-owner/verify', icon: 'pi-verified' },
            {
                label: 'Ayarlar',
                to: '/cargo-owner/settings',
                icon: 'pi-cog',
                match: (p) => p.startsWith('/cargo-owner/settings') || p === '/cargo-owner/change-password',
            },
        ],
    },
]);
</script>
