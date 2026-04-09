<template>
  <div
    class="w-full min-h-fit rounded-2xl bg-white border border-gray-200 overflow-hidden cursor-pointer transition-all duration-300 shadow-sm hover:border-primary hover:shadow-[0_4px_12px_rgba(57,131,140,0.15)] hover:-translate-y-0.5"
    @click="handleClick($event, shipment)"
  >
    
    <!-- Üst Bölüm: Nereden-Nereye ve Gidiş Saati -->
    <div
      class="flex flex-row justify-between items-start gap-4 py-5 px-4 sm:py-6 sm:px-6 border-b border-gray-100"
    >
      <!-- Nereden-Nereye: mobilde [saatler] [ok] [yerler]; masaüstünde yatay -->
      <div class="flex flex-row items-stretch gap-0 sm:gap-4 flex-1 min-w-0">
        <!-- Mobil: saatler okun solunda -->
        <div class="flex flex-col justify-between gap-2 shrink-0 sm:hidden py-0.5 text-xs">
          <div class="inline-flex items-center h-5 px-2 rounded-full bg-primary/10" v-if="shipment?.departure_time">
            <span class=" font-semibold text-primary">{{ shipment?.departure_time ?? '' }}</span>
          </div>
          <div class="inline-flex items-center h-5 px-2 rounded-full bg-primary/10" v-if="shipment?.time_arrival">
            <span class=" font-semibold text-primary">{{ shipment?.time_arrival ?? '' }}</span>
          </div>
        </div>
        <!-- Mobil: dikey çizgi ve aşağı ok -->
        <div class="flex flex-col  items-center shrink-0 w-5 sm:hidden">
          <div class="flex-1 min-h-5 flex justify-center">
            <div class="w-0.5 h-full rounded-full bg-primary/60"></div>
          </div>
          <ArrowDown class="w-3.5 h-3.5 text-primary/60 shrink-0  -mt-2 relative" />
        </div>
        <!-- İçerik: mobilde dikey; sm+ yatay — üst hizalı + orta sütun dikey ortalı (panel ile aynı okunabilirlik) -->
        <div class="flex flex-col sm:flex-row sm:items-start gap-3 sm:gap-5 flex-1 min-w-0 text-sm relative min-h-0">
          <div class="flex flex-col gap-2 sm:gap-2.5 items-start w-auto min-w-0">
            <div class="font-semibold text-gray-900 leading-snug truncate max-w-full">{{ fromPlaceText }}</div>
            <div class="hidden sm:inline-flex items-center py-1 px-2.5 sm:px-3 rounded-full bg-primary/10">
              <span class="text-xs font-semibold text-primary">{{ shipment?.departure_time ?? 'belirtilmemiş' }}</span>
            </div>
          </div>
          <!-- Masaüstü: yatay çizgi + süre + sağ ok (yüksek sütunlar arasında görsel olarak ortada) -->
          <div
            class="hidden sm:flex flex-col items-center justify-center gap-1 shrink-0 w-[100px] sm:w-[120px] self-center"
          >
            <div class="w-full h-0.5 rounded-full bg-linear-to-r from-primary to-primary/30"></div>
            <div class="text-[10px] sm:text-xs font-medium text-gray-500 whitespace-nowrap text-center px-0.5">
              {{ shipment?.hours ?? 'belirtilmemiş' }}
            </div>
            <ArrowRight class="w-3.5 h-3.5 sm:w-4 sm:h-4 text-primary shrink-0" />
          </div>
          <div class="flex flex-col gap-2 sm:gap-2.5 items-start min-w-0 sm:flex-1 relative">
            <div class="font-semibold text-gray-900 leading-snug truncate max-w-full">{{ toPlaceText }}</div>
            <div class="hidden sm:inline-flex items-center py-1 px-2.5 sm:px-3 rounded-full bg-primary/10">
              <span class="text-xs font-semibold text-primary">{{ shipment?.time_arrival ?? 'belirtilmemiş' }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Ücret + masaüstünde İptal (solda); mobilde yalnızca fiyat — İptal altta grid’de -->
      <div class="flex flex-row items-center gap-2 sm:gap-3 shrink-0 self-start pt-0.5 sm:pt-1">
        <button
          v-if="showOwnerCancelButton"
          type="button"
          class="hidden sm:inline-flex bg-red-200 text-red-700 text-sm px-4 py-1 rounded-md cursor-pointer"
          @click.stop="handleCanceledBtn($event, shipment)"
        >
          İptal Et
        </button>
        <div
          class="inline-flex items-center py-1.5 px-3 text-sm sm:px-3.5 rounded-full bg-primary/10 sm:text-xs font-semibold text-primary whitespace-nowrap"
        >
          {{ shipment?.price }}
        </div>
      </div>
    </div>

    <!-- Alt Bölüm: Masaüstünde eski yatay düzen, mobilde grid + profil (mobilde her zaman açık) -->
    <div
      class="border-t border-gray-100 py-3 px-4 sm:px-6 sm:py-0 sm:h-20 min-h-0 sm:min-h-[72px] flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3"
    >
      <!-- Masaüstü: yatay satır (avatar, puan, ağırlık, tip, teklif, iptal) -->
      <div class="hidden sm:flex flex-wrap items-center gap-x-4 gap-y-0 flex-1 min-w-0">
        <div class="flex items-center gap-2 min-w-0">
          <div class="w-8 h-8 rounded-full border-[1.5px] relative border-primary flex items-center justify-center bg-white shrink-0">
            <div v-if="shipment.creator?.verified == 1" class="w-5 h-5 bg-white absolute -top-2 -right-2 rounded-full flex items-center justify-center">
              <i class="pi pi-verified text-blue-500"></i>
            </div>
            <img :src="creatorAvatarUrl" :alt="shipment.creator?.full_name" class="w-full rounded-full h-full object-cover" />
          </div>

          <span class="text-sm font-medium text-gray-600 truncate">{{ creatorDisplayName }}</span>
        </div>
        <div class="w-px h-5 bg-gray-200 shrink-0"></div>
        <div class="flex items-center gap-1 shrink-0">
          <span class="text-sm font-medium text-gray-600">{{ creatorScoreText }}</span>
          <Star size="12" class="w-3.5 h-3.5 text-primary fill-primary shrink-0" />
        </div>
        <div class="w-px h-5 bg-gray-200 shrink-0"></div>
        <div class="text-sm font-medium text-gray-600 shrink-0">{{ formatWeight(shipment.weight) }}</div>
        <div class="w-px h-5 bg-gray-200 shrink-0"></div>
        <div class="text-sm font-medium text-gray-600 shrink-0">{{ shipment.post_type?.value }}</div>
        <div class="w-px h-5 bg-gray-200 shrink-0"></div>
        <span class="text-sm text-gray-500 shrink-0">{{ requestText }}</span>
        <div v-if="showOwnerNotLiveBadge" class="flex items-center shrink-0">
          <div class="w-px h-5 bg-gray-200 mr-4"></div>
          <span
            class="inline-flex items-center rounded-full bg-slate-100 text-slate-800 border border-slate-200 px-3 py-1 text-xs font-semibold"
          >
            İlanınız şu an yayında değildir
          </span>
        </div>
      </div>
      <div class="hidden sm:flex items-center min-w-0 shrink-0">
        <span class="text-sm font-medium text-gray-600 truncate">{{ shipment.car?.name }}{{ carDetailValue }}</span>
      </div>

      <!-- Mobil: grid-cols-2 detay listesi (sağ sütun yazıları align-end) -->
      <div class="grid grid-cols-2 gap-x-3 gap-y-2 order-1 min-w-0 sm:hidden">
        <div class="text-sm text-gray-600">
          <span class="text-gray-400 font-medium">Ağırlık</span>
          <span class="ml-1 font-medium text-gray-800">{{ formatWeight(shipment.weight) }}</span>
        </div>
        <div class="inline-flex items-center justify-end w-full text-end">
          <span class="inline-flex px-2.5 py-1 rounded-full bg-gray-100 text-gray-700 text-sm font-medium">{{ shipment.post_type?.value }}</span>
        </div>
        <p class="text-sm text-gray-500 min-w-0">{{ requestText }}</p>
        <p class="text-sm font-medium text-gray-700 truncate min-w-0 text-end">{{ shipment.car?.name }}{{ carDetailValue }}</p>
        <template v-if="showOwnerNotLiveBadge">
          <div class="col-span-2 flex justify-end">
            <span
              class="inline-flex items-center rounded-full bg-slate-100 text-slate-800 border border-slate-200 px-3 py-1.5 text-xs font-semibold"
            >
              İlanınız şu an yayında değildir
            </span>
          </div>
        </template>
        <template v-else-if="showOwnerCancelButton">
          <div class="flex md:justify-end text-end">
            <button class="bg-red-100 hover:bg-red-200 text-red-700 text-sm font-medium px-3 py-1.5 rounded-lg transition-colors cursor-pointer" @click.stop="handleCanceledBtn($event, shipment)">İptal Et</button>
          </div>
        </template>
      </div>

      <!-- Mobil: Yayınlayan profil + puan (en altta) -->
      <div class="flex items-center gap-3 py-2.5 px-3 rounded-xl bg-gray-50/80 border border-gray-100 order-2 sm:hidden">
        <div class="w-9 h-9 rounded-full border-2 border-primary/20 overflow-hidden flex items-center justify-center bg-white shrink-0 shadow-sm">
          <img :src="creatorAvatarUrl" :alt="shipment.creator?.full_name" class="w-full h-full object-cover" />
        </div>
        <div class="min-w-0 flex-1">
          <p class="text-xs font-medium text-gray-500 uppercase tracking-wide">Yayınlayan</p>
          <p class="text-sm font-semibold text-gray-900 truncate">{{ creatorDisplayName }}</p>
        </div>
        <div class="flex items-center gap-1 shrink-0">
          <Star size="14" class="w-3.5 h-3.5 text-primary fill-primary" />
          <span class="text-sm font-semibold text-gray-800">{{ creatorScoreText }}</span>
        </div>
      </div>
    </div>
  </div>

  <!-- İptal Onay Modali -->
  <Teleport to="body">
    <Transition name="modal">
      <div
        v-if="cancelModalOpen"
        class="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 px-4"
        role="dialog"
        aria-modal="true"
      >
        <div class="w-full max-w-md bg-white rounded-2xl shadow-xl p-5 sm:p-6">
          <h2 class="text-lg font-semibold text-gray-900 mb-1">İlanı iptal et</h2>
          <p class="text-sm text-gray-600 mb-4">
            Lütfen iptal nedenini seçin. Bu bilgi hizmet kalitesini artırmak için kullanılacaktır.
          </p>

          <label class="block text-sm font-medium text-gray-700 mb-2">Nedeni</label>
          <select
            v-model="cancelReason"
            :class="[
              'w-full rounded-lg border px-3 py-2 text-sm text-gray-800 focus:outline-none focus:ring-2 mb-3',
              cancelReason
                ? 'border-red-400 focus:ring-red-200 focus:border-red-500 text-red-700'
                : 'border-gray-300 focus:ring-red-200 focus:border-red-500'
            ]"
          >
            <option value="" disabled>Bir neden seçin</option>
            <option v-for="reason in cancelReasons" :key="reason" :value="reason">
              {{ reason }}
            </option>
          </select>

          <div v-if="cancelReason === 'Diğer'" class="mb-3">
            <label class="block text-sm font-medium text-gray-700 mb-1">Diğer neden</label>
            <textarea
              v-model="cancelOtherReason"
              rows="3"
              class="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-red-200 focus:border-red-500 resize-none"
              placeholder="Kısaca açıklayın..."
            />
          </div>

          <div class="flex justify-end gap-2 mt-4">
            <button
              type="button"
              class="px-4 py-2 rounded-lg border border-gray-200 text-gray-700 text-sm font-medium hover:bg-gray-50 transition-colors"
              @click="cancelModalOpen = false"
              :disabled="cancelSubmitting"
            >
              Vazgeç
            </button>
            <button
              type="button"
              class="px-4 py-2 rounded-lg bg-red-600 text-white text-sm font-semibold hover:bg-red-700 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
              @click="submitCancel"
              :disabled="cancelSubmitting || !cancelReason || (cancelReason === 'Diğer' && !cancelOtherReason.trim())"
            >
              {{ cancelSubmitting ? 'İptal ediliyor...' : 'İptal et' }}
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { useRouter, useRoute } from 'vue-router';
import { ref, computed } from 'vue';
import { Star, ArrowRight, ArrowDown } from 'lucide-vue-next';
import { useAuthStore } from '@/stores/auth';
import { storeToRefs } from 'pinia';
import api from '@/api';

