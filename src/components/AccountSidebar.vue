<template>
    <DashboardSidebar :groups="groups" />
</template>

<script setup>
/** Araç sahibi hesap paneli menüsü (dashboard) */
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
            { label: 'Genel Bakış', to: '/vehicle-owner', icon: 'pi-th-large' },
            { label: 'Tüm İşlerim', to: '/vehicle-owner/orders', icon: 'pi-briefcase' },
            { label: 'İşlerin Durumu', to: '/vehicle-owner/fleet', icon: 'pi-map-marker' },
            {
                label: 'Mesajlar',
                to: '/vehicle-owner/messages',
                icon: 'pi-envelope',
                match: (p) => p.startsWith('/vehicle-owner/messages'),
                badge: hasUnread.value,
            },
            { label: 'Değerlendirmelerim', to: '/vehicle-owner/reviews', icon: 'pi-star' },
        ],
    },
    {
        title: 'Araç',
        items: [
            { label: 'Araçlarım', to: '/vehicle-owner/vehicles', icon: 'pi-car' },
            {
                label: 'Yük Alarmı',
                to: '/vehicle-owner/load-alarms',
                icon: 'pi-bell',
                match: (p) => p.startsWith('/vehicle-owner/load-alarms'),
            },
        ],
    },
    {
        title: 'Hesap',
        items: [
            { label: 'Hesap Doğrula', to: '/vehicle-owner/verify', icon: 'pi-verified' },
            {
                label: 'Ayarlar',
                to: '/vehicle-owner/settings',
                icon: 'pi-cog',
                match: (p) => p.startsWith('/vehicle-owner/settings') || p === '/vehicle-owner/change-password',
            },
        ],
    },
]);
</script>
