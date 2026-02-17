<template>
    <div class="flex flex-row gap-4 h-full">
        <!-- Sol: Mesaj Listesi (Mesaj seçilmediğinde görünür) -->
        <div v-if="!route.params.id" class="w-full flex flex-col overflow-y-auto">
            <h2 class="text-2xl font-semibold text-gray-900 mb-6">Yük Sahibi Mesajları</h2>
            
            <div class="flex flex-col gap-4">
                <div 
                    v-for="message in messages" 
                    :key="message.id"
                    :class="[
                        'message-card',
                        !message.isRead ? 'message-card-unread' : ''
                    ]"
                    @click="openMessageDetail(message)"
                >
                    <div class="message-content">
                        <div class="message-user">
                            <div class="message-avatar">
                                <img src="@/assets/images/person.png" :alt="message.name" />
                            </div>
                            <div class="message-user-info">
                                <h3 class="message-name">{{ message.name }}</h3>
                                <p class="message-time">{{ message.time }}</p>
                            </div>
                        </div>
                        <div class="message-text">
                            <p>{{ message.lastMessage }}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        
        <!-- Mesaj Detayı ve Yazma Alanı (Mesaj seçildiğinde tam ekran) -->
        <div v-if="route.params.id && selectedMessage" class="w-full flex flex-col">
            <!-- Üst: Geri Butonu ve Mesaj Gönderen Bilgisi -->
            <div class="flex items-center gap-4 px-4 py-3 border-b border-gray-200 shrink-0">
                <button
                    type="button"
                    @click="goBackToMessages"
                    class="flex items-center justify-center w-10 h-10 rounded-full hover:bg-gray-100 transition-colors"
                    title="Geri"
                >
                    <i class="pi pi-arrow-left text-gray-700" style="font-size: 18px;"></i>
                </button>
                <div class="message-detail-avatar">
                    <img src="@/assets/images/person.png" :alt="selectedMessage?.name" />
                </div>
                <div class="flex-1">
                    <h3 class="text-lg font-semibold text-gray-900">{{ selectedMessage?.name }}</h3>
                    <p class="text-sm text-gray-500">{{ selectedMessage?.time }}</p>
                </div>
            </div>

            <!-- Orta: Mesajlar (Scrollable) -->
            <div class="flex-1 overflow-y-auto px-4 py-4 bg-gray-50 message-thread-container">
                <div class="flex flex-col gap-4">
                    <div 
                        v-for="(msg, index) in messageThread" 
                        :key="index"
                        :class="[
                            'message-bubble',
                            msg.isMe ? 'message-bubble-me' : 'message-bubble-other'
                        ]"
                    >
                        <p>{{ msg.text }}</p>
                        <span class="message-time-text">{{ msg.time }}</span>
                    </div>
                </div>
            </div>

            <!-- Alt: Mesaj Inputu -->
            <div class="px-4 py-3 border-t border-gray-200 shrink-0 bg-white">
                <form @submit.prevent="sendMessage" class="flex gap-3">
                    <input
                        type="text"
                        v-model="newMessageText"
                        class="flex-1 input"
                        placeholder="Mesajınızı yazın..."
                    />
                    <button
                        type="submit"
                        class="px-6 py-3 bg-primary text-white font-semibold rounded-lg hover:bg-primary/90 transition-colors"
                    >
                        Gönder
                    </button>
                </form>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const route = useRoute();
const router = useRouter();

const messages = ref([
    {
        id: 1,
        name: 'Ahmet Yılmaz',
        avatar: '../assets/images/person.png',
        time: '2 saat önce',
        lastMessage: 'Merhaba, yükünüz için teklif hazırladım. Detayları görüşebilir miyiz?',
        isRead: true
    },
    {
        id: 2,
        name: 'Mehmet Demir',
        avatar: '../assets/images/person.png',
        time: '5 saat önce',
        lastMessage: 'Ankara\'dan İstanbul\'a taşımacılık için uygunum. Fiyat teklifi gönderebilirim.',
        isRead: false
    },
    {
        id: 3,
        name: 'Ali Kaya',
        avatar: '../assets/images/person.png',
        time: '1 gün önce',
        lastMessage: 'Yükünüz için uygun araçlarım var. İletişime geçebilir miyiz?',
        isRead: false
    },
    {
        id: 4,
        name: 'Fatma Şahin',
        avatar: '../assets/images/person.png',
        time: '2 gün önce',
        lastMessage: 'Taşımacılık konusunda deneyimliyim. Size yardımcı olabilirim.',
        isRead: true
    }
]);

