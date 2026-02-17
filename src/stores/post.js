import { defineStore } from "pinia";
import { ref } from "vue";

export const usePostStore = defineStore('post', () => {
    const page = ref(1);
    const limit = ref(3);
    const selectedCar = ref(null);
    const selectedDetailValues = ref({});

    const nextPage = () => {
        if (page.value >= limit.value) return;        
        page.value++;
    }
    const prevPage = () => {
        if (page.value <= 1) return;
        page.value--;
    }

    return {
        page,
        limit,
        selectedCar,
        selectedDetailValues,
        nextPage,
        prevPage,
    }
})