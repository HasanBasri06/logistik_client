<template>
  <div
    class="w-full min-h-0 rounded-2xl bg-white border border-gray-200 overflow-hidden cursor-pointer transition-all duration-300 shadow-sm hover:border-primary hover:shadow-[0_4px_12px_rgba(57,131,140,0.15)] hover:-translate-y-0.5"
    @click="handleClick($event, shipment)"
  >
    <!-- Üst Bölüm: Nereden-Nereye ve Gidiş Saati -->
    <div class="flex flex-col sm:flex-row items-center sm:justify-between sm:items-center gap-3 py-4 px-4 sm:py-5 sm:px-6 border-b border-gray-100">
      <!-- Nereden-Nereye Bilgisi: mobilde dikey, masaüstünde yatay; ortada -->
      <div class="flex flex-col sm:flex-row items-center sm:items-center justify-center gap-2 sm:gap-4 flex-1 min-w-0">
        <div class="flex flex-col gap-1.5 sm:gap-2 items-center w-auto min-w-0">
          <div class="text-sm sm:text-base font-semibold text-gray-900 leading-tight truncate max-w-full text-center">{{ fromPlaceText }}</div>
          <div class="inline-flex items-center py-0.5 px-2 sm:py-1 sm:px-3 rounded-full bg-primary/10">
            <span class="text-xs font-semibold text-primary">{{ shipment?.departure_time ?? '—' }}</span>
          </div>
        </div>

        <!-- Mobil: dikey bağlayıcı | Masaüstü: yatay bağlayıcı -->
        <div class="flex flex-col sm:flex-row items-center justify-center gap-0.5 sm:gap-1.5 shrink-0 sm:max-w-[100px] sm:flex-1 py-0.5 sm:py-0">
          <div class="flex flex-col items-center gap-0.5 sm:hidden">
            <div class="w-0.5 h-3 rounded-full bg-primary/40"></div>
            <ArrowDown class="w-3.5 h-3.5 text-primary shrink-0" />
          </div>
          <div class="hidden sm:flex flex-col items-center justify-center gap-0.5 sm:gap-1.5 w-full">
            <div class="w-full h-0.5 rounded-full bg-linear-to-r from-primary to-primary/30"></div>
            <div class="text-[10px] sm:text-xs font-medium text-gray-500 whitespace-nowrap">{{ shipment?.hours ?? '—' }}</div>
            <ArrowRight class="w-3.5 h-3.5 sm:w-4 sm:h-4 text-primary shrink-0" />
          </div>
        </div>

        <div class="flex flex-col gap-1.5 sm:gap-2 items-center min-w-0">
          <div class="text-sm sm:text-base font-semibold text-gray-900 leading-tight truncate max-w-full text-center">{{ toPlaceText }}</div>
          <div class="inline-flex items-center py-0.5 px-2 sm:py-1 sm:px-3 rounded-full bg-primary/10">
            <span class="text-xs font-semibold text-primary">{{ shipment?.time_arrival ?? '—' }}</span>
          </div>
        </div>
      </div>

      <!-- Ücret Badge -->
      <div
        class="inline-flex items-center py-1.5 px-3 sm:px-3.5 rounded-full bg-primary/10 text-xs font-semibold text-primary whitespace-nowrap shrink-0 self-center"
      >{{ shipment?.price }}
      </div>
    </div>

    <!-- Alt Bölüm: Kullanıcı Bilgileri ve Araç -->
    <div class="flex flex-col sm:flex-row items-center sm:justify-between sm:items-center gap-3 py-3 px-4 sm:px-6 sm:h-20 sm:py-0 min-h-[72px]">
      <div class="flex flex-wrap items-center justify-center sm:justify-start gap-x-3 gap-y-2 sm:gap-x-4 sm:gap-y-0">
        <div class="flex items-center gap-2 min-w-0">
          <div
            class="w-7 h-7 sm:w-8 sm:h-8 rounded-full border-[1.5px] border-primary overflow-hidden flex items-center justify-center bg-white shrink-0"
          >
            <img
              :src="creatorAvatarUrl"
              :alt="shipment.creator?.full_name"
              class="w-full h-full object-cover"
            />
          </div>
          <span class="text-xs sm:text-sm font-medium text-gray-600 truncate">{{ shipment.creator?.full_name }}</span>
        </div>

        <div class="hidden sm:block w-px h-5 bg-gray-200 shrink-0"></div>

        <div class="flex items-center gap-1 shrink-0">
          <span class="text-xs sm:text-sm font-medium text-gray-600">{{ creatorScoreText }}</span>
          <Star size="12" class="w-3 h-3 sm:w-3.5 sm:h-3.5 text-primary fill-primary shrink-0" />
        </div>

        <div class="hidden sm:block w-px h-5 bg-gray-200 shrink-0"></div>

        <div class="text-xs sm:text-sm font-medium text-gray-600 shrink-0">{{ formatWeight(shipment.weight) }}</div>

        <div class="hidden sm:block w-px h-5 bg-gray-200 shrink-0"></div>

        <div class="text-xs sm:text-sm font-medium text-gray-600 shrink-0">{{ shipment.post_type?.value }}</div>

        <div class="hidden sm:block w-px h-5 bg-gray-200 shrink-0"></div>

        <span class="text-xs sm:text-sm text-gray-500 shrink-0">{{ requestText }}</span>

        <div v-if="user.id == shipment.creater_id" class="flex items-center shrink-0">
          <div class="hidden sm:block w-px h-5 bg-gray-200 mr-4"></div>
          <button class="bg-red-200 text-red-700 text-xs sm:text-sm px-3 sm:px-4 py-1 rounded-md cursor-pointer" @click="handleCanceledBtn($event, shipment)">İptal Et</button>
        </div>
      </div>

      <div class="flex items-center justify-center sm:justify-start min-w-0 w-full sm:w-auto">
        <span class="text-xs sm:text-sm font-medium text-gray-600 truncate text-center sm:text-left max-w-full">{{ shipment.car?.name }}{{ carDetailValue }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router';
import { computed } from 'vue';
import { Star, ArrowRight, ArrowDown } from 'lucide-vue-next';
import { useAuthStore } from '@/stores/auth';
import { storeToRefs } from 'pinia';

const authStore = useAuthStore();
const {user} = storeToRefs(authStore);

const props = defineProps({
    slug: {
        type: String,
        default: () => `post-${Math.random().toString(36).substr(2, 9)}`
    },
    shipment: {
        type: Object,
        default: () => ({})
    }
});

const router = useRouter();


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
    if (c?.image) return c.image;
    if (c?.avatar) return c.avatar;
    const name = c?.full_name || '?';
    return 'https://ui-avatars.com/api/?name=' + encodeURIComponent(name) + '&background=39838C&color=fff';
});

const handleClick = (e, shipment) => {
    if (user.value.id == shipment.creater_id) {
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

const handleCanceledBtn = (e, shipment) => {
  e.stopPropagation();

  console.log("shipment:", shipment);
};

</script>
