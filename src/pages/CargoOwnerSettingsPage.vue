<template>
    <Header />
    <div class="min-h-[calc(100vh-64px)] bg-gray-50/50">
        
            <div class="flex flex-row w-full min-h-[calc(100vh-64px)] bg-gray-50">
                <CargoOwner />
                <div class="flex-1 min-w-0 p-4 sm:p-6">
                    <!-- Sayfa yolu: içerik alanının en üstünde -->
                    <AccountBreadcrumb class="mb-4 shrink-0" />
                    <div class="rounded-2xl border border-gray-200 bg-white p-6 md:p-8 shadow-sm">
                        <AccountSettings change-password-path="/cargo-owner/change-password" />
                    </div>
                </div>
            </div>
        
    </div>
</template>

<script setup>
import Header from '@/components/Header.vue';
import CargoOwner from '@/components/CargoOwner.vue';
import AccountBreadcrumb from '@/components/AccountBreadcrumb.vue';
import AccountSettings from '@/account/AccountSettings.vue';
</script>
