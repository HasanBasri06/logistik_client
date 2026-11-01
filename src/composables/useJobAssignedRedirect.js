import { onBeforeUnmount, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { toast } from 'vue-sonner'
import { getEcho } from '@/echo'
import { useAuthStore } from '@/stores/auth'

/** Panel zaten açıksa aktif iş ekranına geçmesi için yayınlanan pencere olayı (`panel/Home.vue` dinler) */
export const ACTIVE_JOB_ASSIGNED_EVENT = 'active-job-assigned'

const PUSHER_EVENT = 'offer.accepted'

/**
 * Araç sahibi: yük sahibi "Hemen Al" / arama ile işi ona verdiğinde (`offer.accepted`, `user.{id}` kanalı)
 * hangi sayfada olursa olsun panele yönlendirilir; panel aktif iş ekranını gösterir.
 *
 * Dinleyici kanal yerine Pusher bağlantısına bağlanır: sayfalardaki `usePusherMessages` ayrılırken
 * `stopListening('.offer.accepted')` ile kanal dinleyicilerinin tümünü sildiği için bu dinleyiciyi silemez.
 */
export function useJobAssignedRedirect() {
    const authStore = useAuthStore()
    const router = useRouter()
    const route = useRoute()

    let pusher = null

    function onOfferAccepted(payload) {
        const myId = Number(authStore.user?.id)
        if (!myId || Number(payload?.buyer_user_id) !== myId) return

        toast.success('İş sana verildi!', { description: 'Aktif işin panelde açılıyor.', duration: 6000 })
        if (route.path === '/panel') {
            window.dispatchEvent(new CustomEvent(ACTIVE_JOB_ASSIGNED_EVENT, { detail: payload }))
        } else {
            router.push('/panel')
        }
    }

    function stop() {
        if (pusher) {
            pusher.unbind(PUSHER_EVENT, onOfferAccepted)
            pusher = null
        }
    }

    function start(userId) {
        stop()
        const echo = getEcho()
        if (!echo) return
        // Özel kanala abone ol (zaten aboneyse aynı kanal döner); olaylar bağlantı düzeyinde de yayılır
        echo.private(`user.${userId}`)
        pusher = echo.connector?.pusher ?? null
        pusher?.bind(PUSHER_EVENT, onOfferAccepted)
    }

    watch(
        () => [authStore.user?.id, authStore.user?.type],
        ([id, type]) => {
            if (id && type === 'vehicle_owner') start(id)
            else stop()
        },
        { immediate: true }
    )

    onBeforeUnmount(stop)
}
