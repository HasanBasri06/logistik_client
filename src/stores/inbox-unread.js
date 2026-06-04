import { ref } from 'vue'
import { defineStore } from 'pinia'
import api from '@/api'

export const useInboxUnreadStore = defineStore('inboxUnread', () => {
    const hasUnread = ref(false)

    function syncFromCount(count) {
        if (count == null) return
        hasUnread.value = Number(count) > 0
    }

    async function fetchHasUnread() {
        try {
            const res = await api.get('/messages/has-unread')
            hasUnread.value = res.data?.content?.has_unread === true
        } catch {
            hasUnread.value = false
        }
    }

    function applyMessageSent(e, currentUserId) {
        if (currentUserId == null) return
        if (Number(e.receiver_id) === Number(currentUserId) && e.unread_count != null) {
            syncFromCount(e.unread_count)
        }
    }

    return { hasUnread, fetchHasUnread, syncFromCount, applyMessageSent }
})
