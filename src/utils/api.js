import { Axios } from "axios"

const api = Axios.create({
    baseURL: 'deneme'
})

export default api