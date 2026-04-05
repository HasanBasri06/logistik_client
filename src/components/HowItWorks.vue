<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { storeToRefs } from 'pinia';
import { useAuthStore } from '@/stores/auth';
import Content from './Content.vue';

const router = useRouter();
const authStore = useAuthStore();
const { isAuthenticated } = storeToRefs(authStore);

const activeTab = ref('cargo');

/** İlk adım kutusu: misafirde giriş modalı, oturumda ilgili sayfa */
function handleFirstStepClick() {
    if (!isAuthenticated.value) {
        authStore.openLoginModal();
        return;
    }
    if (activeTab.value === 'cargo') {
        router.push('/cargo-owner/posts/create');
    } else {
        router.push('/vehicle-owner');
    }
}

const tabs = [
    { id: 'cargo', label: 'Yük Sahibi', icon: 'pi-box' },
    { id: 'vehicle', label: 'Araç Sahibi', icon: 'pi-truck' },
];

const steps = {
    cargo: [
        {
            number: '01',
            icon: 'pi-pencil',
            title: 'Yük İlanı Oluşturun',
            description: 'Yükünüzün detaylarını, çıkış ve varış noktalarını belirleyerek hızlıca ilan oluşturun.',
        },
        {
            number: '02',
            icon: 'pi-list-check',
            title: 'Teklifleri Karşılaştırın',
            description: 'Araç sahiplerinden gelen teklifleri fiyat, süre ve değerlendirme puanlarına göre karşılaştırın.',
        },
        {
            number: '03',
            icon: 'pi-check-circle',
            title: 'Taşıyıcıyı Seçin',
            description: 'Size en uygun taşıyıcıyı seçin ve anlaşma şartlarını onaylayın.',
        },
        {
            number: '04',
            icon: 'pi-map-marker',
            title: 'Canlı Takip Edin',
            description: 'Yükünüzü harita üzerinden gerçek zamanlı olarak takip edin, teslimatı güvenle tamamlayın.',
        },
    ],
    vehicle: [
        {
            number: '01',
            icon: 'pi-user-plus',
            title: 'Hesap Oluşturun',
            description: 'Araç bilgilerinizi ve belgelerinizi yükleyerek hızlıca kayıt olun ve onay sürecini tamamlayın.',
        },
        {
            number: '02',
            icon: 'pi-search',
            title: 'Yük İlanlarını Keşfedin',
            description: 'Güzergahınıza ve araç tipinize uygun yük ilanlarını filtreleyerek bulun.',
        },
        {
            number: '03',
            icon: 'pi-send',
            title: 'Teklif Gönderin',
            description: 'Uygun bulduğunuz ilanlara fiyat ve süre bilgisi ile teklif verin.',
        },
        {
            number: '04',
            icon: 'pi-wallet',
            title: 'Kazancınızı Alın',
            description: 'Teslimatı tamamlayın, yük sahibinin onayı ile ödemenizi güvenli şekilde alın.',
        },
    ],
};
</script>

<template>
    <Content class="mt-12 md:mt-24">
        <div class="flex flex-col items-center gap-8 md:gap-12">

            <div class="flex flex-col items-center gap-4 text-center max-w-xl">
                <span class="text-sm font-semibold text-primary tracking-wide uppercase">Adım Adım</span>
                <h2 class="text-2xl md:text-4xl font-bold tracking-tight">Nasıl Çalışır?</h2>
                <p class="text-gray-500 text-base leading-relaxed">
                    Platformumuzu kullanmaya başlamak çok kolay. Rolünüzü seçin ve adımları inceleyin.
                </p>
            </div>

            <div class="flex items-center bg-gray-100 rounded-full p-1">
                <button
                    v-for="tab in tabs"
                    :key="tab.id"
                    @click="activeTab = tab.id"
                    :class="[
                        'flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-medium transition-all duration-300 cursor-pointer',
                        activeTab === tab.id
                            ? 'bg-primary text-white shadow-md'
                            : 'text-gray-500 hover:text-gray-700'
                    ]"
                >
                    <i :class="['pi', tab.icon, 'text-sm']"></i>
                    {{ tab.label }}
                </button>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 w-full">
                <div
                    v-for="(step, i) in steps[activeTab]"
                    :key="`${activeTab}-${i}`"
                    :role="i === 0 ? 'button' : undefined"
                    :tabindex="i === 0 ? 0 : undefined"
                    :class="[
                        'group relative flex flex-col gap-4 rounded-2xl border border-gray-100 bg-white p-7 transition-all duration-300 hover:shadow-lg hover:border-primary/20 hover:-translate-y-1',
                        i === 0
                            ? 'cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-offset-2'
                            : ''
                    ]"
                    @click="i === 0 ? handleFirstStepClick() : undefined"
                    @keydown.enter.prevent="i === 0 ? handleFirstStepClick() : undefined"
                    @keydown.space.prevent="i === 0 ? handleFirstStepClick() : undefined"
                >
                    <div class="flex items-center justify-between">
                        <div class="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center transition-colors duration-300 group-hover:bg-primary group-hover:text-white">
                            <i :class="['pi', step.icon, 'text-xl']"></i>
                        </div>
                        <span class="text-3xl font-bold text-gray-100 transition-colors duration-300 group-hover:text-primary/20">{{ step.number }}</span>
                    </div>

                    <h3 class="text-base font-semibold text-gray-900">{{ step.title }}</h3>
                    <p class="text-sm text-gray-500 leading-relaxed">{{ step.description }}</p>

                    <div v-if="i < steps[activeTab].length - 1" class="hidden xl:block absolute -right-3 top-1/2 -translate-y-1/2 z-10">
                        <i class="pi pi-chevron-right text-gray-300 text-xs"></i>
                    </div>
                </div>
            </div>

        </div>
    </Content>
</template>
