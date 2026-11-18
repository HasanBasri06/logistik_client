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

    /** Detay seçim modalı (çoklu seçim) açık olan araç */
    const detailModalCar = ref(null);

    function openDetailModal(car) {
        detailModalCar.value = car;
    }

    function closeDetailModal() {
        detailModalCar.value = null;
    }

    /** Aracı seçilen detaylarla yazar; detay listesi boşsa aracı seçimden çıkarır */
    function saveCarDetails(car, details) {
        if (!details.length) {
            selectedCars.value = selectedCars.value.filter((s) => s.car.id !== car.id);
        } else if (isCarSelected(car.id)) {
            setCarDetails(car.id, details);
        } else {
            selectedCars.value = [...selectedCars.value, { car, details }];
        }
    }

    /** Sepetten tek bir (araç, detay) satırını çıkarır; son detaysa araç da çıkar */
    function removeCarDetail(carId, detailId) {
        selectedCars.value = selectedCars.value.flatMap((s) => {
            if (s.car.id !== carId) return [s];
            if (detailId == null) return [];
            const details = s.details.filter((d) => d.id !== detailId);
            return details.length ? [{ ...s, details }] : [];
        });
    }

    /** Her (araç, detay) çifti ayrı satır — ilanda da ayrı araç olarak kaydedilir */
    const selectedCarRows = computed(() =>
        selectedCars.value.flatMap((s) =>
            s.details.length ? s.details.map((d) => ({ car: s.car, detail: d })) : [{ car: s.car, detail: null }]
        )
    );

    function setCarDetails(carId, details) {
        selectedCars.value = selectedCars.value.map((s) =>
            s.car.id === carId ? { ...s, details } : s
        );
    }

    const selectResetStates = () => {
        selectedCars.value = [];
        selectedPostType.value = null;
        detailModalCar.value = null;
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
        selectedCarRows,
        detailModalCar,
        openDetailModal,
        closeDetailModal,
        saveCarDetails,
        removeCarDetail,
        setSelectedPostType,
        selectResetStates,
        openCreateModal,
        closeCreateModal
    }
})
