import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import api from '@/api'

const ADMIN_TOKEN_KEY = 'admin_token'

export const useAdminStore = defineStore('admin', () => {
    const token = ref(localStorage.getItem(ADMIN_TOKEN_KEY) || null)
    const admin = ref(null)

    const isAuthenticated = computed(() => !!token.value)

    const syncTokenFromStorage = () => {
        const storedToken = localStorage.getItem(ADMIN_TOKEN_KEY)
        token.value = storedToken
        return storedToken
    }

    const setToken = (newToken) => {
        token.value = newToken
        if (newToken) {
            localStorage.setItem(ADMIN_TOKEN_KEY, newToken)
        } else {
            localStorage.removeItem(ADMIN_TOKEN_KEY)
            admin.value = null
        }
    }

    const login = async ({ email, password }) => {
        try {
            const response = await api.post('/admin/login', { email, password })
            const authToken = response.data?.content?.token

            if (!authToken) {
                throw new Error('Token bulunamadı')
            }

            setToken(authToken)
            return { success: true, data: response.data }
        } catch (error) {
            const errorMessage = error.response?.data?.message || error.message
            const errorDetails = error.response?.data?.errors || error.response?.data?.error || null
            return {
                success: false,
                error: errorMessage,
                errorDetails,
                response: error.response,
            }
        }
    }

    const checkToken = async () => {
        const storedToken = syncTokenFromStorage()
        if (!storedToken) {
            return false
        }

        try {
            const response = await api.get('/admin/check')
            const adminData = response.data?.content?.admin

            if (!adminData) {
                admin.value = null
                return false
            }

            admin.value = adminData
            return true
        } catch {
            admin.value = null
            return false
        }
    }

    const fetchDashboard = async () => {
        try {
            const response = await api.get('/admin/dashboard')
            const content = response.data?.content ?? {}
            return {
                success: true,
                todayUsers: content.today_users ?? [],
                todayUsersCount: content.today_users_count ?? 0,
                totalUsers: content.total_users ?? 0,
                totalShipments: content.total_shipments ?? 0,
                totalCallRequests: content.total_call_requests ?? 0,
                recentShipments: content.recent_shipments ?? [],
                todayRequests: content.today_requests ?? [],
                todayRequestsCount: content.today_requests_count ?? 0,
            }
        } catch (error) {
            return {
                success: false,
                error: error.response?.data?.message || error.message,
            }
        }
    }

    const logout = () => {
        setToken(null)
    }

    const createShipment = async (payload) => {
        try {
            const response = await api.post('/admin/shipments', payload)
            return { success: true, data: response.data }
        } catch (error) {
            const errorMessage = error.response?.data?.message || error.message
            const errorDetails = error.response?.data?.errors || error.response?.data?.error || null
            return {
                success: false,
                error: errorMessage,
                errorDetails,
                response: error.response,
            }
        }
    }

    const fetchAllShipments = async ({ search = '', page = 1, perPage = 15 } = {}) => {
        try {
            const response = await api.get('/admin/shipments', {
                params: {
                    ...(search ? { search } : {}),
                    page,
                    per_page: perPage,
                },
            })
            const content = response.data?.content ?? {}
            const shipments = content.shipments ?? []
            return {
                success: true,
                shipments,
                currentPage: content.current_page ?? page,
                lastPage: content.last_page ?? 1,
                perPage: content.per_page ?? perPage,
                total: content.total ?? shipments.length,
            }
        } catch (error) {
            return {
                success: false,
                shipments: [],
                currentPage: 1,
                lastPage: 1,
                perPage,
                total: 0,
                error: error.response?.data?.message || error.message,
            }
        }
    }

    const deleteShipment = async (shipmentId) => {
        try {
            const response = await api.delete(`/admin/shipments/${shipmentId}`)
            return { success: true, data: response.data }
        } catch (error) {
            return {
                success: false,
                error: error.response?.data?.message || error.message,
            }
        }
    }

    const searchUsers = async (search = '') => {
        try {
            const response = await api.get('/admin/users', {
                params: search ? { search } : {},
            })
            const users = response.data?.content?.users ?? []
            return { success: true, users }
        } catch (error) {
            return {
                success: false,
                users: [],
                error: error.response?.data?.message || error.message,
            }
        }
    }

    const fetchUserDocuments = async ({ search = '', page = 1, perPage = 10 } = {}) => {
        try {
            const response = await api.get('/admin/users/documents', {
                params: {
                    ...(search ? { search } : {}),
                    page,
                    per_page: perPage,
                },
            })
            const content = response.data?.content ?? {}
            const users = content.users ?? []
            return {
                success: true,
                users,
                currentPage: content.current_page ?? page,
                lastPage: content.last_page ?? 1,
                perPage: content.per_page ?? perPage,
                total: content.total ?? users.length,
            }
        } catch (error) {
            return {
                success: false,
                users: [],
                currentPage: 1,
                lastPage: 1,
                perPage,
                total: 0,
                error: error.response?.data?.message || error.message,
            }
        }
    }

    const fetchAllUsers = async ({ search = '', page = 1, perPage = 15 } = {}) => {
        try {
            const response = await api.get('/admin/users/all', {
                params: {
                    ...(search ? { search } : {}),
                    page,
                    per_page: perPage,
                },
            })
            const content = response.data?.content ?? {}
            const users = content.users ?? []
            return {
                success: true,
                users,
                currentPage: content.current_page ?? page,
                lastPage: content.last_page ?? 1,
                perPage: content.per_page ?? perPage,
                total: content.total ?? users.length,
            }
        } catch (error) {
            return {
                success: false,
                users: [],
                currentPage: 1,
                lastPage: 1,
                perPage,
                total: 0,
                error: error.response?.data?.message || error.message,
            }
        }
    }

    const extendUserPayment = async (userId, payload) => {
        try {
            const response = await api.post(`/admin/users/${userId}/extend-payment`, payload)
            return { success: true, data: response.data }
        } catch (error) {
            return {
                success: false,
                error: error.response?.data?.message || error.message,
                errorDetails: error.response?.data?.errors || error.response?.data?.error || null,
            }
        }
    }

    const deleteUser = async (userId, password) => {
        try {
            const response = await api.delete(`/admin/users/${userId}`, {
                data: { password },
            })
            return { success: true, data: response.data }
        } catch (error) {
            return {
                success: false,
                error: error.response?.data?.message || error.message,
                errorDetails: error.response?.data?.errors || error.response?.data?.error || null,
            }
        }
    }

    const createUser = async (payload) => {
        try {
            const response = await api.post('/admin/users', payload)
            return { success: true, data: response.data }
        } catch (error) {
            const errorMessage = error.response?.data?.message || error.message
            const errorDetails = error.response?.data?.errors || error.response?.data?.error || null
            return {
                success: false,
                error: errorMessage,
                errorDetails,
                response: error.response,
            }
        }
    }

    const approveUser = async (userId) => {
        try {
            const response = await api.post(`/admin/users/${userId}/approve`)
            return { success: true, data: response.data }
        } catch (error) {
            return {
                success: false,
                error: error.response?.data?.message || error.message,
            }
        }
    }

    const revokeUserApproval = async (userId) => {
        try {
            const response = await api.post(`/admin/users/${userId}/revoke-approval`)
            return { success: true, data: response.data }
        } catch (error) {
            return {
                success: false,
                error: error.response?.data?.message || error.message,
            }
        }
    }

    const rejectUser = async (userId, description = '') => {
        try {
            const response = await api.post(`/admin/users/${userId}/reject`, { description })
            return { success: true, data: response.data }
        } catch (error) {
            return {
                success: false,
                error: error.response?.data?.message || error.message,
            }
        }
    }

    return {
        token,
        admin,
        isAuthenticated,
        syncTokenFromStorage,
        setToken,
        login,
        checkToken,
        fetchDashboard,
        logout,
        createShipment,
        fetchAllShipments,
        deleteShipment,
        searchUsers,
        fetchUserDocuments,
        fetchAllUsers,
        extendUserPayment,
        deleteUser,
        createUser,
        approveUser,
        revokeUserApproval,
        rejectUser,
    }
})
