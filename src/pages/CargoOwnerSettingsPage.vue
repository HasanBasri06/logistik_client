<template>
    <Header />
    <div class="min-h-[calc(100vh-64px)] bg-gray-50/50">
        <Content>
            <div class="flex flex-row gap-6 w-full py-6">
                <CargoOwner />
                <div class="flex-1 min-w-0">
                    <div class="rounded-2xl border border-gray-200 bg-white p-6 md:p-8 shadow-sm">
                        <AccountSettings change-password-path="/cargo-owner/change-password" />
                    </div>
                </div>
            </div>
        </Content>
    </div>
</template>

<script setup>
import Header from '@/components/Header.vue';
import Content from '@/components/Content.vue';
import CargoOwner from '@/components/CargoOwner.vue';
import AccountSettings from '@/account/AccountSettings.vue';
</script>
