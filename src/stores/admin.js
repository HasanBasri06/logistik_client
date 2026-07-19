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
                yesterdayUsers: content.yesterday_users ?? [],
                yesterdayUsersCount: content.yesterday_users_count ?? 0,
                totalUsers: content.total_users ?? 0,
                totalShipments: content.total_shipments ?? 0,
                totalCallRequests: content.total_call_requests ?? 0,
                totalSearches: content.total_searches ?? 0,
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

    const fetchSearchAnalysis = async ({ search = '', page = 1, perPage = 15, listingStatus = '' } = {}) => {
        try {
            const response = await api.get('/admin/search-analysis', {
                params: {
                    ...(search ? { search } : {}),
                    ...(listingStatus ? { listing_status: listingStatus } : {}),
                    page,
                    per_page: perPage,
                },
            })
            const content = response.data?.content ?? {}
            const records = content.records ?? []
            return {
                success: true,
                records,
                currentPage: content.current_page ?? page,
                lastPage: content.last_page ?? 1,
                perPage: content.per_page ?? perPage,
                total: content.total ?? records.length,
                summary: {
                    mostSearchedCity: content.summary?.most_searched_city ?? null,
                    mostZeroResultSearch: content.summary?.most_zero_result_search ?? null,
                    totalSearches: content.summary?.total_searches ?? 0,
                    listedSearches: content.summary?.listed_searches ?? 0,
                    unlistedSearches: content.summary?.unlisted_searches ?? 0,
                },
            }
        } catch (error) {
            return {
                success: false,
                records: [],
                currentPage: 1,
                lastPage: 1,
                perPage,
                total: 0,
                error: error.response?.data?.message || error.message,
            }
        }
    }

    const fetchShipmentAnalytics = async () => {
        try {
            const response = await api.get('/admin/shipments/analytics')
            const content = response.data?.content ?? {}
            return {
                success: true,
                mostLoadingCity: content.most_loading_city ?? null,
                mostUnloadingCity: content.most_unloading_city ?? null,
                emptyLoadingCities: content.empty_loading_cities ?? [],
                emptyLoadingCitiesCount: content.empty_loading_cities_count ?? 0,
                emptyUnloadingCities: content.empty_unloading_cities ?? [],
                emptyUnloadingCitiesCount: content.empty_unloading_cities_count ?? 0,
            }
        } catch (error) {
            return {
                success: false,
                error: error.response?.data?.message || error.message,
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

    const sendSms = async (userId, message, password) => {
        try {
            const response = await api.post('/admin/sms', { user_id: userId, message, password })
            return { success: true, data: response.data }
        } catch (error) {
            return {
                success: false,
                error: error.response?.data?.message || error.message,
                errorDetails: error.response?.data?.errors || error.response?.data?.error || null,
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

    const fetchAllUsers = async ({ search = '', page = 1, perPage = 15, isAnalysis = false } = {}) => {
        try {
            const response = await api.get('/admin/users/all', {
                params: {
                    ...(search ? { search } : {}),
                    page,
                    per_page: perPage,
                    isAnalysis: isAnalysis
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

    const fetchAdminCars = async (search = '') => {
        try {
            const response = await api.get('/admin/cars', {
                params: search ? { search } : {},
            })
            return {
                success: true,
                cars: response.data?.content?.cars ?? [],
            }
        } catch (error) {
            return {
                success: false,
                cars: [],
                error: error.response?.data?.message || error.message,
            }
        }
    }

    const updateAdminCar = async (carId, payload) => {
        try {
            if (payload instanceof FormData) {
                payload.append('_method', 'PUT')
                const response = await api.post(`/admin/cars/${carId}`, payload, {
                    headers: { 'Content-Type': 'multipart/form-data' },
                })
                return { success: true, data: response.data }
            }
            const response = await api.put(`/admin/cars/${carId}`, payload)
            return { success: true, data: response.data }
        } catch (error) {
            return {
                success: false,
                error: error.response?.data?.message || error.message,
                errorDetails: error.response?.data?.errors || null,
            }
        }
    }

    const createAdminCar = async (formData) => {
        try {
            const response = await api.post('/admin/cars', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            })
            return { success: true, data: response.data }
        } catch (error) {
            return {
                success: false,
                error: error.response?.data?.message || error.message,
                errorDetails: error.response?.data?.errors || null,
            }
        }
    }

    const fetchAdminCities = async (search = '') => {
        try {
            const response = await api.get('/admin/cities', {
                params: search ? { search } : {},
            })
            return {
                success: true,
                cities: response.data?.content?.cities ?? [],
            }
        } catch (error) {
            return {
                success: false,
                cities: [],
                error: error.response?.data?.message || error.message,
            }
        }
    }

    const updateAdminCity = async (cityId, payload) => {
        try {
            const response = await api.put(`/admin/cities/${cityId}`, payload)
            return { success: true, data: response.data }
        } catch (error) {
            return {
                success: false,
                error: error.response?.data?.message || error.message,
                errorDetails: error.response?.data?.errors || null,
            }
        }
    }

    const fetchAdminCityDistricts = async (cityId) => {
        try {
            const response = await api.get(`/admin/cities/${cityId}/districts`)
            const content = response.data?.content ?? {}
            return {
                success: true,
                city: content.city ?? null,
                districts: content.districts ?? [],
            }
        } catch (error) {
            return {
                success: false,
                city: null,
                districts: [],
                error: error.response?.data?.message || error.message,
            }
        }
    }

    const createAdminDistrict = async (cityId, name) => {
        try {
            const response = await api.post(`/admin/cities/${cityId}/districts`, { name })
            return { success: true, data: response.data }
        } catch (error) {
            return {
                success: false,
                error: error.response?.data?.message || error.message,
                errorDetails: error.response?.data?.errors || null,
            }
        }
    }

    const updateAdminDistrict = async (districtId, name) => {
        try {
            const response = await api.put(`/admin/districts/${districtId}`, { name })
            return { success: true, data: response.data }
        } catch (error) {
            return {
                success: false,
                error: error.response?.data?.message || error.message,
                errorDetails: error.response?.data?.errors || null,
            }
        }
    }

    const deleteAdminDistrict = async (districtId) => {
        try {
            const response = await api.delete(`/admin/districts/${districtId}`)
            return { success: true, data: response.data }
        } catch (error) {
            return {
                success: false,
                error: error.response?.data?.message || error.message,
            }
        }
    }

    const fetchAdminPostTypes = async (search = '') => {
        try {
            const response = await api.get('/admin/post-types', {
                params: search ? { search } : {},
            })
            return {
                success: true,
                postTypes: response.data?.content?.post_types ?? [],
            }
        } catch (error) {
            return {
                success: false,
                postTypes: [],
                error: error.response?.data?.message || error.message,
            }
        }
    }

    const updateAdminPostType = async (postTypeId, payload) => {
        try {
            if (payload instanceof FormData) {
                payload.append('_method', 'PUT')
                const response = await api.post(`/admin/post-types/${postTypeId}`, payload, {
                    headers: { 'Content-Type': 'multipart/form-data' },
                })
                return { success: true, data: response.data }
            }
            const response = await api.put(`/admin/post-types/${postTypeId}`, payload)
            return { success: true, data: response.data }
        } catch (error) {
            return {
                success: false,
                error: error.response?.data?.message || error.message,
                errorDetails: error.response?.data?.errors || null,
            }
        }
    }

    const createAdminPostType = async (formData) => {
        try {
            const response = await api.post('/admin/post-types', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            })
            return { success: true, data: response.data }
        } catch (error) {
            return {
                success: false,
                error: error.response?.data?.message || error.message,
                errorDetails: error.response?.data?.errors || null,
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
        sendSms,
        logout,
        createShipment,
        fetchShipmentAnalytics,
        fetchSearchAnalysis,
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
        fetchAdminCars,
        createAdminCar,
        updateAdminCar,
        fetchAdminCities,
        updateAdminCity,
        fetchAdminCityDistricts,
        createAdminDistrict,
        updateAdminDistrict,
        deleteAdminDistrict,
        fetchAdminPostTypes,
        createAdminPostType,
        updateAdminPostType,
    }
})
