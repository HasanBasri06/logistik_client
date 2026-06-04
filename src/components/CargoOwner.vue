<template>
    <div class="hidden md:flex md:w-[275px] md:flex-col md:gap-4 md:overflow-y-auto md:py-3">
        <user-section />
        <div class="w-full h-auto pb-3 rounded-md border border-gray-200 text-gray-800 bg-white">
            <div class="w-full h-10 px-4 text-sm font-semibold flex items-center justify-start rounded-t-md border-b border-b-gray-200">İlanlarım</div>
            <ul class="w-full h-auto flex flex-col gap-2 px-2 pt-2 text-xs">

                <li>
                    <router-link 
                        to="/cargo-owner/reviews"
                        :class="[
                            'h-8 flex items-center px-3 rounded-md cursor-pointer',
                            $route.path === '/cargo-owner/reviews' ? 'bg-primary/10 font-medium' : 'text-gray-800'
                        ]"
                    >
                        <i class="pi pi-star mr-2 text-primary" style="font-size: 14px;"></i>
                        <span>Değerlendirmelerim</span>
                    </router-link>
                </li>
                <li>
                    <router-link 
                        to="/cargo-owner/messages"
                        :class="[
                            'h-8 flex items-center px-3 rounded-md cursor-pointer',
                            $route.path === '/cargo-owner/messages' ? 'bg-primary/10 font-medium' : 'text-gray-800'
                        ]"
                    >
                        <i class="pi pi-envelope mr-2 text-primary" style="font-size: 14px;"></i>
                        <span>Araç Sahibi Mesajları</span>
                        <span
                            v-if="hasUnreadMessages"
                            class="w-2 h-2 rounded-full bg-red-400 shrink-0 ml-1"
                            aria-hidden="true"
                        />
                    </router-link>
                </li>
            </ul>
        </div>
        <div class="w-full h-auto pb-3 rounded-md border border-gray-200 text-gray-800 bg-white">
            <div class="w-full h-10 px-4 text-sm font-semibold flex items-center justify-start rounded-t-md border-b border-b-gray-200">İlan Bilgilerim</div>
            <ul class="w-full h-auto flex flex-col px-2 pt-2 text-xs">
                <li>
                    <router-link 
                        to="/cargo-owner/posts"
                        :class="[
                            'h-8 flex items-center px-3 rounded-md cursor-pointer',
                            $route.path === '/cargo-owner/posts' ? 'bg-primary/10 font-medium' : 'text-gray-800'
                        ]"
                    >
                        <i class="pi pi-car mr-2 text-primary" style="font-size: 14px;"></i>
                        <span>İlanlarım</span>
                    </router-link>
                </li>
                <li>
                    <router-link 
                        to="/cargo-owner/posts/create"
                        :class="[
                            'h-8 flex items-center px-3 rounded-md cursor-pointer',
                            $route.path === '/cargo-owner/posts/create' ? 'bg-primary/10 font-medium' : 'text-gray-800'
                        ]"
                    >
                        <i class="pi pi-plus mr-2 text-primary" style="font-size: 14px;"></i>
                        <span>İlan oluştur</span>
                    </router-link>
                </li>
                <li>
                    <router-link 
                        to="/cargo-owner/addresses"
                        :class="[
                            'h-8 flex items-center px-3 rounded-md cursor-pointer',
                            $route.path === '/cargo-owner/addresses' ? 'bg-primary/10 font-medium' : 'text-gray-800'
                        ]"
                    >
                        <i class="pi pi-address-book mr-2 text-primary" style="font-size: 14px;"></i>
                        <span>Adreslerim</span>
                    </router-link>
                </li>
            </ul>
        </div>
        <div class="w-full h-auto pb-3 rounded-md border border-gray-200 text-gray-800 bg-white">
            <div class="w-full h-10 px-4 text-sm font-semibold flex items-center justify-start rounded-t-md border-b border-b-gray-200">Hesap Bilgilerim</div>
            <ul class="w-full h-auto flex flex-col gap-2 px-2 pt-2 text-xs">
                <li>
                    <router-link 
                        to="/cargo-owner/verify"
                        :class="[
                            'h-8 flex items-center px-3 rounded-md cursor-pointer',
                            $route.path === '/cargo-owner/verify' ? 'bg-primary/10 font-medium' : 'text-gray-800'
                        ]"
                    >
                        <i class="pi pi-verified mr-2 text-primary" style="font-size: 14px;"></i>
                        <span>Hesap Doğrula</span>
                    </router-link>
                </li>
                <li>
                    <router-link 
                        to="/cargo-owner/settings"
                        :class="[
                            'h-8 flex items-center px-3 rounded-md cursor-pointer',
                            $route.path.startsWith('/cargo-owner/settings') ||
                            $route.path === '/cargo-owner/change-password'
                                ? 'bg-primary/10 font-medium'
                                : 'text-gray-800'
                        ]"
                    >
                        <i class="pi pi-cog mr-2 text-primary" style="font-size: 14px;"></i>
                        <span>Ayarlar</span>
                    </router-link>
                </li>
            </ul>
        </div>

        <div
            role="button"
            tabindex="0"
            class="w-full h-24 pb-3 rounded-md border border-gray-200 text-gray-800 flex items-center justify-center gap-2 flex-col bg-primary/10 cursor-pointer hover:bg-primary/15 transition-colors"
            @click="ekibineSorOpen = true"
            @keydown.enter.space.prevent="ekibineSorOpen = true"
        >
            <i class="pi pi-question-circle mr-2 text-primary" style="font-size: 24px;"></i>
            <h2 class="text-center text-primary text-sm font-semibold">TaşıBul Ekibine Sor</h2>
        </div>
        <EkibineSorModal v-model:open="ekibineSorOpen" />
    </div>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import { useAuthStore } from '@/stores/auth';
import { storeToRefs } from 'pinia';
import UserSection from './UserSection.vue';
import EkibineSorModal from './EkibineSorModal.vue';
import { useInboxUnreadStore } from '@/stores/inbox-unread';
import { useGlobalInboxUnread } from '@/composables/useGlobalInboxUnread';

const authStore = useAuthStore();
const { user } = storeToRefs(authStore);

useGlobalInboxUnread();
const inboxUnread = useInboxUnreadStore();
const { hasUnread: hasUnreadMessages } = storeToRefs(inboxUnread);
const ekibineSorOpen = ref(false);

onMounted(() => {
    if (authStore.isAuthenticated) void inboxUnread.fetchHasUnread();
});
</script>
