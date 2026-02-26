import { defineStore } from 'pinia'
import api from '@/api'
import { useAuthStore } from '@/stores/auth'

export function formatMessageTime(createdAt) {
    if (!createdAt) return '—'
    const d = new Date(createdAt)
    const day = String(d.getDate()).padStart(2, '0')
    const month = String(d.getMonth() + 1).padStart(2, '0')
    const year = d.getFullYear()
    const hours = String(d.getHours()).padStart(2, '0')
    const minutes = String(d.getMinutes()).padStart(2, '0')
    return `${day}.${month}.${year} ${hours}:${minutes}`
}

export const useMessageStore = defineStore('message', () => {
    const authStore = useAuthStore()

    async function createMessage(payload) {
        const { shipment_id, receiver_id, message } = payload
        const sender_id = authStore.user?.id

        if (!sender_id || !receiver_id || !message?.trim()) {
            return { success: false, error: 'Gönderen, alıcı veya mesaj eksik.' }
        }

        try {
            await api.post('/messages/create', {
                shipment_id: shipment_id ?? null,
                sender_id,
                receiver_id,
                message: message.trim(),
            })
            return { success: true }
        } catch (err) {
            const msg = err?.response?.data?.message || err?.message || 'Mesaj gönderilemedi.'
            return { success: false, error: msg }
        }
    }

    async function getByUserId(userId) {
        if (!userId) return { success: false, error: 'user_id gerekli.', data: [] }
        try {
            const { data } = await api.get('/messages/by-user', {
                params: { user_id: userId },
            })
            const list = data?.content ?? data?.data ?? data ?? []            
            return { success: true, data: Array.isArray(list) ? list : [] }
        } catch (err) {
            const msg = err?.response?.data?.message || err?.message || 'Mesajlar yüklenemedi.'
            return { success: false, error: msg, data: [] }
        }
    }

    async function getBySenderAndReceiver(receiverId) {
        const senderId = authStore.user?.id
        if (!senderId || !receiverId) {
            return { success: false, error: 'Gönderen veya alıcı bilgisi eksik.', data: [] }
        }
        try {
            const { data } = await api.get('/messages/conversation', {
                params: { sender_id: senderId, receiver_id: receiverId },
            })
            const list = data?.content ?? data?.data ?? data ?? []
            const currentUserId = senderId
            const mapped = Array.isArray(list)
                ? list.map((m) => ({
                    id: m.id,
                    text: m.message ?? m.text ?? '',
                    time: formatMessageTime(m.created_at),
                    isMe: Number(m.sender_id) === Number(currentUserId),
                    type: 'message',
                    created_at: m.created_at,
                }))
                : []
            const firstWithShipment = Array.isArray(list) ? list.find((m) => m.shipment_id != null) : null
            const conversationShipmentId = firstWithShipment?.shipment_id ?? null
            const conversationShipment = firstWithShipment?.shipment ?? null
            return {
                success: true,
                data: mapped,
                conversationShipmentId,
                conversationShipment,
            }
        } catch (err) {
            const msg = err?.response?.data?.message || err?.message || 'Mesajlar yüklenemedi.'
            return { success: false, error: msg, data: [] }
        }
    }

    async function markAsRead(messageIds) {
        if (!messageIds?.length) return { success: true }
        try {
            await api.put('/messages/mark-read', { message_ids: messageIds })
            return { success: true }
        } catch (err) {
            return { success: false, error: err?.response?.data?.message || err?.message }
        }
    }

    return { createMessage, getBySenderAndReceiver, getByUserId, markAsRead }
})
