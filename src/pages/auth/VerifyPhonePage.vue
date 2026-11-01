<template>
  <AuthShell title="Telefon Doğrulama" :description="description" back @back="goBack">
    <form class="flex flex-col gap-4" novalidate @submit.prevent="verify">
      <div class="flex flex-col gap-2">
        <span class="text-[13px] font-semibold text-slate-700">Doğrulama Kodu</span>
        <OtpAutofillInput v-model="code" :disabled="loading" :invalid="!!codeError" />
        <span v-if="codeError" class="text-center text-xs font-medium text-red-600">{{ codeError }}</span>
      </div>

      <div class="flex items-center justify-center gap-4 text-sm">
        <button type="button" class="font-semibold text-primary hover:underline disabled:opacity-50" :disabled="resendLoading" @click="resend">
          <i v-if="resendLoading" class="pi pi-spin pi-spinner text-xs"></i>
          <span v-else>Kodu tekrar gönder</span>
        </button>
        <span class="h-4 w-px bg-slate-200" aria-hidden="true"></span>
        <button type="button" class="font-semibold text-slate-600 hover:text-primary" @click="toggleChangePhone">
          Numarayı değiştir
        </button>
      </div>

      <!-- Yanlış numara: yeni numaraya kod gönder (sayfa içinde, popup değil) -->
      <div v-if="changeOpen" class="flex flex-col gap-3 rounded-[14px] border border-slate-200 bg-slate-50 p-3.5">
        <AuthInput
          v-model="newPhone"
          label="Yeni telefon numarası"
          icon="pi pi-phone"
          prefix="+90"
          type="tel"
          inputmode="tel"
          placeholder="5XX XXX XX XX"
          maxlength="13"
          :format="formatTrPhoneInput"
          :error="changeError"
        />
        <p class="text-xs text-slate-500">Numara başka bir hesapta kayıtlı olamaz. Kod yeni numaraya SMS ile gönderilir.</p>
        <div class="flex justify-end gap-2">
          <button type="button" class="rounded-lg px-3 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-100" :disabled="changeLoading" @click="changeOpen = false">
            Vazgeç
          </button>
          <button
            type="button"
            class="rounded-lg bg-primary px-3 py-2 text-sm font-semibold text-white hover:bg-primary-dark disabled:opacity-50"
            :disabled="changeLoading || phoneDigits(newPhone).length !== 10"
            @click="submitChangePhone"
          >
            {{ changeLoading ? 'Gönderiliyor…' : 'Kaydet ve kod gönder' }}
          </button>
        </div>
      </div>

      <button
        type="submit"
        class="flex h-[52px] items-center justify-center rounded-[14px] bg-primary text-base font-bold text-white transition-colors hover:bg-primary-dark disabled:opacity-60"
        :disabled="loading || code.length !== 6"
      >
        <i v-if="loading" class="pi pi-spin pi-spinner"></i>
        <span v-else>Doğrula</span>
      </button>

      <p class="text-center text-sm text-slate-500">
        Farklı bir hesapla mı devam edeceksin?
        <RouterLink to="/giris" class="font-bold text-primary hover:underline">Giriş Yap</RouterLink>
      </p>
    </form>
  </AuthShell>
</template>

<script setup>
import { computed, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { toast } from 'vue-sonner';
import AuthShell from '@/components/auth/AuthShell.vue';
import AuthInput from '@/components/auth/AuthInput.vue';
import OtpAutofillInput from '@/components/OtpAutofillInput.vue';
import { useAuthStore } from '@/stores/auth';
import { formatTrPhoneInput, phoneDigits, redirectAfterLogin } from '@/lib/auth-ui';

const router = useRouter();
const route = useRoute();
const authStore = useAuthStore();

/** Kodun gönderildiği telefon (10 hane); numara değişirse güncellenir */
const phone = ref(phoneDigits(route.query.phone));
const fromLogin = route.query.from === 'login';

const code = ref('');
const codeError = ref('');
const loading = ref(false);
const resendLoading = ref(false);

const changeOpen = ref(false);
const newPhone = ref('');
const changeError = ref('');
const changeLoading = ref(false);

const description = computed(() =>
  phone.value
    ? `+90 ${formatTrPhoneInput(phone.value)} numarasına gönderilen 6 haneli kodu gir.`
    : 'Telefonuna gelen 6 haneli kodu gir.'
);

// Telefon bilgisi olmadan bu sayfanın anlamı yok
if (phone.value.length !== 10) router.replace('/giris');

function goBack() {
  router.push(fromLogin ? '/giris' : '/kayit-ol');
}

async function verify() {
  codeError.value = '';
  if (code.value.length !== 6) {
    codeError.value = 'Lütfen 6 haneli kodu girin.';
    return;
  }
  loading.value = true;
  try {
    const result = await authStore.verifyOtp(phone.value, code.value);
    if (result.success) {
      toast.success(fromLogin ? 'Giriş başarılı!' : 'Kayıt tamamlandı.');
      redirectAfterLogin(router);
      return;
    }
    codeError.value = result.error || 'Kod hatalı.';
  } finally {
    loading.value = false;
  }
}

async function resend() {
  resendLoading.value = true;
  codeError.value = '';
  try {
    const result = await authStore.resendOtp(phone.value);
    if (result.success) {
      code.value = '';
      toast.success(result.message || 'Kod gönderildi.', { description: 'SMS kutunuzu kontrol edin.' });
    } else {
      toast.error(result.error || 'Kod gönderilemedi.');
    }
  } finally {
    resendLoading.value = false;
  }
}

function toggleChangePhone() {
  changeOpen.value = !changeOpen.value;
  changeError.value = '';
  newPhone.value = '';
}

async function submitChangePhone() {
  const digits = phoneDigits(newPhone.value);
  if (digits.length !== 10) {
    changeError.value = 'Geçerli bir 10 haneli cep numarası girin.';
    return;
  }
  changeLoading.value = true;
  changeError.value = '';
  try {
    const result = await authStore.changePhonePending(phone.value, digits);
    if (result.success && result.phone) {
      phone.value = phoneDigits(result.phone);
      code.value = '';
      changeOpen.value = false;
      router.replace({ query: { ...route.query, phone: phone.value } });
      toast.success('Telefon güncellendi', { description: 'Yeni kod SMS ile gönderildi.' });
    } else {
      changeError.value = result.error || 'İşlem başarısız.';
    }
  } finally {
    changeLoading.value = false;
  }
}
</script>
