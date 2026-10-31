import { defineStore } from "pinia";
import { ref, computed } from "vue";

export const usePostStore = defineStore('post', () => {
    const page = ref(1);
    const limit = ref(3);
    /** İlan oluşturma modalı (her açılışta sihirbaz sıfırdan başlar) */
    const createModalOpen = ref(false);
    /** Seçili araçlar: [{ car, details: [{ id, name }] }] — bir yük birden fazla araç türüyle taşınabilir */
    const selectedCars = ref([]);
    const selectedPostType = ref(null);

    /** İlk seçilen araç (eski tek araçlı alanlar için: `car_id`) */
    const selectedCar = computed(() => selectedCars.value[0]?.car ?? null);

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

    function isCarSelected(carId) {
        return selectedCars.value.some((s) => s.car.id === carId);
    }

    /** Aracı seçime ekler / seçimden çıkarır; eklenirken varsayılan varyantlar verilir */
    function toggleCar(car, defaultDetails = []) {
        if (isCarSelected(car.id)) {
            selectedCars.value = selectedCars.value.filter((s) => s.car.id !== car.id);
        } else {
            selectedCars.value = [...selectedCars.value, { car, details: defaultDetails }];
        }
    }

    function setCarDetails(carId, details) {
        selectedCars.value = selectedCars.value.map((s) =>
            s.car.id === carId ? { ...s, details } : s
        );
    }

    const selectResetStates = () => {
        selectedCars.value = [];
        selectedPostType.value = null;
    }

    function openCreateModal() {
        selectResetStates();
        resetPage();
        createModalOpen.value = true;
    }

    function closeCreateModal() {
        createModalOpen.value = false;
    }

    return {
        page,
        limit,
        createModalOpen,
        selectedCars,
        selectedCar,
        selectedPostType,
        nextPage,
        prevPage,
        resetPage,
        isCarSelected,
        toggleCar,
        setCarDetails,
        setSelectedPostType,
        selectResetStates,
        openCreateModal,
        closeCreateModal
    }
})
