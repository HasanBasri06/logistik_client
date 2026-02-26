<template>
  <div
    class="w-full min-h-[175px] rounded-2xl bg-white border border-gray-200 overflow-hidden cursor-pointer transition-all duration-300 shadow-sm hover:border-primary hover:shadow-[0_4px_12px_rgba(57,131,140,0.15)] hover:-translate-y-0.5"
    @click="handleClick($event, shipment)"
  >
    <!-- Üst Bölüm: Nereden-Nereye ve Gidiş Saati -->
    <div class="flex justify-between items-center py-5 px-6 border-b border-gray-100 gap-4">
      <!-- Nereden-Nereye Bilgisi -->
      <div class="flex items-center gap-4 flex-1">
        <div class="flex flex-col gap-2 items-start">
          <div class="text-base font-semibold text-gray-900 leading-tight">{{ shipment.f_where_city }} / {{ shipment.f_where_district }}</div>
          <div class="inline-flex items-center py-1 px-3 rounded-full bg-primary/10">
            <span class="text-xs font-semibold text-primary">{{ shipment.departure_time }}</span>
          </div>
        </div>

        <div class="flex flex-col items-center gap-1.5 flex-1 max-w-[140px]">
          <div
            class="w-full h-0.5 rounded-full bg-gradient-to-r from-primary to-primary/30"
          ></div>
          <div class="text-xs font-medium text-gray-500 whitespace-nowrap">{{ shipment.hours }}</div>
          <ArrowRight class="w-4 h-4 text-primary shrink-0" />
        </div>

        <div class="flex flex-col gap-2 items-start">
          <div class="text-base font-semibold text-gray-900 leading-tight">{{ shipment.t_where_city }} / {{ shipment.t_where_district }}</div>
          <div class="inline-flex items-center py-1 px-3 rounded-full bg-primary/10">
            <span class="text-xs font-semibold text-primary">{{ shipment.time_arrival }}</span>
          </div>
        </div>
      </div>

      <!-- Ücret Badge -->
      <div
        class="inline-flex items-center py-1.5 px-3.5 rounded-full bg-primary/10 text-xs font-semibold text-primary whitespace-nowrap"
      >{{ shipment?.price }}
      </div>
    </div>

    <!-- Alt Bölüm: Kullanıcı Bilgileri ve Araç -->
    <div class="flex justify-between items-center px-6 h-20">
      <div class="flex items-center gap-6">
        <div class="flex items-center gap-2">
          <div
            class="w-8 h-8 rounded-full border-[1.5px] border-primary overflow-hidden flex items-center justify-center bg-white shrink-0">
            <img
              :src="creatorAvatarUrl"
              :alt="shipment.creator?.full_name"
              class="w-full h-full object-cover"
            />
          </div>
          <span class="text-sm font-medium text-gray-600">{{ shipment.creator?.full_name }}</span>
        </div>

        <div class="w-px h-5 bg-gray-200"></div>

        <div class="flex items-center gap-1">
          <span class="text-sm font-medium text-gray-600">{{ creatorScoreText }}</span>
          <Star size="14" class="text-primary fill-primary shrink-0" />
        </div>

        <div class="w-px h-5 bg-gray-200"></div>

        <div class="text-sm font-medium text-gray-600">20 Ton</div>

        <div class="w-px h-5 bg-gray-200"></div>
        
        <div class="text-sm font-medium text-gray-600">{{ shipment.post_type?.value }}</div>

        <div class="w-px h-5 bg-gray-200"></div>

        <span class="text-sm text-gray-500">{{ requestText }}</span>

        <div v-if="user.id == shipment.creater_id" class="flex gap-6">
           <div class="w-px h-5 bg-gray-200"></div>
          <button class="bg-red-200 text-red-700 text-sm px-4 py-1 rounded-md cursor-pointer" @click="handleCanceledBtn($event, shipment)">İptal Et</button>
        </div>

        
      </div>

      <div class="flex items-center justify-center gap-3">
        <span class="text-sm font-medium text-gray-600">{{ shipment.car?.name }} {{ carDetailValue }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router';
import { computed } from 'vue';
import { Star, ArrowRight } from 'lucide-vue-next';
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
