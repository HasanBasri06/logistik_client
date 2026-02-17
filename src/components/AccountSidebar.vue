<template>
    <div class="w-[275px] flex flex-col gap-4 overflow-y-auto py-3">
        <user-section />
        <div class="w-full h-auto pb-3 rounded-md border border-gray-200 text-gray-800 bg-white">
            <div class="w-full h-10 px-4 text-sm font-semibold flex items-center justify-start rounded-t-md border-b border-b-gray-200">Siparişlerim</div>
            <ul class="w-full h-auto flex flex-col gap-2 px-2 pt-2 text-xs">
                <li>
                    <router-link 
                        to="/vehicle-owner/orders"
                        :class="[
                            'h-8 flex items-center px-3 rounded-md cursor-pointer',
                            $route.path === '/vehicle-owner/orders' ? 'bg-primary/10 font-medium' : 'text-gray-800'
                        ]"
                    >
                        <i class="pi pi-shopping-bag mr-2 text-primary" style="font-size: 14px;"></i>
                        <span>Tüm Siparişlerim</span>
                    </router-link>
                </li>
                <li>
                    <router-link 
                        to="/vehicle-owner/reviews"
                        :class="[
                            'h-8 flex items-center px-3 rounded-md cursor-pointer',
                            $route.path === '/vehicle-owner/reviews' ? 'bg-primary/10 font-medium' : 'text-gray-800'
                        ]"
                    >
                        <i class="pi pi-star mr-2 text-primary" style="font-size: 14px;"></i>
                        <span>Değerlendirmelerim</span>
                    </router-link>
                </li>
                <li>
                    <router-link 
                        to="/vehicle-owner/messages"
                        :class="[
                            'h-8 flex items-center px-3 rounded-md cursor-pointer',
                            $route.path === '/vehicle-owner/messages' ? 'bg-primary/10 font-medium' : 'text-gray-800'
                        ]"
                    >
                        <i class="pi pi-envelope mr-2 text-primary" style="font-size: 14px;"></i>
                        <span>Yük Sahibi Mesajları</span>
                    </router-link>
                </li>
            </ul>
        </div>
        <div class="w-full h-auto pb-3 rounded-md border border-gray-200 text-gray-800 bg-white">
            <div class="w-full h-10 px-4 text-sm font-semibold flex items-center justify-start rounded-t-md border-b border-b-gray-200">Araç</div>
            <ul class="w-full h-auto flex flex-col px-2 pt-2 text-xs">
                <li>
                    <router-link 
                        to="/vehicle-owner/vehicles"
                        :class="[
                            'h-8 flex items-center px-3 rounded-md cursor-pointer',
                            $route.path === '/vehicle-owner/vehicles' ? 'bg-primary/10 font-medium' : 'text-gray-800'
                        ]"
                    >
                        <i class="pi pi-car mr-2 text-primary" style="font-size: 14px;"></i>
                        <span>Tüm Araçlarım</span>
                    </router-link>
                </li>
            </ul>
        </div>
        <div class="w-full h-auto pb-3 rounded-md border border-gray-200 text-gray-800 bg-white">
            <div class="w-full h-10 px-4 text-sm font-semibold flex items-center justify-start rounded-t-md border-b border-b-gray-200">Hesap Bilgilerim</div>
            <ul class="w-full h-auto flex flex-col gap-2 px-2 pt-2 text-xs">
                <li>
                    <router-link 
                        to="/vehicle-owner/change-password"
                        :class="[
                            'h-8 flex items-center px-3 rounded-md cursor-pointer',
                            $route.path === '/vehicle-owner/change-password' ? 'bg-primary/10 font-medium' : 'text-gray-800'
                        ]"
                    >
                        <i class="pi pi-key mr-2 text-primary" style="font-size: 14px;"></i>
                        <span>Şifre Değiştir</span>
                    </router-link>
                </li>
                <li>
                    <router-link 
                        to="/vehicle-owner/verify"
                        :class="[
                            'h-8 flex items-center px-3 rounded-md cursor-pointer',
                            $route.path === '/vehicle-owner/verify' ? 'bg-primary/10 font-medium' : 'text-gray-800'
                        ]"
                    >
                        <i class="pi pi-user mr-2 text-primary" style="font-size: 14px;"></i>
                        <span>Hesap Doğrula</span>
                    </router-link>
                </li>
                <li>
                    <router-link 
                        to="/vehicle-owner/cards"
                        :class="[
                            'h-8 flex items-center px-3 rounded-md cursor-pointer',
                            $route.path === '/vehicle-owner/cards' ? 'bg-primary/10 font-medium' : 'text-gray-800'
                        ]"
                    >
                        <i class="pi pi-credit-card mr-2 text-primary" style="font-size: 14px;"></i>
                        <span>Kayıtlı Kartlarım</span>
                    </router-link>
                </li>
            </ul>
        </div>

        <div class="w-full h-24 pb-3 rounded-md border border-gray-200 text-gray-800 flex items-center justify-center gap-2 flex-col bg-primary/10">
            <i class="pi pi-question-circle mr-2 text-primary" style="font-size: 24px;"></i>
            <h2 class="text-center text-primary text-sm font-semibold">TaşıBul Ekibine Sor</h2>
        </div>
    </div>
</template>

<script setup>
import { useAuthStore } from '@/stores/auth';
import { storeToRefs } from 'pinia';
import UserSection from './UserSection.vue';

    const authStore = useAuthStore();
    const {user} = storeToRefs(authStore);
    console.log(user.value);
    
</script>
