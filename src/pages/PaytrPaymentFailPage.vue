<template>
    <Header />
    <div class="min-h-[calc(100dvh-64px)] md:h-[calc(100vh-64px)]">
        <Content>
            <div
                class="flex flex-col md:flex-row gap-0 md:gap-3 w-full min-h-[calc(100dvh-64px)] md:h-[calc(100vh-64px)]"
            >
                <AccountSidebar v-if="isVehicleOwner" />
                <CargoOwner v-else-if="isCargoOwner" />
                <AccountSidebar v-else />

                <div
                    class="bg-white flex-1 min-w-0 min-h-0 md:mt-3 mt-0 border-y md:border border-gray-200 md:rounded-md rounded-none flex flex-col overflow-y-auto overscroll-y-contain pb-[max(1rem,env(safe-area-inset-bottom))]"
                >
                    <div class="md:hidden px-4 pt-4 pb-2 border-b border-gray-100 shrink-0">
                        <UserSection />
                    </div>

                    <div class="p-4 sm:p-6 lg:p-8 flex flex-col gap-5 sm:gap-6 min-h-full">
                        <div class="flex items-start gap-3 sm:gap-4">
                            <div
                                class="shrink-0 w-12 h-12 sm:w-14 sm:h-14 rounded-2xl flex items-center justify-center bg-red-50 text-red-600"
                            >
                                <i class="pi pi-times-circle text-2xl sm:text-[28px]"></i>
                            </div>
                            <div class="min-w-0 flex-1">
                                <p class="text-[11px] sm:text-xs font-semibold uppercase tracking-wide text-primary">
                                    Ödeme sonucu
                                </p>
                                <h1 class="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 mt-0.5 leading-snug">
                                    Ödeme tamamlanamadı
                                </h1>
                                <p class="text-xs sm:text-sm text-gray-500 mt-1 leading-relaxed">
                                    İşlem PayTR tarafında onaylanmadı veya iptal edildi. Kart bilgilerinizi kontrol
                                    ederek tekrar deneyebilirsiniz.
                                </p>
                            </div>
                        </div>

                        <div
                            class="relative overflow-hidden rounded-xl sm:rounded-2xl bg-linear-to-br from-slate-900 via-slate-800 to-red-900/80 p-4 sm:p-6 md:p-8 text-white shadow-lg"
                        >
                            <div
                                class="pointer-events-none absolute -right-8 -top-8 h-32 sm:h-40 w-32 sm:w-40 rounded-full bg-white/10 blur-2xl"
                            ></div>
                            <div
                                class="pointer-events-none absolute -bottom-10 left-1/3 h-24 sm:h-32 w-24 sm:w-32 rounded-full bg-red-500/20 blur-2xl"
                            ></div>
                            <div class="relative z-10 flex flex-col gap-5 sm:gap-6">
                                <div>
                                    <div
                                        class="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-[11px] sm:text-xs font-semibold"
                                    >
                                        <i class="pi pi-star text-amber-300"></i>
                                        TaşıBul Premium
                                    </div>
                                    <p class="mt-3 sm:mt-4 text-xl sm:text-2xl md:text-3xl font-bold tracking-tight">
                                        Premium aktif değil
                                    </p>
                                    <p class="mt-2 text-xs sm:text-sm text-white/80 leading-relaxed">
                                        {{ premiumCardDescription }}
                                    </p>
                                </div>
                                <div
                                    class="rounded-xl bg-white/10 px-4 py-3 sm:bg-transparent sm:p-0 sm:rounded-none sm:text-right"
                                >
                                    <p class="text-[10px] sm:text-xs uppercase tracking-wider text-white/60">
                                        {{ roleLabel }}
                                    </p>
                                    <p class="text-base sm:text-lg font-semibold mt-0.5 break-words">
                                        {{ user?.full_name ?? '—' }}
                                    </p>
                                    <p class="text-[11px] sm:text-xs text-white/70 mt-0.5 break-all">
                                        {{ user?.email ?? '' }}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div>
                            <h2 class="text-sm font-semibold text-gray-900 mb-2.5 sm:mb-3">
                                Premium ile neler yapabilirsiniz?
                            </h2>
                            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 sm:gap-3">
                                <div
                                    v-for="item in premiumBenefits"
                                    :key="item.title"
                                    class="rounded-xl border border-gray-200 bg-gray-50/80 p-3.5 sm:p-4 flex gap-3"
                                >
                                    <div
                                        class="w-9 h-9 sm:w-10 sm:h-10 rounded-lg flex items-center justify-center shrink-0"
                                        :class="item.iconBg"
                                    >
                                        <i
                                            :class="['pi', item.icon, item.iconColor]"
                                            style="font-size: 16px"
                                        ></i>
                                    </div>
                                    <div class="min-w-0">
                                        <p class="text-sm font-semibold text-gray-900">{{ item.title }}</p>
                                        <p class="text-xs text-gray-500 mt-0.5 leading-relaxed">{{ item.text }}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div class="flex flex-col sm:flex-row sm:flex-wrap gap-2.5 sm:gap-3 pt-1 sm:pt-2 mt-auto">
                            <RouterLink
                                :to="accountHomePath"
                                class="w-full sm:w-auto inline-flex items-center justify-center gap-2 min-h-11 px-5 py-2.5 rounded-lg border border-gray-200 bg-white text-gray-800 text-sm font-semibold hover:bg-gray-50 active:bg-gray-100 transition-colors"
                            >
                                <i class="pi pi-user"></i>
                                Hesabıma git
                            </RouterLink>
                            <button
                                type="button"
                                class="w-full sm:w-auto inline-flex items-center justify-center gap-2 min-h-11 px-5 py-2.5 rounded-lg bg-primary text-white text-sm font-semibold hover:bg-primary/90 active:bg-primary/80 transition-colors"
                                @click="retryPayment"
                            >
                                <i class="pi pi-refresh"></i>
                                Ödemeyi tekrar dene
                            </button>
                            <RouterLink
                                to="/panel"
                                class="w-full sm:w-auto inline-flex items-center justify-center gap-2 min-h-11 px-5 py-2.5 rounded-lg border-2 border-primary/30 bg-primary/5 text-primary text-sm font-semibold hover:bg-primary/10 active:bg-primary/15 transition-colors"
                            >
                                <i :class="['pi', exploreActionIcon]"></i>
                                {{ exploreActionLabel }}
                            </RouterLink>
                        </div>
                    </div>
                </div>
            </div>
        </Content>
    </div>
