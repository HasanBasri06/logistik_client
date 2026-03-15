<template>
  <div
    class="w-full min-h-0 rounded-2xl bg-white border border-gray-200 overflow-hidden cursor-pointer transition-all duration-300 shadow-sm hover:border-primary hover:shadow-[0_4px_12px_rgba(57,131,140,0.15)] hover:-translate-y-0.5"
    @click="handleClick($event, shipment)"
  >
    <!-- Üst Bölüm: Nereden-Nereye ve Gidiş Saati -->
    <div class="flex flex-row justify-between items-center gap-3 py-4 px-4 sm:py-5 sm:px-6 border-b border-gray-100">
      <!-- Nereden-Nereye: mobilde [saatler] [ok] [yerler]; masaüstünde yatay -->
      <div class="flex flex-row items-stretch gap-0 sm:gap-4 flex-1 min-w-0">
        <!-- Mobil: saatler okun solunda -->
        <div class="flex flex-col justify-between gap-2 shrink-0 sm:hidden py-0.5 text-xs">
          <div class="inline-flex items-center py-0.5 px-2 rounded-full bg-primary/10">
            <span class=" font-semibold text-primary">{{ shipment?.departure_time ?? '—' }}</span>
          </div>
          <div class="inline-flex items-center py-0.5 px-2 rounded-full bg-primary/10">
            <span class=" font-semibold text-primary">{{ shipment?.time_arrival ?? '—' }}</span>
          </div>
        </div>
        <!-- Mobil: dikey çizgi ve aşağı ok -->
        <div class="flex flex-col  items-center shrink-0 w-5 sm:hidden">
          <div class="flex-1 min-h-5 flex justify-center">
            <div class="w-0.5 h-full rounded-full bg-primary/40"></div>
          </div>
          <ArrowDown class="w-3.5 h-3.5 text-primary/30 shrink-0  -mt-2 relative" />
        </div>
        <!-- İçerik: mobilde sadece yerler; masaüstünde nereden + saat, çizgi, nereye + saat -->
        <div class="flex flex-col sm:flex-row gap-2 sm:gap-4 flex-1 min-w-0 text-sm relative">
          <div class="flex flex-col gap-1.5 sm:gap-2 items-start w-auto min-w-0">
            <div class="font-semibold text-gray-900 leading-tight truncate max-w-full">{{ fromPlaceText }}</div>
            <div class="hidden sm:inline-flex items-center py-0.5 px-2 sm:py-1 sm:px-3 rounded-full bg-primary/10">
              <span class="text-xs font-semibold text-primary">{{ shipment?.departure_time ?? '—' }}</span>
            </div>
          </div>
          <!-- Masaüstü: yatay çizgi + süre + sağ ok -->
          <div class="hidden sm:flex flex-col items-center justify-center gap-0.5 sm:gap-1.5 shrink-0 sm:max-w-[100px] sm:flex-1">
            <div class="w-full h-0.5 rounded-full bg-linear-to-r from-primary to-primary/30"></div>
            <div class="text-[10px] sm:text-xs font-medium text-gray-500 whitespace-nowrap">{{ shipment?.hours ?? '—' }}</div>
            <ArrowRight class="w-3.5 h-3.5 sm:w-4 sm:h-4 text-primary shrink-0" />
          </div>
          <div class="flex flex-col gap-1.5 sm:gap-2 items-start min-w-0 sm:flex-1 absolute bottom-0 md:relative">
            <div class=" font-semibold text-gray-900 leading-tight truncate max-w-full">{{ toPlaceText }}</div>
            <div class="hidden sm:inline-flex items-center py-0.5 px-2 sm:py-1 sm:px-3 rounded-full bg-primary/10">
              <span class="text-xs font-semibold text-primary">{{ shipment?.time_arrival ?? '—' }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Ücret Badge -->
      <div
        class="inline-flex items-center py-1.5 px-3 text-sm sm:px-3.5 rounded-full bg-primary/10  sm:text-xs font-semibold text-primary whitespace-nowrap shrink-0 self-center"
      >{{ shipment?.price }}
      </div>
    </div>

    <!-- Alt Bölüm: Masaüstünde eski yatay düzen, mobilde grid + profil (mobilde her zaman açık) -->
    <div
      class="border-t border-gray-100 py-3 px-4 sm:px-6 sm:py-0 sm:h-20 min-h-0 sm:min-h-[72px] flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3"
    >
      <!-- Masaüstü: yatay satır (avatar, puan, ağırlık, tip, teklif, iptal) -->
      <div class="hidden sm:flex flex-wrap items-center gap-x-4 gap-y-0 flex-1 min-w-0">
        <div class="flex items-center gap-2 min-w-0">
          <div class="w-8 h-8 rounded-full border-[1.5px] border-primary overflow-hidden flex items-center justify-center bg-white shrink-0">
            <img :src="creatorAvatarUrl" :alt="shipment.creator?.full_name" class="w-full h-full object-cover" />
          </div>
          <span class="text-sm font-medium text-gray-600 truncate">{{ shipment.creator?.full_name }}</span>
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
        <div v-if="user.id == shipment.creater_id" class="flex items-center shrink-0">
          <div class="w-px h-5 bg-gray-200 mr-4"></div>
          <button class="bg-red-200 text-red-700 text-sm px-4 py-1 rounded-md cursor-pointer" @click.stop="handleCanceledBtn($event, shipment)">İptal Et</button>
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
        <template v-if="user.id == shipment.creater_id">
          <div class="flex justify-end text-end">
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
          <p class="text-sm font-semibold text-gray-900 truncate">{{ shipment.creator?.full_name }}</p>
        </div>
        <div class="flex items-center gap-1 shrink-0">
          <Star size="14" class="w-3.5 h-3.5 text-primary fill-primary" />
          <span class="text-sm font-semibold text-gray-800">{{ creatorScoreText }}</span>
        </div>
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
