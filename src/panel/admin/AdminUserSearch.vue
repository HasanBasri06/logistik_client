<template>
    <div ref="rootRef" class="flex flex-col gap-2">
        <label class="text-sm font-medium text-gray-700" for="creatorSearch">Ekleyen Kullanıcı</label>
        <div class="relative">
            <input
                id="creatorSearch"
                v-model="searchQuery"
                type="search"
                autocomplete="off"
                autocorrect="off"
                autocapitalize="off"
                spellcheck="false"
                placeholder="İsim ile ara..."
                class="h-11 w-full rounded-lg border border-gray-200 px-4 text-sm text-gray-900 placeholder:text-gray-400 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                @input="onSearchInput"
            />
            <button
                v-if="selectedUser"
                type="button"
                class="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400 hover:text-gray-600"
                @click="clearSelection"
            >
                Temizle
            </button>

            <div
                v-if="showDropdown && searchQuery.trim() && (users.length || usersLoading)"
                class="absolute z-20 mt-1 max-h-56 w-full overflow-y-auto rounded-lg border border-gray-200 bg-white shadow-lg"
            >
                <div v-if="usersLoading" class="px-4 py-3 text-sm text-gray-500">
                    Aranıyor...
                </div>
                <button
                    v-for="user in users"
                    :key="user.id"
                    type="button"
                    class="flex w-full flex-col items-start px-4 py-3 text-left hover:bg-gray-50"
                    @click="selectUser(user)"
                >
                    <span class="text-sm font-medium text-gray-900">{{ user.full_name }}</span>
                    <span class="text-xs text-gray-500">{{ user.phone }} · {{ userTypeLabel(user.type) }}</span>
                </button>
                <div v-if="!usersLoading && !users.length" class="px-4 py-3 text-sm text-gray-500">
                    Kullanıcı bulunamadı.
                </div>
            </div>
        </div>
        <p v-if="selectedUser" class="text-xs text-gray-500">
            Seçili: {{ selectedUser.full_name }}
        </p>
    </div>
</template>

<script setup>
import { onMounted, onUnmounted, ref, watch } from 'vue';
import { useAdminStore } from '@/stores/admin';

const props = defineProps({
    modelValue: {
        type: [Number, String, null],
        default: null,
    },
});

const emit = defineEmits(['update:modelValue', 'user-selected']);

const adminStore = useAdminStore();
const rootRef = ref(null);
const searchQuery = ref('');
const users = ref([]);
const usersLoading = ref(false);
const showDropdown = ref(false);
const selectedUser = ref(null);
let searchTimer = null;

function userTypeLabel(type) {
    if (type === 'vehicle_owner') return 'Araç Sahibi';
    if (type === 'cargo_owner') return 'Yük Sahibi';
    return type;
}

async function fetchUsers() {
    const query = searchQuery.value.trim();
    if (!query) {
        users.value = [];
        return;
    }

    usersLoading.value = true;
    try {
        const result = await adminStore.searchUsers(query);
        users.value = result.success ? result.users : [];
    } finally {
        usersLoading.value = false;
    }
}

function onSearchInput() {
    if (selectedUser.value) {
        selectedUser.value = null;
        emit('update:modelValue', null);
        emit('user-selected', null);
    }

    clearTimeout(searchTimer);
    const query = searchQuery.value.trim();
    if (!query) {
        showDropdown.value = false;
        users.value = [];
        return;
    }

    searchTimer = setTimeout(() => {
        showDropdown.value = true;
        fetchUsers();
    }, 300);
}

function selectUser(user) {
    selectedUser.value = user;
    searchQuery.value = user.full_name;
    showDropdown.value = false;
    emit('update:modelValue', user.id);
    emit('user-selected', user);
}

function clearSelection() {
    selectedUser.value = null;
    searchQuery.value = '';
    users.value = [];
    showDropdown.value = false;
    emit('update:modelValue', null);
    emit('user-selected', null);
}

function onDocumentClick(event) {
    if (rootRef.value && !rootRef.value.contains(event.target)) {
        showDropdown.value = false;
    }
}

watch(
    () => props.modelValue,
    async (value) => {
        if (!value) {
            selectedUser.value = null;
            searchQuery.value = '';
            showDropdown.value = false;
            return;
        }

        if (selectedUser.value?.id === Number(value)) {
            return;
        }

        const result = await adminStore.searchUsers('');
        const user = (result.users ?? []).find((entry) => entry.id === Number(value));
        if (user) {
            selectedUser.value = user;
            searchQuery.value = user.full_name;
        }
    },
    { immediate: true },
);

onMounted(() => {
    document.addEventListener('click', onDocumentClick);
});

onUnmounted(() => {
    document.removeEventListener('click', onDocumentClick);
    clearTimeout(searchTimer);
});
</script>
