<template>
  <AuthShell title="Giriş Yap" description="Telefon numaran ve şifrenle hesabına giriş yap.">
    <form class="flex flex-col gap-4" novalidate @submit.prevent="submit">
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
        :error="errors.phone"
      />

      <div>
        <AuthInput
          v-model="password"
          label="Şifre"
          icon="pi pi-lock"
          placeholder="••••••••"
          autocomplete="current-password"
          password-toggle
          :error="errors.password"
        />
        <div class="mt-2.5 flex justify-end">
          <RouterLink to="/sifremi-unuttum" class="text-sm font-semibold text-primary hover:underline">
            Şifremi unuttum
          </RouterLink>
        </div>
      </div>

      <div
        v-if="inactiveMessage"
        class="flex items-start gap-2 rounded-xl border border-primary/25 bg-primary/5 p-3 text-[13px] font-semibold leading-snug text-[#0F5F66]"
        role="status"
      >
        <i class="pi pi-info-circle mt-0.5 text-primary"></i>
        <span>{{ inactiveMessage }}</span>
      </div>
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
        :disabled="loading || googleLoading"
      >
        <i v-if="loading" class="pi pi-spin pi-spinner"></i>
        <span v-else>Giriş Yap</span>
      </button>

      <p class="text-center text-sm text-slate-500">
        Hesabın yok mu?
        <RouterLink to="/kayit-ol" class="font-bold text-primary hover:underline">Kayıt Ol</RouterLink>
      </p>

      <div class="flex items-center gap-3" aria-hidden="true">
        <span class="h-px flex-1 bg-slate-300/70"></span>
        <span class="text-[13px] font-medium text-slate-400">ya da</span>
        <span class="h-px flex-1 bg-slate-300/70"></span>
      </div>

      <GoogleSignInButton label="Google ile Giriş Yap" text="signin_with" :busy="googleLoading" @credential="handleGoogleCredential" />
    </form>
  </AuthShell>
</template>

<script setup>
import { ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { toast } from 'vue-sonner';
import AuthShell from '@/components/auth/AuthShell.vue';
import AuthInput from '@/components/auth/AuthInput.vue';
import GoogleSignInButton from '@/components/auth/GoogleSignInButton.vue';
import { useAuthStore } from '@/stores/auth';
import { useGoogleAuth } from '@/composables/useGoogleAuth';
import { firstApiError, formatTrPhoneInput, phoneDigits, redirectAfterLogin } from '@/lib/auth-ui';

const router = useRouter();
const route = useRoute();
const authStore = useAuthStore();

const phone = ref(formatTrPhoneInput(String(route.query.phone ?? '')));
const password = ref('');
const errors = ref({ phone: '', password: '' });
const submitError = ref('');
const inactiveMessage = ref('');
const loading = ref(false);

const { googleLoading, handleGoogleCredential } = useGoogleAuth({
  onInactive: (msg) => {
    inactiveMessage.value = msg;
  },
});

function validate() {
  const next = { phone: '', password: '' };
  if (phoneDigits(phone.value).length !== 10) next.phone = 'Telefon numarası 10 haneli olmalıdır.';
  if (!password.value.trim()) next.password = 'Şifre zorunludur.';
  else if (password.value.trim().length < 6) next.password = 'Şifre en az 6 karakter olmalıdır.';
  errors.value = next;
  return !next.phone && !next.password;
}

async function submit() {
  submitError.value = '';
  inactiveMessage.value = '';
  if (!validate()) return;

  loading.value = true;
  try {
    const result = await authStore.login({ phone: phoneDigits(phone.value), password: password.value });
    if (result.success) {
      toast.success('Giriş başarılı!');
      redirectAfterLogin(router);
      return;
    }
    if (result.needOtp && result.email) {
      toast.info(result.error || 'Telefon doğrulaması gerekli.');
      router.push({ path: '/telefon-dogrula', query: { phone: phoneDigits(result.email), from: 'login' } });
      return;
    }
    if (result.accountInactive) {
      inactiveMessage.value = result.error;
      return;
    }
    submitError.value = firstApiError(result, 'Giriş başarısız.');
  } finally {
    loading.value = false;
  }
}
</script>
