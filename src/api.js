import axios from "axios"

const baseURL = import.meta.env.VITE_APP_SERVER_URL
const apiBaseURL = baseURL ? `${baseURL.replace(/\/$/, '')}/api` : '/api'

const api = axios.create({
    baseURL: apiBaseURL,
    timeout: 20000,
})

function isAdminRequest(config) {
    const url = config.url || ''
    return url.startsWith('/admin')
}

// Request interceptor — kullanıcı ve admin token'larını ayır
api.interceptors.request.use(
    (config) => {
        if (isAdminRequest(config)) {
            const adminToken = localStorage.getItem('admin_token')
            if (adminToken) {
                config.headers.Authorization = `Bearer ${adminToken}`
            } else {
                delete config.headers.Authorization
            }
            return config
        }

        const token = localStorage.getItem('token')
        if (token) {
            config.headers.Authorization = `Bearer ${token}`
        } else {
            delete config.headers.Authorization
        }
        return config
    },
    (error) => Promise.reject(error),
)

// Response interceptor — 401'de yalnızca ilgili oturumu temizle
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            const url = error.config?.url || ''
            if (url.includes('/admin')) {
                localStorage.removeItem('admin_token')
            } else {
                localStorage.removeItem('token')
                localStorage.removeItem('user')
            }
            delete api.defaults.headers.common['Authorization']
        }
        return Promise.reject(error)
    },
)

export default api
