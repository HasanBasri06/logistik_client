<template>
  <AuthShell title="Kayıt Ol" description="Hesabını oluştur, yükünü taşıt ya da yük bul." back @back="router.push('/giris')">
    <form class="flex flex-col gap-4" novalidate @submit.prevent="submit">
      <AccountTypePicker v-model="form.type" />

      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <AuthInput v-model="form.firstName" label="İsim" icon="pi pi-user" placeholder="İsim" autocomplete="given-name" :error="errors.firstName" />
        <AuthInput v-model="form.lastName" label="Soyisim" icon="pi pi-user" placeholder="Soyisim" autocomplete="family-name" :error="errors.lastName" />
      </div>

      <AuthInput
        v-model="form.email"
        label="E-posta"
        icon="pi pi-envelope"
        type="email"
        inputmode="email"
        autocomplete="email"
        placeholder="ornek@mail.com"
        :error="errors.email"
      />

      <AuthInput
        v-model="form.phone"
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

      <AuthInput
        v-model="form.password"
        label="Şifre"
        icon="pi pi-lock"
        placeholder="Şifrenizi oluşturun"
        autocomplete="new-password"
        password-toggle
        :error="errors.password"
      >
        <template #suffix>
          <button
            type="button"
            class="ml-1 rounded p-1 text-primary hover:bg-primary/10"
            title="Rastgele güçlü şifre"
            aria-label="Rastgele güçlü şifre oluştur"
            @click="rollPassword"
          >
            <i class="pi pi-lightbulb" style="font-size: 16px;"></i>
          </button>
        </template>
      </AuthInput>

      <AuthInput
        v-model="form.passwordConfirm"
        label="Şifre Tekrar"
        icon="pi pi-shield"
        placeholder="Şifrenizi tekrar girin"
        autocomplete="new-password"
        password-toggle
        :error="errors.passwordConfirm"
      />

      <div class="flex flex-col gap-2.5 text-sm text-slate-600">
        <label class="flex cursor-pointer select-none items-start gap-2.5">
          <input v-model="acceptUyelik" type="checkbox" class="mt-0.5 h-4 w-4 shrink-0 rounded border-gray-300 accent-[#00A0AE]" />
          <span class="leading-snug">
            <button type="button" class="font-semibold text-primary hover:underline" @click.prevent="legalDoc = 'uyelik'">Üyelik Sözleşmesi</button>'ni okudum ve kabul ediyorum.
          </span>
        </label>
        <label class="flex cursor-pointer select-none items-start gap-2.5">
          <input v-model="acceptKvkk" type="checkbox" class="mt-0.5 h-4 w-4 shrink-0 rounded border-gray-300 accent-[#00A0AE]" />
          <span class="leading-snug">
            <button type="button" class="font-semibold text-primary hover:underline" @click.prevent="legalDoc = 'kvkk'">KVKK Aydınlatma Metni</button>'ni okudum ve onaylıyorum.
          </span>
        </label>
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
        :disabled="loading || googleLoading || !acceptUyelik || !acceptKvkk"
      >
        <i v-if="loading" class="pi pi-spin pi-spinner"></i>
        <span v-else>Kayıt Ol</span>
      </button>

      <p class="text-center text-sm text-slate-500">
        Zaten hesabın var mı?
        <RouterLink to="/giris" class="font-bold text-primary hover:underline">Giriş Yap</RouterLink>
      </p>

      <div class="flex items-center gap-3" aria-hidden="true">
        <span class="h-px flex-1 bg-slate-300/70"></span>
        <span class="text-[13px] font-medium text-slate-400">ya da</span>
        <span class="h-px flex-1 bg-slate-300/70"></span>
      </div>

      <GoogleSignInButton label="Google ile Kayıt Ol" text="signup_with" :busy="googleLoading" @credential="handleGoogleCredential" />
    </form>

    <LegalTextModal v-model="legalDoc" :is-login="false" @confirm="onLegalConfirm" />
  </AuthShell>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { toast } from 'vue-sonner';
import AuthShell from '@/components/auth/AuthShell.vue';
import AuthInput from '@/components/auth/AuthInput.vue';
import AccountTypePicker from '@/components/auth/AccountTypePicker.vue';
import GoogleSignInButton from '@/components/auth/GoogleSignInButton.vue';
import LegalTextModal from '@/components/legal/LegalTextModal.vue';
import { useAuthStore } from '@/stores/auth';
import { useGoogleAuth } from '@/composables/useGoogleAuth';
import { firstApiError, formatTrPhoneInput, phoneDigits } from '@/lib/auth-ui';

