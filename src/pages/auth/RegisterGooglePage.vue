<template>
  <AuthShell
    v-if="pending"
    title="Kaydı Tamamla"
    description="Hesap tipini seç ve telefon numaranı gir; doğrulama kodu SMS ile gelecek."
    back
    @back="goLogin"
  >
    <div class="mb-5 flex items-center gap-3 rounded-[14px] border border-slate-200 bg-slate-50 p-3">
      <span class="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-slate-200 bg-white">
        <i class="pi pi-google" style="color: #EA4335; font-size: 16px;"></i>
      </span>
      <div class="min-w-0 flex-1">
        <p v-if="fullName" class="truncate text-[15px] font-bold text-slate-900">{{ fullName }}</p>
        <p class="truncate text-[13px] text-slate-500">{{ pending.profile.email }}</p>
      </div>
      <i class="pi pi-check-circle text-primary" style="font-size: 18px;"></i>
    </div>

    <form class="flex flex-col gap-4" novalidate @submit.prevent="submit">
      <AccountTypePicker v-model="type" />

      <AuthInput
        v-model="phone"
        label="Telefon Numarası"
        icon="pi pi-phone"
        prefix="+90"
        type="tel"
        inputmode="tel"
        autocomplete="tel-national"
        placeholder="5XX XXX XX XX"
        maxlength="13"
        :format="formatTrPhoneInput"
        :error="phoneError"
      />

      <div
        v-if="submitError"
        class="flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 p-3 text-[13px] font-semibold leading-snug text-red-800"
        role="alert"
      >
        <i class="pi pi-exclamation-circle mt-0.5 text-red-600"></i>
        <span>{{ submitError }}</span>
      </div>

      <button
        type="submit"
        class="flex h-[52px] items-center justify-center rounded-[14px] bg-primary text-base font-bold text-white transition-colors hover:bg-primary-dark disabled:opacity-60"
        :disabled="loading"
      >
        <i v-if="loading" class="pi pi-spin pi-spinner"></i>
        <span v-else>Devam Et</span>
      </button>

      <p class="text-center text-sm text-slate-500">
        Farklı bir hesapla mı devam edeceksin?
        <button type="button" class="font-bold text-primary hover:underline" @click="goLogin">Geri Dön</button>
      </p>
    </form>
  </AuthShell>
</template>

<script setup>
import { computed, ref } from 'vue';
import { useRouter } from 'vue-router';
import AuthShell from '@/components/auth/AuthShell.vue';
import AuthInput from '@/components/auth/AuthInput.vue';
import AccountTypePicker from '@/components/auth/AccountTypePicker.vue';
import { useAuthStore } from '@/stores/auth';
import { clearPendingGoogleRegistration, getPendingGoogleRegistration } from '@/composables/useGoogleAuth';
import { formatTrPhoneInput, phoneDigits } from '@/lib/auth-ui';

const router = useRouter();
const authStore = useAuthStore();

/** Google ile girişten gelen bilgi; sayfa yenilenirse kaybolur → girişe dönülür */
const pending = getPendingGoogleRegistration();
if (!pending) router.replace('/giris');

const type = ref('vehicle_owner');
const phone = ref('');
const phoneError = ref('');
const submitError = ref('');
const loading = ref(false);

const fullName = computed(() => `${pending?.profile.firstName ?? ''} ${pending?.profile.lastName ?? ''}`.trim());

function goLogin() {
  clearPendingGoogleRegistration();
  router.replace('/giris');
}

async function submit() {
  submitError.value = '';
  const digits = phoneDigits(phone.value);
  if (digits.length !== 10) {
    phoneError.value = 'Telefon numarası 10 haneli olmalıdır.';
    return;
  }
  phoneError.value = '';
  loading.value = true;
  try {
    const result = await authStore.googleRegister(pending.idToken, digits, type.value);
    if (result.success) {
      clearPendingGoogleRegistration();
      router.replace({ path: '/telefon-dogrula', query: { phone: phoneDigits(result.email) || digits, from: 'register' } });
      return;
    }
    if (result.phoneError) phoneError.value = result.phoneError;
    submitError.value = result.error || 'Kayıt tamamlanamadı.';
    // Google ID token ~1 saat geçerli; süresi dolduysa baştan Google ile devam edilmeli
    if (result.expired) setTimeout(goLogin, 1500);
  } finally {
    loading.value = false;
  }
}
</script>
