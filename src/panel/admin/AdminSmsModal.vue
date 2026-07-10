<template>
    <Transition name="sms-modal-fade">
        <div
            v-if="open"
            class="fixed inset-0 z-[9999] flex items-end justify-center sm:items-center sm:p-4"
            role="dialog"
            aria-modal="true"
            aria-labelledby="admin-sms-modal-title"
        >
            <div class="absolute inset-0 bg-slate-900/50" @click="close" />

            <div class="relative w-full sm:max-w-md bg-white rounded-t-2xl sm:rounded-2xl shadow-xl p-5 sm:p-6 max-h-[92vh] overflow-y-auto">
                <div class="flex items-center justify-between gap-3 mb-5">
                    <h3 id="admin-sms-modal-title" class="text-lg font-bold text-gray-900">SMS Gönder</h3>
                    <button
                        type="button"
                        class="inline-flex h-9 w-9 items-center justify-center rounded-lg text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-700"
                        aria-label="Kapat"
                        @click="close"
                    >
                        <i class="pi pi-times" style="font-size: 20px;" />
                    </button>
                </div>

                <div ref="searchRef" class="flex flex-col gap-2">
                    <label class="text-sm font-medium text-gray-700" for="smsUserSearch">Kullanıcı</label>
                    <div class="relative">
                        <input
                            id="smsUserSearch"
                            v-model="searchQuery"
                            type="search"
                            autocomplete="off"
                            spellcheck="false"
                            placeholder="İsim, telefon veya e-posta ile ara..."
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
                            <div v-if="usersLoading" class="px-4 py-3 text-sm text-gray-500">Aranıyor...</div>
                            <button
                                v-for="user in users"
                                :key="user.id"
                                type="button"
                                class="flex w-full flex-col items-start px-4 py-3 text-left hover:bg-gray-50"
                                @click="selectUser(user)"
                            >
                                <span class="text-sm font-medium text-gray-900">{{ user.full_name }}</span>
                                <span class="text-xs text-gray-500">{{ user.phone || '—' }} · {{ userTypeLabel(user.type) }}</span>
                            </button>
                            <div v-if="!usersLoading && !users.length" class="px-4 py-3 text-sm text-gray-500">
                                Kullanıcı bulunamadı.
                            </div>
                        </div>
                    </div>
                    <p v-if="selectedUser" class="text-xs text-gray-500">
                        Seçili: {{ selectedUser.full_name }} · {{ selectedUser.phone || 'Telefon yok' }}
                    </p>
                </div>

                <div class="mt-5 flex flex-col gap-2">
                    <div class="flex items-center justify-between">
                        <label class="text-sm font-medium text-gray-700" for="smsMessage">Mesaj İçeriği</label>
                        <span :class="['text-xs', message.length >= MAX_CHARS ? 'text-red-500' : 'text-gray-400']">
                            {{ message.length }}/{{ MAX_CHARS }}
                        </span>
                    </div>
                    <textarea
                        id="smsMessage"
                        v-model="message"
                        :maxlength="MAX_CHARS"
                        rows="4"
                        placeholder="Gönderilecek mesajı yazın..."
                        class="w-full resize-none rounded-lg border border-gray-200 px-4 py-3 text-sm text-gray-900 placeholder:text-gray-400 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                    ></textarea>
                </div>

                <div class="mt-5 flex flex-col gap-2">
                    <label class="text-sm font-medium text-gray-700" for="smsAdminPassword">Admin Panel Şifreniz</label>
                    <input
                        id="smsAdminPassword"
                        v-model="adminPassword"
                        type="password"
                        autocomplete="current-password"
                        placeholder="Şifrenizi girin"
                        class="h-11 w-full rounded-lg border border-gray-200 px-4 text-sm text-gray-900 placeholder:text-gray-400 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                    />
                </div>

                <div class="mt-6 flex items-center justify-end gap-3">
                    <button
                        type="button"
                        class="h-11 rounded-lg border border-gray-200 px-4 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
                        :disabled="sending"
                        @click="close"
                    >
                        İptal
                    </button>
                    <button
                        type="button"
                        class="inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-primary px-5 text-sm font-bold text-white transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
                        :disabled="!canSend"
                        @click="handleSend"
                    >
                        <i v-if="!sending" class="pi pi-send" />
                        <i v-else class="pi pi-spin pi-spinner" />
                        {{ sending ? 'Gönderiliyor...' : 'Gönder' }}
                    </button>
                </div>
            </div>
        </div>
    </Transition>
