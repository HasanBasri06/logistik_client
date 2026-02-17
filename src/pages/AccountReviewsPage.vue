<template>
    <Header />
    <div class="h-[calc(100vh-64px)]">
        <Content>
            <div class="flex flex-row gap-3 w-full h-[calc(100vh-64px)]">
                <AccountSidebar />
                <div class="bg-white flex-1 mt-3 border border-gray-200 p-3 rounded-md flex flex-col overflow-hidden">
                    <AccountReviews />
                </div>
            </div>
        </Content>
    </div>
</template>

<script setup>
import Header from '@/components/Header.vue';
import Content from '@/components/Content.vue';
import AccountSidebar from '@/components/AccountSidebar.vue';
import AccountReviews from '@/account/AccountReviews.vue';
</script>
