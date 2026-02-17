import { defineStore } from 'pinia'
import { ref } from 'vue'
import api from '@/api'

export const useShipmentsStore = defineStore('shipments', () => {
    const list = ref([])
    const loading = ref(false)
    const error = ref(null)
    const currentPage = ref(1)

    const postState = ref({
        f_where: null,
        t_where: null
    })

    async function fetchShipments(options = {}) {
        const { limit = 20, append = false, type, filters = null} = options
        const page = append ? currentPage.value + 1 : 1
        try {
            loading.value = true
            error.value = null
            const params = { page, limit, filters }
            if (type) params.type = type
            const res = await api.get('/shipments', { params })
            const content = res.data?.content
            if (content) {
                const data = Array.isArray(content) ? content : (content.data ?? content)
                if (append && Array.isArray(content?.data)) {
                    list.value = [...list.value, ...(data || [])]
                } else {
                    list.value = data ?? []
                }
                if (content.current_page != null) currentPage.value = content.current_page
            }
        } catch (err) {
            error.value = err.response?.data?.message || err.message || 'İlanlar yüklenirken bir hata oluştu'
            if (!append) list.value = []
        } finally {
            loading.value = false
        }
    }

    function setPage(page) {
        currentPage.value = page
    }

    function clearError() {
        error.value = null
    }

    function setPost(name, value) {
        posts.value[name] = value
    }

    return {
        list,
        loading,
        error,
        currentPage,
        fetchShipments,
        setPage,
        clearError,

        setPost,
        postState
    }
})
