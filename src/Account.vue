<template>
    <Header />
    <div class="h-[calc(100vh-64px)]">
        <Content>
            <div class="flex flex-row gap-3 w-full h-[calc(100vh-64px)]">
                <AccountSidebar />
                <div class="flex-1 mt-3 flex flex-col overflow-y-auto pb-6 gap-5">
                    <div class="bg-white border border-gray-200 rounded-xl p-6">
                        <h1 class="text-xl font-bold text-gray-900">Hoş geldin, {{ user?.first_name ?? 'Araç Sahibi' }} 👋</h1>
                        <p class="text-sm text-gray-500 mt-1">Araçlarını yönet, yük ilanlarını keşfet ve kazancını takip et.</p>
                    </div>

                    <div class="grid grid-cols-2 md:grid-cols-3 gap-4">
                        <div class="bg-white border border-gray-200 rounded-xl p-5 flex items-center gap-4">
                            <div class="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center shrink-0">
                                <i class="pi pi-clock text-blue-600" style="font-size: 22px;"></i>
                            </div>
                            <div class="flex-1">
                                <p class="text-xs text-gray-500">Bekleyen İşler</p>
                                <p class="text-2xl font-bold text-gray-900">{{ pendingJobs }}</p>
                            </div>
                        </div>

                        <router-link
                            to="/vehicle-owner/vehicles"
                            class="bg-white border border-gray-200 rounded-xl p-5 flex items-center gap-4 hover:border-primary/50 hover:bg-primary/5 transition-all"
                        >
                            <div class="w-12 h-12 rounded-xl bg-purple-50 flex items-center justify-center shrink-0">
                                <i class="pi pi-car text-purple-600" style="font-size: 22px;"></i>
                            </div>
                            <div class="flex-1">
                                <p class="text-xs text-gray-500">Araç Sayısı</p>
                                <p class="text-2xl font-bold text-gray-900">{{ vehicleCount }}</p>
                            </div>
                            <i class="pi pi-chevron-right text-gray-300" style="font-size: 14px;"></i>
                        </router-link>
                    </div>

                    <div class="grid grid-cols-2 md:grid-cols-3 gap-4">
                        <router-link
                            to="/panel"
                            class="group bg-primary/5 border-2 border-primary/20 rounded-xl p-5 flex flex-col gap-3 hover:border-primary hover:bg-primary/10 transition-all"
                        >
                            <div class="w-10 h-10 rounded-lg bg-primary/15 flex items-center justify-center">
                                <i class="pi pi-search text-primary" style="font-size: 18px;"></i>
                            </div>
                            <div>
                                <h3 class="text-sm font-semibold text-gray-900">Yük İlanlarını Keşfet</h3>
                                <p class="text-xs text-gray-500 mt-0.5">Güzergahına uygun yükler bul</p>
                            </div>
                        </router-link>

                        <router-link
                            to="/vehicle-owner/orders"
                            class="group bg-white border border-gray-200 rounded-xl p-5 flex flex-col gap-3 hover:border-primary/50 hover:bg-primary/5 transition-all"
                        >
                            <div class="w-10 h-10 rounded-lg bg-amber-50 flex items-center justify-center">
                                <i class="pi pi-shopping-bag text-amber-600" style="font-size: 18px;"></i>
                            </div>
                            <div>
                                <h3 class="text-sm font-semibold text-gray-900">Siparişlerim</h3>
                                <p class="text-xs text-gray-500 mt-0.5">Aktif ve geçmiş siparişlerin</p>
                            </div>
                        </router-link>

                        <router-link
                            to="/vehicle-owner/vehicles"
                            class="group bg-white border border-gray-200 rounded-xl p-5 flex flex-col gap-3 hover:border-primary/50 hover:bg-primary/5 transition-all"
                        >
                            <div class="w-10 h-10 rounded-lg bg-purple-50 flex items-center justify-center">
                                <i class="pi pi-car text-purple-600" style="font-size: 18px;"></i>
                            </div>
                            <div>
                                <h3 class="text-sm font-semibold text-gray-900">Araçlarım</h3>
                                <p class="text-xs text-gray-500 mt-0.5">Araçlarını yönet ve ekle</p>
                            </div>
                        </router-link>

                        <router-link
                            to="/vehicle-owner/messages"
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
                                <p class="text-xs text-gray-500 mt-0.5">Yük sahipleriyle iletişim kur</p>
                            </div>
                        </router-link>

                        <router-link
                            to="/vehicle-owner/reviews"
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
                            to="/vehicle-owner/addresses"
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

                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <router-link
                            to="/vehicle-owner/verify"
                            class="bg-white border border-gray-200 rounded-xl p-5 flex items-center gap-4 hover:border-primary/50 hover:bg-primary/5 transition-all"
                        >
                            <div class="w-10 h-10 rounded-lg bg-sky-50 flex items-center justify-center shrink-0">
                                <i class="pi pi-user text-sky-600" style="font-size: 18px;"></i>
                            </div>
                            <div>
                                <h3 class="text-sm font-semibold text-gray-900">Hesap Doğrula</h3>
                                <p class="text-xs text-gray-500 mt-0.5">Hesap doğrulama adımlarını tamamla</p>
                            </div>
                        </router-link>

                        <router-link
                            to="/vehicle-owner/change-password"
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
import Content from './components/Content.vue';
import Header from './components/Header.vue';
import AccountSidebar from './components/AccountSidebar.vue';
import { useAuthStore } from '@/stores/auth';
import api from './api';

const authStore = useAuthStore();
const { user } = storeToRefs(authStore);

const pendingJobs = ref(0);
const vehicleCount = ref(0);
const hasUnreadMessages = ref(false);

async function fetchVehicleOwnerData() {
    try {
        const res = await api.get('/vehicle');
        const content = res.data?.content;
        vehicleCount.value = content?.vehicles?.length ?? 0;

        const orders = content?.shipmentOrders ?? [];
        const shipmentStatus = (o) => o.shipment?.status ?? o.status;
        const ongoing = (s) => s === 'accepted' || s === 'active' || s === 'pending';
        pendingJobs.value = orders.filter((o) => ongoing(shipmentStatus(o))).length;
    } catch {
        vehicleCount.value = 0;
    }
}

async function fetchHasUnreadMessages() {
    if (!authStore.isAuthenticated) return;
    try {
        const res = await api.get('/messages/has-unread');
        hasUnreadMessages.value = res.data?.content?.has_unread === true;
    } catch {
        hasUnreadMessages.value = false;
    }
}

onMounted(() => {
    fetchVehicleOwnerData();
    fetchHasUnreadMessages();
});
</script>
