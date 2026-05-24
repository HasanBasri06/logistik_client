import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import api from '@/api'
import { router } from '@/router'
import { disconnectEcho } from '@/echo'

export const useAuthStore = defineStore('auth', () => {
    const token = ref(localStorage.getItem('token') || null)
    const user = ref(JSON.parse(localStorage.getItem('user') || 'null'))

    const isAuthenticated = computed(() => !!token.value)

    const setToken = (newToken) => {
        token.value = newToken
        if (newToken) {
            localStorage.setItem('token', newToken)
        } else {
            localStorage.removeItem('token')
        }
        disconnectEcho()
    }

    const setUser = (userData) => {
        user.value = userData
        if (userData) {
            localStorage.setItem('user', JSON.stringify(userData))
        } else {
            localStorage.removeItem('user')
        }
    }

    const login = async (credentials) => {
        try {
            const response = await api.post('/auth/login', credentials)
            if (response.data.content && response.data.content.token) {
                const authToken = response.data.content.token
                const userType = response.data.content.type
                
                setToken(authToken)
                setUser({ type: userType })
                
                // Token'ı axios header'ına ekle
                api.defaults.headers.common['Authorization'] = `Bearer ${authToken}`
                
                return { success: true, data: response.data }
            }
            throw new Error('Token bulunamadı')
        } catch (error) {
            const content = error.response?.data?.content
            if (error.response?.status === 403 && content?.need_otp && content?.email) {
                return {
                    success: false,
                    needOtp: true,
                    email: content.email,
                    error: error.response?.data?.message || error.message,
                    response: error.response
                }
            }
            const errorMessage = error.response?.data?.message || error.message
            const errorDetails = error.response?.data?.error || null
            return {
                success: false,
                error: errorMessage,
                errorDetails: errorDetails,
                response: error.response
            }
        }
    }

    const register = async (userData) => {
        try {
            const response = await api.post('/auth/register', userData)
            const content = response.data?.content ?? response.data
            if (content?.need_otp && content?.email) {
                return {
                    success: true,
                    needOtp: true,
                    email: content.email,
                    data: response.data
                }
            }
            if (content?.token) {
                const authToken = content.token
                setToken(authToken)
                setUser({ type: userData.type })
                api.defaults.headers.common['Authorization'] = `Bearer ${authToken}`
                return { success: true, data: response.data }
            }
            throw new Error('Beklenmeyen yanıt')
        } catch (error) {
            const errorMessage = error.response?.data?.message || error.message
            const errorDetails = error.response?.data?.error || null
            return {
                success: false,
                error: errorMessage,
                errorDetails: errorDetails,
                response: error.response
            }
        }
    }

    const verifyOtp = async (email, code) => {
        try {
            const response = await api.post('/auth/verify-otp', { email, code })
            const content = response.data?.content ?? response.data
            if (content?.token) {
                const authToken = content.token
                setToken(authToken)
                setUser({ type: content.type ?? 'cargo_owner' })
                api.defaults.headers.common['Authorization'] = `Bearer ${authToken}`
                return { success: true, data: response.data }
            }
            throw new Error('Token alınamadı')
        } catch (error) {
            const errorMessage = error.response?.data?.message || error.message
            return {
                success: false,
                error: errorMessage,
                response: error.response
            }
        }
    }

    const resendOtp = async (email) => {
        try {
            const response = await api.post('/auth/resend-otp', { email })
            const content = response.data?.content ?? {}
            return {
                success: true,
                message: content.message || response.data?.message || 'Kod gönderildi.'
            }
        } catch (error) {
            const errorMessage = error.response?.data?.message || error.message
            return { success: false, error: errorMessage }
        }
    }

    /** Giriş/kayıt OTP ekranı: yanlış telefonu günceller, yeni SMS gönderir (token gerekmez). */
    const changePhonePending = async (currentPhone, newPhone) => {
        try {
            const response = await api.post('/auth/change-phone-pending', {
                current_phone: currentPhone,
                new_phone: newPhone,
            })
            const content = response.data?.content ?? response.data
            return {
                success: true,
                phone: content?.phone ?? content?.email,
                data: response.data,
            }
        } catch (error) {
            const body = error.response?.data
            const fieldErr = body?.error?.new_phone?.[0]
            const errorMessage = fieldErr || body?.message || error.message
            return { success: false, error: errorMessage }
        }
    }

    /** Giriş modalını açmak isteyen bileşenler bunu true yapar; Header izleyip modalı açar. */
    const requestShowLoginModal = ref(false)

    /** payment_confirm === 0 ise ilan yayınlama vb. işlemlere izin verilmez; Premium modalı gösterilir. */
    const showPremiumModal = ref(false)
    const canPublishListing = computed(() => {
        const u = user.value
        if (!u) return false
        return u.payment_confirm !== 0 && u.payment_confirm !== false
    })

    const openLoginModal = () => {
        requestShowLoginModal.value = true
    }

    const logout = () => {
        setToken(null)
        setUser(null)
        delete api.defaults.headers.common['Authorization']
        router.push('/')
    }

    const checkToken = async () => {
        if (!token.value) {
            return false
        }

        try {
            const response = await api.get('/auth/check')
            if (response.data.content && response.data.content.user) {
                setUser(response.data.content.user)
                return true
            }
            return false
        } catch (error) {
            // Token geçersiz
            setToken(null)
            setUser(null)
            delete api.defaults.headers.common['Authorization']
            return false
        }
    }

    /**
     * Güncel kullanıcıyı sunucudan alır (profil foto vb.). Ağ/geçici hata durumunda oturumu silmez; yalnızca 401’de temizler.
     */
    const refreshUser = async () => {
        if (!token.value) {
            return false
        }
        try {
            const response = await api.get('/auth/check')
            if (response.data.content && response.data.content.user) {
                setUser(response.data.content.user)
                return true
            }
            return false
        } catch (error) {
            const status = error.response?.status
            if (status === 401) {
                setToken(null)
                setUser(null)
                delete api.defaults.headers.common['Authorization']
            }
            return false
        }
    }

    // Uygulama başladığında token varsa header'a ekle
    if (token.value) {
        api.defaults.headers.common['Authorization'] = `Bearer ${token.value}`
    }

    return {
        token,
        user,
        isAuthenticated,
        showPremiumModal,
        canPublishListing,
        requestShowLoginModal,
        openLoginModal,
        setToken,
        setUser,
        login,
        register,
        verifyOtp,
        resendOtp,
        changePhonePending,
        logout,
        checkToken,
        refreshUser
    }
})
