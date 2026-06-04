import { computed, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useInboxUnreadStore } from '@/stores/inbox-unread'
import { usePusherMessages } from '@/composables/usePusherMessages'

/** Header / sidebar rozet — Pusher ile anlık senkron (Expo `UnreadInboxProvider`) */
export function useGlobalInboxUnread() {
    const authStore = useAuthStore()
    const inboxUnread = useInboxUnreadStore()
    const userIdRef = computed(() => authStore.user?.id)

    usePusherMessages(userIdRef, {
        onMessageSent(e) {
            inboxUnread.applyMessageSent(e, authStore.user?.id)
        },
        onInboxUnreadUpdated(e) {
            inboxUnread.syncFromCount(e?.unread_count)
        },
    })

    onMounted(() => {
        if (authStore.user?.id) void inboxUnread.fetchHasUnread()
    })

    return inboxUnread
}
