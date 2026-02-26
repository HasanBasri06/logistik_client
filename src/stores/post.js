import { defineStore } from "pinia";
import { ref } from "vue";

export const usePostStore = defineStore('post', () => {
    const page = ref(1);
    const limit = ref(3);
    const selectedCar = ref(null);
    const selectedDetailValues = ref({});
    const selectedPostType = ref(null);

    const nextPage = () => {
        if (page.value >= limit.value) return;        
        page.value++;
    }
    const prevPage = () => {
        if (page.value <= 1) return;
        page.value--;
    }

    const resetPage = () => {
        page.value = 1;
    }

    function setSelectedPostType(postType) {
        selectedPostType.value = postType;
    }

    const selectResetStates = () => {
        selectedCar.value = null
        selectedDetailValues.value = {}
        selectedPostType.value = null;
    }

    return {
        page,
        limit,
        selectedCar,
        selectedDetailValues,
        selectedPostType,
        nextPage,
        prevPage,
        resetPage,
        setSelectedPostType,
        selectResetStates
    }
})