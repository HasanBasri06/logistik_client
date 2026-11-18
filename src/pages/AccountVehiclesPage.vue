<template>
    <Header />
    <div class="h-[calc(100vh-64px)]">
        
            <div class="flex flex-row w-full h-[calc(100vh-64px)] bg-gray-50">
                <AccountSidebar />
                <div class="flex-1 min-w-0 min-h-0 flex flex-col p-4 sm:p-6">
                    <!-- Sayfa yolu: içerik alanının en üstünde -->
                    <AccountBreadcrumb class="mb-4 shrink-0" />
                    <div class="bg-white rounded-2xl border border-gray-200 shadow-sm flex-1 flex flex-col overflow-hidden p-4 sm:p-5">
                        <AccountVehicles />
                    </div>
                </div>
            </div>
        
    </div>
</template>

<script setup>
import Header from '@/components/Header.vue';
import AccountSidebar from '@/components/AccountSidebar.vue';
import AccountBreadcrumb from '@/components/AccountBreadcrumb.vue';
import AccountVehicles from '@/account/AccountVehicles.vue';
</script>