const router = useRouter();
const authStore = useAuthStore();

const form = ref({
  type: 'vehicle_owner',
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  password: '',
  passwordConfirm: '',
});
const errors = ref({});
const submitError = ref('');
const loading = ref(false);
const acceptUyelik = ref(false);
const acceptKvkk = ref(false);
/** null | 'uyelik' | 'kvkk' — sözleşme metni önizlemesi */
const legalDoc = ref(null);

const { googleLoading, handleGoogleCredential } = useGoogleAuth();

function onLegalConfirm({ doc }) {
  if (doc === 'uyelik') acceptUyelik.value = true;
  if (doc === 'kvkk') acceptKvkk.value = true;
}

function validate() {
  const f = form.value;
  const next = {};
  if (!f.firstName.trim()) next.firstName = 'İsim zorunludur.';
  if (!f.lastName.trim()) next.lastName = 'Soyisim zorunludur.';
  if (!f.email.trim()) next.email = 'E-posta zorunludur.';
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.email.trim())) next.email = 'Geçerli bir e-posta giriniz.';
  if (phoneDigits(f.phone).length !== 10) next.phone = 'Telefon numarası 10 haneli olmalıdır.';
  if (!f.password.trim()) next.password = 'Şifre zorunludur.';
  else if (f.password.trim().length < 6) next.password = 'Şifre en az 6 karakter olmalıdır.';
  if (!f.passwordConfirm.trim()) next.passwordConfirm = 'Şifre tekrarı zorunludur.';
  else if (f.passwordConfirm !== f.password) next.passwordConfirm = 'Şifreler eşleşmiyor.';
  errors.value = next;
  return Object.keys(next).length === 0;
}

/** Sunucu alan adları → form alanları */
const FIELD_MAP = { first_name: 'firstName', last_name: 'lastName', password_confirm: 'passwordConfirm' };

async function submit() {
  submitError.value = '';
  if (!acceptUyelik.value || !acceptKvkk.value) {
    submitError.value = 'Kayıt için üyelik sözleşmesi ve KVKK metnini onaylamalısınız.';
    return;
  }
  if (!validate()) return;

  const f = form.value;
  loading.value = true;
  try {
    const result = await authStore.register({
      first_name: f.firstName.trim(),
      last_name: f.lastName.trim(),
      email: f.email.trim(),
      phone: phoneDigits(f.phone),
      password: f.password,
      password_confirm: f.passwordConfirm,
      type: f.type,
    });
    if (result.success && result.needOtp) {
      toast.success('Doğrulama kodu SMS ile gönderildi.');
      router.push({ path: '/telefon-dogrula', query: { phone: phoneDigits(result.email ?? f.phone), from: 'register' } });
      return;
    }
    if (result.success) {
      router.replace('/panel');
      return;
    }
    if (result.errorDetails && typeof result.errorDetails === 'object') {
      const next = { ...errors.value };
      for (const [key, value] of Object.entries(result.errorDetails)) {
        next[FIELD_MAP[key] || key] = Array.isArray(value) ? value[0] : value;
      }
      errors.value = next;
    }
    const msg = firstApiError(result, 'Kayıt olurken hata oluştu.');
    submitError.value = /validation\s*hatas/i.test(msg) ? 'Kayıt olurken hata oluştu.' : msg;
  } finally {
    loading.value = false;
  }
}

function generateStrongPassword() {
  const lower = 'abcdefghjkmnpqrstuvwxyz';
  const upper = 'ABCDEFGHJKMNPQRSTUVWXYZ';
  const numbers = '23456789';
  const symbols = '!@#$%&*';
  const all = lower + upper + numbers + symbols;
  const pick = (set) => set[Math.floor(Math.random() * set.length)];
  let pwd = pick(lower) + pick(upper) + pick(numbers) + pick(symbols);
  for (let i = 0; i < 8; i++) pwd += pick(all);
  return pwd.split('').sort(() => Math.random() - 0.5).join('');
}

/** Güçlü şifre üretip iki alana da yazar */
function rollPassword() {
  const pwd = generateStrongPassword();
  form.value.password = pwd;
  form.value.passwordConfirm = pwd;
}
</script>
