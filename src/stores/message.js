import { defineStore } from 'pinia'
import api from '@/api'
import { useAuthStore } from '@/stores/auth'
import { normalizeOutboundMessage } from '@/lib/message-limits'
import { formatMessageTime, pickMessageText, filterMessagesForShipmentThread } from '@/lib/message-helpers'

export { formatMessageTime, pickMessageText } from '@/lib/message-helpers'

export function parseRequestMessageDetail(raw) {
    if (!raw || typeof raw !== 'string') return null
    try {
        const parsed = JSON.parse(raw)
        if (parsed && typeof parsed === 'object') return parsed
    } catch (_) {
        /* düz metin */
    }
    return null
}

export const useMessageStore = defineStore('message', () => {
    const authStore = useAuthStore()

    async function createMessage(payload) {
        const { shipment_id, receiver_id, message } = payload
        const sender_id = authStore.user?.id

        const text = normalizeOutboundMessage(message)
        if (!text) {
            return { success: false, error: 'Gönderen, alıcı veya mesaj eksik.' }
        }

        try {
            await api.post('/messages/create', {
                shipment_id: shipment_id ?? null,
                sender_id,
                receiver_id,
                message: text,
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

    async function getBySenderAndReceiver(receiverId, shipmentId = null) {
        const senderId = authStore.user?.id
        if (!senderId || !receiverId) {
            return { success: false, error: 'Gönderen veya alıcı bilgisi eksik.', data: [] }
        }
        try {
            const params = { sender_id: senderId, receiver_id: receiverId }
            if (shipmentId != null && shipmentId !== '') {
                params.shipment_id = shipmentId
            }
            const { data } = await api.get('/messages/conversation', {
                params,
            })
            const content = data?.content ?? data?.data ?? data
            const rawList = Array.isArray(content) ? content : (content?.messages ?? [])
            const list = filterMessagesForShipmentThread(rawList, shipmentId)
            const currentUserId = senderId
            const mapped = Array.isArray(list)
                ? list.map((m) => {
                    const rawType = m.type ?? 'normal'
                    const isSystem = rawType === 'system'
                    const isRequest = rawType === 'request'
                    return {
                        id: m.id,
                        text: pickMessageText(m, currentUserId),
                        time: formatMessageTime(m.created_at),
                        isMe: isSystem || isRequest ? false : Number(m.sender_id) === Number(currentUserId),
                        type: isSystem ? 'system' : isRequest ? 'request' : 'message',
                        shipment_id: m.shipment_id ?? null,
                        created_at: m.created_at,
                        shipment: m.shipment ?? null,
                    }
                })
                : []
            const conversationShipmentId =
                content?.conversation_shipment_id ??
                (shipmentId != null && shipmentId !== '' ? Number(shipmentId) : null) ??
                list.find((m) => m.shipment_id != null)?.shipment_id ??
                null
            const conversationShipment =
                content?.conversation_shipment ??
                list.find((m) => m.shipment)?.shipment ??
                null
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