const authStore = useAuthStore();
const {user} = storeToRefs(authStore);

const emit = defineEmits(['canceled', 'card-click']);

const props = defineProps({
    slug: {
        type: String,
        default: () => `post-${Math.random().toString(36).substr(2, 9)}`
    },
    shipment: {
        type: Object,
        default: () => ({})
    },
    preventNavigation: {
        type: Boolean,
        default: false,
    }
});

const router = useRouter();
const route = useRoute();

/** Kendi ilanı — `/product/:slug` sayfasında iptal yok; aktif değilse “yayında değildir” rozeti */
const isListingOwner = computed(
  () => user.value?.id != null && Number(user.value.id) === Number(props.shipment?.creater_id)
);
const isProductDetailRoute = computed(() => route.path.startsWith('/product/'));
const showOwnerNotLiveBadge = computed(
  () =>
    isListingOwner.value &&
    isProductDetailRoute.value &&
    props.shipment?.status != null &&
    props.shipment.status !== 'active'
);
const showOwnerCancelButton = computed(
  () => isListingOwner.value && props.shipment?.status === 'active' && !isProductDetailRoute.value
);

// UserSection.vue ile aynı: resim yoksa ui-avatars.com API'sinden avatar
const fromPlaceText = computed(() => {
  const s = props.shipment;
  if (!s) return '—';
  const city = s.f_where_city ?? '';
  const district = s.f_where_district ?? '';
  if (!city && !district) return '—';
  return district ? `${city} / ${district}` : city;
});