const selectedMessage = ref(null);
const newMessageText = ref('');
const messageThread = ref([]);

const openMessageDetail = (message) => {
    router.push(`/vehicle-owner/messages/${message.id}`);
};

const goBackToMessages = () => {
    router.push('/vehicle-owner/messages');
};

const loadMessageDetail = (messageId) => {
    const message = messages.value.find(m => m.id === messageId);
    if (message) {
        selectedMessage.value = message;
        messageThread.value = [
            {
                text: message.lastMessage,
                time: message.time,
                isMe: false
            },
            {
                text: 'Teşekkür ederim, detayları paylaşabilir misiniz?',
                time: '1 saat önce',
                isMe: true
            },
            {
                text: 'Tabii ki, yükünüzün ağırlığı ve boyutları nedir?',
                time: '30 dakika önce',
                isMe: false
            }
        ];
    }
};

const sendMessage = () => {
    if (!newMessageText.value.trim()) return;
    
    messageThread.value.push({
        text: newMessageText.value,
        time: 'Şimdi',
        isMe: true
    });
    
    newMessageText.value = '';
    
    setTimeout(() => {
        const messageContainer = document.querySelector('.message-thread-container');
        if (messageContainer) {
            messageContainer.scrollTop = messageContainer.scrollHeight;
        }
    }, 100);
};

watch(
    () => [route.params.id, route.path],
    ([messageId, path]) => {
        if (path.includes('/messages') && messageId) {
            loadMessageDetail(parseInt(messageId));
        } else if (path === '/vehicle-owner/messages') {
            selectedMessage.value = null;
            messageThread.value = [];
            newMessageText.value = '';
        }
    },
    { immediate: true }
);

onMounted(() => {
    if (route.path.includes('/messages') && route.params.id) {
        loadMessageDetail(parseInt(route.params.id));
    }
});
</script>

<style scoped>
.message-card {
    width: 100%;
    min-height: 100px;
    border-radius: 1rem;
    background-color: white;
    border: 1px solid rgb(229 231 235);
    overflow: hidden;
    cursor: pointer;
    transition: all 0.3s ease;
    box-shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1);
}

.message-card:hover {
    border-color: #39838C;
    box-shadow: 0 4px 12px 0 rgba(57, 131, 140, 0.15);
    transform: translateY(-2px);
}

.message-card-unread {
    background-color: rgb(249 250 251);
    opacity: 0.85;
}

.message-card-unread .message-name {
    color: rgb(107 114 128);
}

.message-card-unread .message-time {
    color: rgb(156 163 175);
}

.message-card-unread .message-text p {
    color: rgb(107 114 128);
}

.message-content {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem 1.5rem;
    gap: 1.5rem;
}

.message-user {
    display: flex;
    align-items: center;
    gap: 1rem;
    flex-shrink: 0;
}

.message-avatar {
    width: 3.5rem;
    height: 3.5rem;
    border-radius: 9999px;
    border: 1.5px solid #39838C;
    overflow: hidden;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: white;
    flex-shrink: 0;
}

.message-avatar img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.message-user-info {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
}

.message-name {
    font-size: 1rem;
    font-weight: 600;
    color: rgb(17 24 39);
    line-height: 1.2;
}

.message-time {
    font-size: 0.75rem;
    color: rgb(107 114 128);
}

.message-text {
    flex: 1;
    text-align: right;
}

.message-text p {
    font-size: 0.875rem;
    color: rgb(55 65 81);
    line-height: 1.5;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
}

.message-detail-avatar {
    width: 3.5rem;
    height: 3.5rem;
    border-radius: 9999px;
    border: 1.5px solid #39838C;
    overflow: hidden;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: white;
    flex-shrink: 0;
}

.message-detail-avatar img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.message-bubble {
    max-width: 70%;
    padding: 0.75rem 1rem;
    border-radius: 1rem;
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
}

.message-bubble-me {
    background-color: #39838C;
    color: white;
    align-self: flex-end;
    border-bottom-right-radius: 0.25rem;
}

.message-bubble-other {
    background-color: white;
    color: rgb(55 65 81);
    align-self: flex-start;
    border-bottom-left-radius: 0.25rem;
    border: 1px solid rgb(229 231 235);
}

.message-bubble p {
    font-size: 0.875rem;
    line-height: 1.5;
    margin: 0;
}

.message-time-text {
    font-size: 0.75rem;
    opacity: 0.7;
    align-self: flex-end;
}
</style>
