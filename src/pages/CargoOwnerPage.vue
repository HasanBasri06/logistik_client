<template>
    <Header />
    <div class="h-[calc(100vh-64px)]">
        <div class="flex flex-row w-full h-[calc(100vh-64px)] bg-gray-50">
            <CargoOwner />
            <div class="flex-1 min-w-0 flex flex-col gap-4 p-4 sm:p-6 overflow-y-auto">
                <!-- Sayfa yolu: içerik alanının en üstünde -->
                <AccountBreadcrumb class="shrink-0" />
                <!-- Genel Bakış: şu anki işlerin haritası -->
                <CargoOwnerJobsMap />
            </div>
        </div>
    </div>
</template>

<script setup>
import Header from '@/components/Header.vue';
import CargoOwner from '@/components/CargoOwner.vue';
import AccountBreadcrumb from '@/components/AccountBreadcrumb.vue';
import CargoOwnerJobsMap from '@/components/CargoOwnerJobsMap.vue';
import { useGlobalInboxUnread } from '@/composables/useGlobalInboxUnread';

useGlobalInboxUnread();
</script>