const toPlaceText = computed(() => {
  const s = props.shipment;
  if (!s) return '—';
  const city = s.t_where_city ?? '';
  const district = s.t_where_district ?? '';
  if (!city && !district) return '—';
  return district ? `${city} / ${district}` : city;
});

const creatorAvatarUrl = computed(() => {
  const c = props.shipment?.creator;
  const profileImg = c?.profile_image;
  if (c && profileImg != null && profileImg !== '') {
    const s = String(profileImg).trim();
    if (/^https?:\/\//i.test(s)) return s;
    const base = (import.meta.env.VITE_APP_SERVER_URL || '').replace(/\/$/, '');
    if (s.startsWith('/')) return base + s;
    return `${base}/storage/${s}`;
  }
  if (c?.image) return c.image;
  if (c?.avatar) return c.avatar;
  const name = c?.full_name || '?';
  return 'https://ui-avatars.com/api/?name=' + encodeURIComponent(name) + '&background=39838C&color=fff';
});

const handleClick = (e, shipment) => {
    if (props.preventNavigation) {
        emit('card-click', shipment);
        return;
    }
    const isOwner = user.value?.id == shipment?.creater_id;
    if (isOwner) {
        router.push(`/product/${props.slug}`);
    } else {
        router.push(`/posts/${props.slug}`);
    }
};

const requestText = computed(() => {
  if (props.shipment?.requests?.length > 0) {
    return props.shipment?.requests?.length + ' kişi teklif verdi';
  } else {
    return 'İlk teklif veren ol';
  }
});

const creatorScoreText = computed(() => {
  const score = props.shipment?.creator?.comments_avg_score;
  if (score == null || score === '') return '0';
  const num = Number(score);
  if (Number.isNaN(num)) return '—';
  return num.toLocaleString('tr-TR', { minimumFractionDigits: 1, maximumFractionDigits: 1 });
});

const creatorDisplayName = computed(() => {
  const creator = props.shipment?.creator;
  if (!creator) return '—';
  return Number(creator.payment_confirm) === 1
    ? (creator.full_name || creator.fullNameOnlyFirstChars || '—')
    : (creator.fullNameOnlyFirstChars || creator.full_name || '—');
});

function formatWeight(weight) {
  if (weight == null || weight === '') return '—';
  const num = typeof weight === 'number' ? weight : Number(String(weight).replace(/\s/g, '').replace(',', '.'));
  if (Number.isNaN(num)) return String(weight).trim() || '—';
  if (num >= 1000) {
    const ton = num / 1000;
    return (ton % 1 === 0 ? ton : ton.toLocaleString('tr-TR', { minimumFractionDigits: 0, maximumFractionDigits: 1 })) + ' ton';
  }
  return num.toLocaleString('tr-TR', { minimumFractionDigits: 0, maximumFractionDigits: 0 }) + ' kg';
}

const carDetailValue = computed(() => {
  const val = props.shipment?.get_car_detail?.value ?? props.shipment?.car?.details?.[0]?.value ?? '';
  const str = String(val).trim();
  if (!str) return '';
  return '/ ' + str.charAt(0).toUpperCase() + str.slice(1);
});

const cancelModalOpen = ref(false);
const cancelReason = ref('');
const cancelOtherReason = ref('');
const cancelSubmitting = ref(false);

const cancelReasons = [
  'Yük artık taşınmayacak',
  'Yanlış bilgi ile ilan açtım',
  'Farklı bir firma ile anlaştım',
  'Fiyat / şartlar değişti',
  'Diğer'
];

const handleCanceledBtn = (e, shipment) => {
  e.stopPropagation();
  if (!shipment?.id) return;
  cancelReason.value = '';
  cancelOtherReason.value = '';
  cancelModalOpen.value = true;
};

const selectedReasonText = computed(() => {
  if (!cancelReason.value) return '';
  if (cancelReason.value === 'Diğer') {
    return cancelOtherReason.value?.trim() || 'Diğer';
  }
  return cancelReason.value;
});

const submitCancel = async () => {
  if (!props.shipment?.id || cancelSubmitting.value) return;
  if (!cancelReason.value) return;
  if (cancelReason.value === 'Diğer' && !cancelOtherReason.value.trim()) return;

  try {
    cancelSubmitting.value = true;
    await api.post(`/shipments/${props.shipment.id}/cancel`, {
      reason: selectedReasonText.value
    });
    cancelModalOpen.value = false;
    emit('canceled', props.shipment.id);
  } catch (err) {
    console.error(err);
  } finally {
    cancelSubmitting.value = false;
  }
};

</script>
