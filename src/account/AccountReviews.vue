<template>
    <div class="flex flex-col h-full overflow-y-auto">
        <h2 class="text-2xl font-semibold text-gray-900 mb-6">Değerlendirmelerim</h2>
        
        <div class="flex flex-col gap-4">
            <div 
                v-for="review in reviews" 
                :key="review.id"
                class="bg-white border border-gray-200 rounded-lg p-5 hover:shadow-md transition-shadow"
            >
                <div class="flex items-start justify-between mb-3">
                    <div class="flex items-center gap-3">
                        <div class="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center">
                            <i class="pi pi-user text-gray-500" style="font-size: 20px;"></i>
                        </div>
                        <div>
                            <h3 class="text-base font-semibold text-gray-900">{{ review.userName }}</h3>
                            <p class="text-xs text-gray-500">{{ review.date }}</p>
                        </div>
                    </div>
                    <div class="flex items-center gap-1">
                        <i 
                            v-for="star in 5" 
                            :key="star"
                            :class="[
                                'pi',
                                star <= review.rating ? 'pi-star-fill' : 'pi-star',
                                star <= review.rating ? 'text-yellow-400' : 'text-gray-300'
                            ]"
                            style="font-size: 16px;"
                        ></i>
                    </div>
                </div>
                <p class="text-sm text-gray-700 leading-relaxed">{{ review.comment }}</p>
                <div class="mt-3 pt-3 border-t border-gray-100">
                    <p class="text-xs text-gray-500">
                        <span class="font-medium">İlan:</span> {{ review.postTitle }}
                    </p>
                </div>
            </div>
            
            <div v-if="reviews.length === 0" class="text-center py-12 text-gray-500">
                <i class="pi pi-star text-4xl mb-3 text-gray-300"></i>
                <p>Henüz değerlendirme bulunmamaktadır.</p>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue';

const reviews = ref([
    {
        id: 1,
        userName: 'Ahmet Yılmaz',
        rating: 5,
        comment: 'Çok profesyonel ve güvenilir bir hizmet. Yükümü zamanında ve güvenli bir şekilde teslim etti. Kesinlikle tekrar çalışırım.',
        date: '2 gün önce',
        postTitle: 'Ankara - İstanbul Taşımacılık'
    },
    {
        id: 2,
        userName: 'Mehmet Demir',
        rating: 4,
        comment: 'İyi bir hizmet aldım. İletişim kurabilir ve sorunları çözebilir. Küçük bir gecikme oldu ama genel olarak memnunum.',
        date: '1 hafta önce',
        postTitle: 'İzmir - Bursa Kargo Taşımacılığı'
    },
    {
        id: 3,
        userName: 'Fatma Şahin',
        rating: 5,
        comment: 'Mükemmel bir deneyim! Çok dikkatli ve özenli. Yükümü hiç zarar görmeden teslim etti. Teşekkürler.',
        date: '2 hafta önce',
        postTitle: 'Antalya - Ankara Eşya Taşımacılığı'
    }
]);
</script>