</template>

<script setup>
import { computed, ref, watch } from 'vue';
import { toast } from 'vue-sonner';
import { useAdminStore } from '@/stores/admin';

const props = defineProps({
    open: {
        type: Boolean,
        default: false,
    },
});

const emit = defineEmits(['update:open']);

const MAX_CHARS = 155;
const adminStore = useAdminStore();

const searchRef = ref(null);
const searchQuery = ref('');
const users = ref([]);
const usersLoading = ref(false);
const showDropdown = ref(false);
const selectedUser = ref(null);
const message = ref('');
    const adminPassword = ref('');
const sending = ref(false);
let searchTimer = null;

    const canSend = computed(() => {
        return !sending.value && !!selectedUser.value && message.value.trim().length > 0 && adminPassword.value.trim().length > 0;
    });

function userTypeLabel(type) {
    if (type === 'vehicle_owner') return 'Araç Sahibi';
    if (type === 'cargo_owner') return 'Yük Sahibi';
    return type || '—';
}

async function fetchUsers() {
    const query = searchQuery.value.trim();
    if (!query) {
        users.value = [];
        return;
    }

    usersLoading.value = true;
    try {
        const result = await adminStore.fetchAllUsers({ search: query, page: 1, perPage: 10 });
        users.value = result.success ? result.users : [];
    } finally {
        usersLoading.value = false;
    }
}

function onSearchInput() {
    if (selectedUser.value) {
        selectedUser.value = null;
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
}

function clearSelection() {
    selectedUser.value = null;
    searchQuery.value = '';
    users.value = [];
    showDropdown.value = false;
}

function resetForm() {
    clearSelection();
    message.value = '';
    adminPassword.value = '';
    sending.value = false;
}

function close() {
    if (sending.value) return;
    emit('update:open', false);
}

async function handleSend() {
    if (!selectedUser.value) {
        toast.error('Lütfen bir kullanıcı seçin.', { duration: 4000 });
        return;
    }
    if (!selectedUser.value.phone) {
        toast.error('Seçili kullanıcının telefon numarası yok.', { duration: 4000 });
        return;
    }
    const text = message.value.trim();
    if (!text) {
        toast.error('Mesaj içeriği boş olamaz.', { duration: 4000 });
        return;
    }
    const pwd = adminPassword.value.trim();
    if (!pwd) {
        toast.error('Admin şifrenizi girin.', { duration: 4000 });
        return;
    }

    sending.value = true;
    try {
        const result = await adminStore.sendSms(selectedUser.value.id, text, pwd);
        if (!result.success) {
            toast.error(result.error || 'SMS gönderilemedi.', { duration: 5000 });
            return;
        }
        toast.success(result.data?.message || 'SMS gönderildi.', { duration: 5000 });
        emit('update:open', false);
    } finally {
        sending.value = false;
    }
}

watch(
    () => props.open,
    (isOpen) => {
        if (isOpen) {
            resetForm();
        } else {
            clearTimeout(searchTimer);
        }
    },
);
</script>

<style scoped>
.sms-modal-fade-enter-active,
.sms-modal-fade-leave-active {
    transition: opacity 0.2s ease;
}

.sms-modal-fade-enter-from,
.sms-modal-fade-leave-to {
    opacity: 0;
}
</style>
