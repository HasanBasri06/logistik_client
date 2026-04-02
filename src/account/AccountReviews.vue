<template>
    <div class="flex flex-col h-full overflow-y-auto">
        <h2 class="text-2xl font-semibold text-gray-900 mb-6">Değerlendirmelerim</h2>

        <template v-if="loading">
            <div class="flex flex-col items-center justify-center py-12">
                <span class="w-8 h-8 border-4 border-gray-300 border-t-primary rounded-full animate-spin block mb-4" />
                <p class="text-gray-500">Değerlendirmeler yükleniyor...</p>
            </div>
        </template>
        <template v-else>
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
                            />
                        </div>
                    </div>
                    <p class="text-sm text-gray-700 leading-relaxed">{{ review.comment }}</p>
                    <div v-if="review.postTitle" class="mt-3 pt-3 border-t border-gray-100">
                        <p class="text-xs text-gray-500">
                            <span class="font-medium">İlan:</span> {{ review.postTitle }}
                        </p>
                    </div>
                </div>

                <div v-if="reviews.length === 0" class="text-center py-12 text-gray-500">
                    <i class="pi pi-star text-4xl mb-3 text-gray-300" />
                    <p>Henüz değerlendirme bulunmamaktadır.</p>
                </div>
            </div>
        </template>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import api from '@/api';

const loading = ref(true);
const reviews = ref([]);

function formatDate(dateStr) {
    if (!dateStr) return '—';
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now - date;
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    if (diffDays === 0) return 'Bugün';
    if (diffDays === 1) return 'Dün';
    if (diffDays < 7) return `${diffDays} gün önce`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} hafta önce`;
    if (diffDays < 365) return `${Math.floor(diffDays / 30)} ay önce`;
    return `${Math.floor(diffDays / 365)} yıl önce`;
}

async function fetchReviews() {
    try {
        loading.value = true;
        const response = await api.get('/comments');
        const { content } = response.data;
        const list = content?.comments ?? [];
        reviews.value = list.map((c) => ({
            id: c.id,
            userName:
                c.commenter_name?.trim() ||
                c.sender?.full_name ||
                [c.sender?.first_name, c.sender?.last_name].filter(Boolean).join(' ') ||
                c.creator?.full_name ||
                [c.creator?.first_name, c.creator?.last_name].filter(Boolean).join(' ') ||
                'Kullanıcı',
            rating: Number(c.score) || 0,
            comment: c.comment ?? '',
            date: formatDate(c.created_at),
            postTitle: c.shipment_title ?? c.post_title ?? null,
        }));
    } catch (err) {
        console.error('Değerlendirmeler yüklenemedi:', err);
        reviews.value = [];
    } finally {
        loading.value = false;
    }
}

onMounted(() => {
    fetchReviews();
});
</script>
