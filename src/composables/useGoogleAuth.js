import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { toast } from 'vue-sonner'
import { useAuthStore } from '@/stores/auth'
import { phoneDigits, redirectAfterLogin } from '@/lib/auth-ui'

/** Kayıt tamamlama sayfasına geçerken ID token'ı URL'de taşımamak için bellekte tutulur */
let pendingGoogleRegistration = null

export function getPendingGoogleRegistration() {
    return pendingGoogleRegistration
}

export function clearPendingGoogleRegistration() {
    pendingGoogleRegistration = null
}

/**
 * Google butonundan gelen ID token'ı işler (mobil `useGoogleSignIn` ile aynı akış):
 * giriş → panel, ilk kez → `/kayit-tamamla`, doğrulanmamış hesap → `/telefon-dogrula`.
 */
export function useGoogleAuth({ onInactive } = {}) {
    const router = useRouter()
    const authStore = useAuthStore()
    const googleLoading = ref(false)

    async function handleGoogleCredential(idToken) {
        if (googleLoading.value || !idToken) return
        googleLoading.value = true
        try {
            const result = await authStore.googleLogin(idToken)
            if (result.success) {
                toast.success('Giriş başarılı!')
                redirectAfterLogin(router)
                return
            }
            if (result.needRegistration) {
                pendingGoogleRegistration = { idToken, profile: result.profile }
                router.push('/kayit-tamamla')
                return
            }
            if (result.needOtp) {
                toast.info(result.error || 'Telefon doğrulaması gerekli.')
                router.push({ path: '/telefon-dogrula', query: { phone: phoneDigits(result.email), from: 'login' } })
                return
            }
            if (result.accountInactive && onInactive) {
                onInactive(result.error)
                return
            }
            toast.error(result.error || 'Google ile giriş başarısız.')
        } finally {
            googleLoading.value = false
        }
    }

    return { googleLoading, handleGoogleCredential }
}