</template>

<script setup>
import { computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { storeToRefs } from 'pinia';
import Header from '@/components/Header.vue';
import Content from '@/components/Content.vue';
import AccountSidebar from '@/components/AccountSidebar.vue';
import CargoOwner from '@/components/CargoOwner.vue';
import UserSection from '@/components/UserSection.vue';
import { useAuthStore } from '@/stores/auth';

const authStore = useAuthStore();
const { user } = storeToRefs(authStore);
const router = useRouter();

const isCargoOwner = computed(() => user.value?.type === 'cargo_owner');
const isVehicleOwner = computed(() => user.value?.type === 'vehicle_owner');

const accountHomePath = computed(() =>
    isCargoOwner.value ? '/cargo-owner' : '/vehicle-owner'
);

const roleLabel = computed(() => {
    if (isCargoOwner.value) return 'Yük sahibi';
    if (isVehicleOwner.value) return 'Araç sahibi';
    return 'Üye';
});

const premiumCardDescription = computed(() => {
    if (isCargoOwner.value) {
        return 'Ödeme tamamlanmadığı için premium üyeliğiniz başlatılamadı. Tekrar deneyerek ilan yayınlayabilirsiniz.';
    }
    if (isVehicleOwner.value) {
        return 'Ödeme tamamlanmadığı için premium üyeliğiniz başlatılamadı. Tekrar deneyerek tüm ilanlara erişebilirsiniz.';
    }
    return 'Ödeme tamamlanmadığı için premium üyeliğiniz başlatılamadı. Tekrar deneyebilirsiniz.';
});

const exploreActionLabel = computed(() =>
    isCargoOwner.value ? 'Araç bul' : 'Yük ilanlarını keşfet'
);

const exploreActionIcon = computed(() => (isCargoOwner.value ? 'pi-search' : 'pi-compass'));

const premiumBenefits = computed(() => {
    if (isCargoOwner.value) {
        return [
            {
                title: 'İlan yayınla',
                text: 'Yük ilanı oluşturup taşıyıcılarla eşleşin.',
                icon: 'pi-megaphone',
                iconBg: 'bg-primary/10',
                iconColor: 'text-primary',
            },
            {
                title: 'Taşıyıcı bul',
                text: 'Panelden güzergahınıza uygun araçları keşfedin.',
                icon: 'pi-search',
                iconBg: 'bg-blue-50',
                iconColor: 'text-blue-600',
            },
            {
                title: 'Mesajlaş',
                text: 'Araç sahipleriyle doğrudan iletişim kurun.',
                icon: 'pi-envelope',
                iconBg: 'bg-violet-50',
                iconColor: 'text-violet-600',
            },
        ];
    }

    if (isVehicleOwner.value) {
        return [
            {
                title: 'Yük keşfet',
                text: 'Güzergahınıza uygun yük ilanlarını görüntüleyin.',
                icon: 'pi-compass',
                iconBg: 'bg-primary/10',
                iconColor: 'text-primary',
            },
            {
                title: 'Teklif ver',
                text: 'İlanlara teklif göndererek yeni işler alın.',
                icon: 'pi-send',
                iconBg: 'bg-amber-50',
                iconColor: 'text-amber-600',
            },
            {
                title: 'Mesajlaş',
                text: 'Yük sahipleriyle doğrudan iletişim kurun.',
                icon: 'pi-envelope',
                iconBg: 'bg-violet-50',
                iconColor: 'text-violet-600',
            },
        ];
    }

    return [
        {
            title: 'Keşfet',
            text: 'Platformdaki ilanları görüntüleyin.',
            icon: 'pi-search',
            iconBg: 'bg-blue-50',
            iconColor: 'text-blue-600',
        },
        {
            title: 'İletişim',
            text: 'Diğer kullanıcılarla mesajlaşın.',
            icon: 'pi-envelope',
            iconBg: 'bg-violet-50',
            iconColor: 'text-violet-600',
        },
        {
            title: 'Premium',
            text: 'Tüm premium özelliklere erişin.',
            icon: 'pi-star',
            iconBg: 'bg-primary/10',
            iconColor: 'text-primary',
        },
    ];
});

function retryPayment() {
    authStore.showPremiumModal = true;
    router.push('/panel');
}

onMounted(async () => {
    await authStore.checkToken();
});
</script>
