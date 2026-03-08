<template>
    <div class="flex flex-col h-full overflow-y-auto">
        <div class="flex items-center justify-between mb-6">
            <h2 class="text-2xl font-semibold text-gray-900">Kayıtlı Kartlarım</h2>
            <button
                @click="showAddCardModal = true"
                class="px-4 py-2 bg-primary text-white font-semibold rounded-lg hover:bg-primary/90 transition-colors flex items-center gap-2"
            >
                <i class="pi pi-plus" style="font-size: 14px;"></i>
                Yeni Kart Ekle
            </button>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <template v-if="loadCard">
                <div class="col-span-2 flex flex-col items-center justify-center py-20">
                    <div class="flex items-center mb-4">
                        <span class="w-8 h-8 border-4 border-gray-300 border-t-primary rounded-full animate-spin"></span>
                    </div>
                    <div class="text-gray-400 text-lg text-center">Kartlarınız yükleniyor...</div>
                </div>
            </template>
            <template v-else>
                <div
                    v-for="card in savedCards"
                    :key="card.id"
                    class="card-item group relative overflow-hidden rounded-2xl min-h-[200px] flex flex-col justify-between p-6 text-white shadow-xl hover:shadow-2xl hover:-translate-y-0.5 transition-all duration-300"
                    :class="cardBrandClass(card)"
                >
                    <!-- Dekoratif ışık / gradient overlay -->
                    <div class="absolute inset-0 opacity-40 pointer-events-none" aria-hidden="true">
                        <div class="absolute -top-12 -right-12 w-32 h-32 rounded-full bg-white/20 blur-2xl" />
                        <div class="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-black/10 to-transparent" />
                    </div>

                    <!-- Chip görünümü -->
                    <div class="relative flex items-center justify-between">
                        <div class="w-10 h-8 rounded-md bg-gradient-to-br from-amber-400/90 to-amber-600/90 flex items-center justify-center shadow-inner border border-amber-300/30">
                            <div class="w-full h-full rounded-sm border border-amber-200/40 m-1 flex flex-wrap content-center justify-center gap-px">
                                <span v-for="i in 20" :key="i" class="w-1 h-1 rounded-sm bg-amber-900/40" />
                            </div>
                        </div>
                        <button
                            type="button"
                            :disabled="deleteCardLoading === card.id"
                            class="relative p-2 rounded-lg text-white/60 hover:text-white hover:bg-white/10 transition-all opacity-0 group-hover:opacity-100 focus:opacity-100 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
                            aria-label="Kartı sil"
                            @click="deleteCard(card.id)"
                        >
                            <i v-if="deleteCardLoading === card.id" class="pi pi-spin pi-spinner text-sm" />
                            <i v-else class="pi pi-trash text-sm" />
                        </button>
                    </div>

                    <!-- Kart numarası -->
                    <div class="relative mt-4">
                        <p class="text-[10px] uppercase tracking-[0.2em] text-white/60 mb-1.5">Kart Numarası</p>
                        <p class="text-xl md:text-2xl font-mono tracking-[0.25em] font-medium tabular-nums">
                            •••• •••• •••• {{ card.last_four }}
                        </p>
                    </div>

                    <!-- Alt bilgi satırı -->
                    <div class="relative flex items-end justify-between gap-3 mt-6">
                        <div class="min-w-0">
                            <p class="text-[10px] uppercase tracking-widest text-white/60 mb-0.5">Kart Sahibi</p>
                            <p class="text-sm font-semibold uppercase tracking-wide truncate">{{ card.card_holder_name }}</p>
                        </div>
                        <div class="text-right shrink-0">
                            <p class="text-[10px] uppercase tracking-widest text-white/60 mb-0.5">Son Kullanma</p>
                            <p class="text-sm font-semibold tabular-nums">{{ card.exp_month }}/{{ String(card.exp_year).slice(-2) }}</p>
                        </div>
                        <div v-if="card.brand" class="shrink-0 self-end text-[10px] font-bold uppercase tracking-wider text-white/50">
                            {{ card.brand }}
                        </div>
                        <div class="flex items-center justify-center w-10 h-7 rounded bg-white/10 backdrop-blur-sm shrink-0">
                            <i class="pi pi-credit-card text-white/80 text-base" aria-hidden="true" />
                        </div>
                    </div>
                </div>
                
                <div v-if="savedCards.length === 0" class="col-span-2 text-center py-12 text-gray-500">
                    <i class="pi pi-credit-card text-4xl mb-3 text-gray-300"></i>
                    <p class="mb-4">Henüz kayıtlı kartınız bulunmamaktadır.</p>
                    <button
                        @click="showAddCardModal = true"
                        class="px-6 py-3 bg-primary text-white font-semibold rounded-lg hover:bg-primary/90 transition-colors"
                    >
                        İlk Kartınızı Ekleyin
                    </button>
                </div>
            </template>
        </div>

        <AddCardModal
            v-if="showAddCardModal"
            @close="showAddCardModal = false"
            @success="getCards"
        />
    </div>
</template>

<script setup>
import api from '@/api';
import { onMounted, ref } from 'vue';
import AddCardModal from '@/components/AddCardModal.vue';

const loadCard = ref(false);
const showAddCardModal = ref(false);
const savedCards = ref([]);

function cardBrandClass(card) {
    const brand = (card.brand || '').toLowerCase();
    if (brand === 'visa') return 'bg-gradient-to-br from-[#1a1f71] via-[#2d3482] to-[#0d1140]';
    if (brand === 'mastercard') return 'bg-gradient-to-br from-[#2d2d2d] via-[#1a1a1a] to-[#0d0d0d]';
    return 'bg-gradient-to-br from-slate-700 via-slate-800 to-slate-900';
}

const deleteCardLoading = ref(null);

const deleteCard = async (cardId) => {
    if (!confirm('Bu kartı silmek istediğinizden emin misiniz?')) return;
    deleteCardLoading.value = cardId;
    try {
        const response = await api.delete(`/cards/${cardId}`);
        const { content } = response.data;
        if (content?.cards) {
            savedCards.value = content.cards;
        } else {
            await getCards();
        }
    } catch (err) {
        console.error('Kart silinirken hata:', err);
        alert(err?.response?.data?.message ?? 'Kart silinirken bir hata oluştu.');
    } finally {
        deleteCardLoading.value = null;
    }
};

const getCards = async () => {
    try {
        loadCard.value = true;
        const response = await api.get('/cards');
        const {content} = await response.data;
        savedCards.value = content.cards;
    } catch (err) {
        console.log(err);
    } finally {
        loadCard.value = false;
    }
}

onMounted(() => {
    getCards();
});
</script>
