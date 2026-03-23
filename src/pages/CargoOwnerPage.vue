<template>
    <Header />
    <div class="h-[calc(100vh-64px)]">
        <Content>
            <div class="flex flex-row gap-3 w-full h-[calc(100vh-64px)]">
                <CargoOwner />
                <div class="flex-1 mt-3 flex flex-col overflow-y-auto pb-6 gap-5">
                    <div class="bg-white border border-gray-200 rounded-xl p-6">
                        <h1 class="text-xl font-bold text-gray-900">Hoş geldin, {{ user?.first_name ?? 'Yük Sahibi' }} 👋</h1>
                        <p class="text-sm text-gray-500 mt-1">Yüklerini yönet, ilan oluştur ve taşıyıcılarla iletişime geç.</p>
                    </div>

                    <div class="grid grid-cols-2 gap-4">
                        <router-link
                            to="/cargo-owner/posts"
                            class="bg-white border border-gray-200 rounded-xl p-5 flex items-center gap-4 hover:border-primary/50 hover:bg-primary/5 transition-all"
                        >
                            <div class="w-12 h-12 rounded-xl bg-amber-50 flex items-center justify-center shrink-0">
                                <i class="pi pi-megaphone text-amber-600" style="font-size: 22px;"></i>
                            </div>
                            <div class="flex-1">
                                <p class="text-xs text-gray-500">Toplam İlanım</p>
                                <p class="text-2xl font-bold text-gray-900">{{ totalPosts ?? 0 }}</p>
                            </div>
                            <i class="pi pi-chevron-right text-gray-300" style="font-size: 14px;"></i>
                        </router-link>

                        <router-link
                            to="/cargo-owner/cuzdan"
                            class="bg-white border border-gray-200 rounded-xl p-5 flex items-center gap-4 hover:border-primary/50 hover:bg-primary/5 transition-all"
                        >
                            <div class="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center shrink-0">
                                <i class="pi pi-wallet text-emerald-600" style="font-size: 22px;"></i>
                            </div>
                            <div class="flex-1">
                                <p class="text-xs text-gray-500">Toplam Kazancım</p>
                                <p class="text-2xl font-bold text-gray-900">{{ walletBalance }} ₺</p>
                            </div>
                            <i class="pi pi-chevron-right text-gray-300" style="font-size: 14px;"></i>
                        </router-link>
                    </div>

                    <div class="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        <router-link
                            to="/cargo-owner/posts/create"
                            class="group bg-primary/5 border-2 border-primary/20 rounded-xl p-5 flex flex-col gap-3 hover:border-primary hover:bg-primary/10 transition-all"
                        >
                            <div class="w-10 h-10 rounded-lg bg-primary/15 flex items-center justify-center">
                                <i class="pi pi-plus text-primary" style="font-size: 18px;"></i>
                            </div>
                            <div>
                                <h3 class="text-sm font-semibold text-gray-900">Yeni İlan Oluştur</h3>
                                <p class="text-xs text-gray-500 mt-0.5">Yükünü tanımla ve taşıyıcı bul</p>
                            </div>
                        </router-link>

                        <router-link
                            to="/panel"
                            class="group bg-white border border-gray-200 rounded-xl p-5 flex flex-col gap-3 hover:border-primary/50 hover:bg-primary/5 transition-all"
                        >
                            <div class="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center">
                                <i class="pi pi-search text-blue-600" style="font-size: 18px;"></i>
                            </div>
                            <div>
                                <h3 class="text-sm font-semibold text-gray-900">Araç Bul</h3>
                                <p class="text-xs text-gray-500 mt-0.5">Mevcut taşıyıcıları keşfet</p>
                            </div>
                        </router-link>

                        <router-link
                            to="/cargo-owner/posts"
                            class="group bg-white border border-gray-200 rounded-xl p-5 flex flex-col gap-3 hover:border-primary/50 hover:bg-primary/5 transition-all"
                        >
                            <div class="w-10 h-10 rounded-lg bg-amber-50 flex items-center justify-center">
                                <i class="pi pi-list text-amber-600" style="font-size: 18px;"></i>
                            </div>
                            <div>
                                <h3 class="text-sm font-semibold text-gray-900">İlanlarım</h3>
                                <p class="text-xs text-gray-500 mt-0.5">Aktif ve geçmiş ilanlarını görüntüle</p>
                            </div>
                        </router-link>

                        <router-link
                            to="/cargo-owner/messages"
                            class="group bg-white border border-gray-200 rounded-xl p-5 flex flex-col gap-3 hover:border-primary/50 hover:bg-primary/5 transition-all relative"
                        >
                            <span
                                v-if="hasUnreadMessages"
                                class="absolute top-4 right-4 w-2.5 h-2.5 rounded-full bg-red-500"
                            />
                            <div class="w-10 h-10 rounded-lg bg-violet-50 flex items-center justify-center">
                                <i class="pi pi-envelope text-violet-600" style="font-size: 18px;"></i>
                            </div>
                            <div>
                                <h3 class="text-sm font-semibold text-gray-900">Mesajlarım</h3>
                                <p class="text-xs text-gray-500 mt-0.5">Taşıyıcılarla iletişim kur</p>
                            </div>
                        </router-link>

                        <router-link
                            to="/cargo-owner/reviews"
                            class="group bg-white border border-gray-200 rounded-xl p-5 flex flex-col gap-3 hover:border-primary/50 hover:bg-primary/5 transition-all"
                        >
                            <div class="w-10 h-10 rounded-lg bg-yellow-50 flex items-center justify-center">
                                <i class="pi pi-star text-yellow-600" style="font-size: 18px;"></i>
                            </div>
                            <div>
                                <h3 class="text-sm font-semibold text-gray-900">Değerlendirmelerim</h3>
                                <p class="text-xs text-gray-500 mt-0.5">Aldığın yorumları incele</p>
                            </div>
                        </router-link>

                        <router-link
                            to="/cargo-owner/addresses"
                            class="group bg-white border border-gray-200 rounded-xl p-5 flex flex-col gap-3 hover:border-primary/50 hover:bg-primary/5 transition-all"
                        >
                            <div class="w-10 h-10 rounded-lg bg-green-50 flex items-center justify-center">
                                <i class="pi pi-map-marker text-green-600" style="font-size: 18px;"></i>
                            </div>
                            <div>
                                <h3 class="text-sm font-semibold text-gray-900">Adreslerim</h3>
                                <p class="text-xs text-gray-500 mt-0.5">Kayıtlı adreslerini yönet</p>
                            </div>
                        </router-link>
                    </div>

                    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <router-link
                            to="/cargo-owner/verify"
                            class="bg-white border border-gray-200 rounded-xl p-5 flex items-center gap-4 hover:border-primary/50 hover:bg-primary/5 transition-all"
                        >
                            <div class="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                                <i class="pi pi-verified text-primary" style="font-size: 18px;"></i>
                            </div>
                            <div>
                                <h3 class="text-sm font-semibold text-gray-900">Hesap Doğrula</h3>
                                <p class="text-xs text-gray-500 mt-0.5">Hesabını doğrula</p>
                            </div>
                        </router-link>

                        <router-link
                            to="/cargo-owner/cards"
                            class="bg-white border border-gray-200 rounded-xl p-5 flex items-center gap-4 hover:border-primary/50 hover:bg-primary/5 transition-all"
                        >
                            <div class="w-10 h-10 rounded-lg bg-rose-50 flex items-center justify-center shrink-0">
                                <i class="pi pi-credit-card text-rose-600" style="font-size: 18px;"></i>
                            </div>
                            <div>
                                <h3 class="text-sm font-semibold text-gray-900">Kayıtlı Kartlarım</h3>
                                <p class="text-xs text-gray-500 mt-0.5">Ödeme yöntemlerini düzenle</p>
                            </div>
                        </router-link>

                        <router-link
                            to="/cargo-owner/change-password"
                            class="bg-white border border-gray-200 rounded-xl p-5 flex items-center gap-4 hover:border-primary/50 hover:bg-primary/5 transition-all"
                        >
                            <div class="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center shrink-0">
                                <i class="pi pi-lock text-gray-600" style="font-size: 18px;"></i>
                            </div>
                            <div>
                                <h3 class="text-sm font-semibold text-gray-900">Şifre Değiştir</h3>
                                <p class="text-xs text-gray-500 mt-0.5">Hesap güvenliğini güncelle</p>
                            </div>
                        </router-link>
                    </div>

                </div>
            </div>
        </Content>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { storeToRefs } from 'pinia';
import Header from '@/components/Header.vue';
import Content from '@/components/Content.vue';
import CargoOwner from '@/components/CargoOwner.vue';
import { useAuthStore } from '@/stores/auth';
import api from '@/api';

const authStore = useAuthStore();
const { user } = storeToRefs(authStore);

const hasUnreadMessages = ref(false);
const totalPosts = ref(0);
const walletBalance = ref('0,00');

async function fetchHasUnreadMessages() {
    if (!authStore.isAuthenticated) return;
    try {
        const res = await api.get('/messages/has-unread');
        hasUnreadMessages.value = res.data?.content?.has_unread === true;
    } catch (_) {
        hasUnreadMessages.value = false;
    }
}

async function fetchTotalPosts() {
    if (!authStore.isAuthenticated) return;
    try {
        const res = await api.get('/shipments/creator/' + user.value?.id);
        const content = res.data?.content;
        const list = content?.shipments ?? content?.data ?? content ?? [];
        totalPosts.value = Array.isArray(list) ? list.length : 0;
    } catch (_) {
        totalPosts.value = 0;
    }
}

onMounted(() => {
    fetchHasUnreadMessages();
    fetchTotalPosts();
});
</script>
