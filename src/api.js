import axios from "axios"
const api = axios.create({
    baseURL: import.meta.env.VITE_BACKEND_ROOT || 'http://localhost:8000/api',
    timeout: 10000,
})

// Request interceptor - Token'ı header'a ekle
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token')
        if (token) {
            config.headers.Authorization = `Bearer ${token}`
        }
        return config
    },
    (error) => {
        return Promise.reject(error)
    }
)

// Response interceptor - 401 hatası durumunda logout
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            // Token geçersiz veya süresi dolmuş
            localStorage.removeItem('token')
            localStorage.removeItem('user')
            delete api.defaults.headers.common['Authorization']
            // Router'ı burada import edemeyiz, bu yüzden store'dan logout çağrılacak
        }
        return Promise.reject(error)
    }
)

export default api