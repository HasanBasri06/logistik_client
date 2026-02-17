import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import api from '@/api'
import { router } from '@/router'

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
            if (response.data.content && response.data.content.token) {
                const authToken = response.data.content.token
                
                setToken(authToken)
                setUser({ type: userData.type })
                
                // Token'ı axios header'ına ekle
                api.defaults.headers.common['Authorization'] = `Bearer ${authToken}`
                
                return { success: true, data: response.data }
            }
            throw new Error('Token bulunamadı')
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

    // Uygulama başladığında token varsa header'a ekle
    if (token.value) {
        api.defaults.headers.common['Authorization'] = `Bearer ${token.value}`
    }

    return {
        token,
        user,
        isAuthenticated,
        setToken,
        setUser,
        login,
        register,
        logout,
        checkToken
    }
})
