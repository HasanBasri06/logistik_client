<template>
    <div class="flex flex-col h-full overflow-y-auto">
        <div class="flex items-center justify-between mb-6">
            <h2 class="text-2xl font-semibold text-gray-900">Kayıtlı Kartlarım</h2>
            <button
                @click="openAddCardModal"
                class="px-4 py-2 bg-primary text-white font-semibold rounded-lg hover:bg-primary/90 transition-colors flex items-center gap-2"
            >
                <i class="pi pi-plus" style="font-size: 14px;"></i>
                Yeni Kart Ekle
            </button>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div 
                v-for="card in savedCards" 
                :key="card.id"
                class="relative bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-6 text-white shadow-lg hover:shadow-xl transition-shadow"
            >
                <div class="flex items-center justify-between mb-6">
                    <div class="text-sm text-gray-300">Kart Numarası</div>
                    <button
                        @click="deleteCard(card.id)"
                        class="text-red-400 hover:text-red-300 transition-colors"
                    >
                        <i class="pi pi-trash" style="font-size: 16px;"></i>
                    </button>
                </div>
                <div class="text-2xl font-mono mb-6 tracking-wider">
                    **** **** **** {{ card.lastFourDigits }}
                </div>
                <div class="flex items-center justify-between">
                    <div>
                        <div class="text-xs text-gray-400 mb-1">Kart Sahibi</div>
                        <div class="text-sm font-medium">{{ card.cardHolder }}</div>
                    </div>
                    <div>
                        <div class="text-xs text-gray-400 mb-1">Son Kullanma</div>
                        <div class="text-sm font-medium">{{ card.expiryDate }}</div>
                    </div>
                </div>
                <div class="absolute top-6 right-6">
                    <i 
                        :class="[
                            'pi',
                            card.type === 'visa' ? 'pi-credit-card' : 'pi-credit-card',
                            'text-white/30'
                        ]"
                        style="font-size: 32px;"
                    ></i>
                </div>
            </div>
            
            <div v-if="savedCards.length === 0" class="col-span-2 text-center py-12 text-gray-500">
                <i class="pi pi-credit-card text-4xl mb-3 text-gray-300"></i>
                <p class="mb-4">Henüz kayıtlı kartınız bulunmamaktadır.</p>
                <button
                    @click="openAddCardModal"
                    class="px-6 py-3 bg-primary text-white font-semibold rounded-lg hover:bg-primary/90 transition-colors"
                >
                    İlk Kartınızı Ekleyin
                </button>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue';

const savedCards = ref([
    {
        id: 1,
        lastFourDigits: '1234',
        cardHolder: 'HASAN KILIÇ',
        expiryDate: '12/25',
        type: 'visa'
    },
    {
        id: 2,
        lastFourDigits: '5678',
        cardHolder: 'HASAN KILIÇ',
        expiryDate: '06/26',
        type: 'mastercard'
    }
]);

const openAddCardModal = () => {
    console.log('Yeni kart ekleme modalı açıldı');
    alert('Yeni kart ekleme formu yakında eklenecek.');
};

const deleteCard = (cardId) => {
    if (confirm('Bu kartı silmek istediğinizden emin misiniz?')) {
        savedCards.value = savedCards.value.filter(card => card.id !== cardId);
        console.log('Kart silindi:', cardId);
    }
};
</script>
