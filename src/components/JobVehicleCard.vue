<template>
  <div class="rounded-xl border border-gray-200 bg-slate-50 p-4 flex flex-col gap-3">
    <div class="flex items-center gap-3">
      <div class="flex-1 min-w-0">
        <p class="text-[10px] font-extrabold tracking-wider text-slate-400">YÜKÜNÜZÜ TAŞIYACAK ARAÇ</p>
        <p class="text-[15px] font-extrabold text-slate-900 truncate">{{ vehicleName }}</p>
      </div>
      <!-- Türk plakası görünümü -->
      <div v-if="plate" class="flex items-stretch rounded-md border-[1.5px] border-slate-900 overflow-hidden bg-white shrink-0">
        <span class="px-1 flex items-center bg-blue-700 text-white text-[9px] font-extrabold">TR</span>
        <span class="px-2 py-0.5 text-sm font-extrabold tracking-wide text-slate-900">{{ plate }}</span>
      </div>
    </div>

    <!-- Kasası açık tenteli tır: yük kasanın içinde, kapladığı yer kadar dolu -->
    <div v-if="opened" class="relative w-full">
      <img :src="opened.src" alt="Araç" class="w-full h-auto block select-none" draggable="false" />
      <div
        v-if="loadPct != null"
        class="absolute"
        :style="{
          left: `${opened.cargo.left * 100}%`,
          top: `${opened.cargo.top * 100}%`,
          width: `${(opened.cargo.right - opened.cargo.left) * 100}%`,
          height: `${(opened.cargo.bottom - opened.cargo.top) * 100}%`,
        }"
      >
        <div
          class="absolute left-0 top-0 bottom-0 flex items-center justify-center border-2 border-primary bg-primary/35 rounded-sm"
          :style="{ width: `${loadPct}%` }"
        >
          <span v-if="loadPct >= 8" class="text-white text-sm font-extrabold drop-shadow">%{{ loadPct }}</span>
        </div>
      </div>
    </div>
    <!-- Diğer araçlar: görsel + doluluk çubuğu -->
    <template v-else>
      <img v-if="vehicleImage" :src="vehicleImage" alt="Araç" class="w-full max-h-32 object-contain" />
      <div v-if="loadPct != null" class="h-3 w-full rounded-full bg-slate-200 overflow-hidden">
        <div class="h-full rounded-full bg-primary" :style="{ width: `${loadPct}%` }"></div>
      </div>
    </template>

    <p class="text-center text-[13px] font-bold text-slate-900">
      <template v-if="loadPct != null">
        Yükünüz ({{ loadKgText }} kg) aracın %{{ loadPct }}'ini kaplıyor
      </template>
      <template v-else>Aracın kapasitesi bilinmediği için doluluk hesaplanamadı</template>
    </p>
  </div>
</template>

<script setup>
/**
 * Yük sahibinin ilan detayında (onaylanmış iş): yükü taşıyacak araç, plakası ve yükünün araçta kapladığı yer.
 * Mobil `LoadedVehicleArt` ile aynı mantık: yük (kg) / araç kapasitesi (kg).
 */
import { computed } from 'vue';
import { vehicleImageUrl } from '@/lib/catalog-assets';
import openedTenteli from '@/assets/images/vehicles/opened/tır_tenteli.png';

const props = defineProps({
  /** user_cars kaydı: { plate, capacity_kg, car: { name, image }, car_detail: { value, image } } */
  vehicle: { type: Object, required: true },
  /** İlanın ağırlığı ("1.500 kg", "2,5 ton" ya da sayı) */
  weight: { type: [String, Number], default: null },
});

/** Uygulamaya gömülü kasası açık tenteli tır (kafalı) — sunucuda görsel yoksa; iç alan görsele oranla */
const BUNDLED_TENTELI_CARGO = { left: 0.244, top: 0.071, right: 0.965, bottom: 0.689 };

/**
 * Sunucudaki kasası açık görseller (`assets/vehicles/opened_images`, 2172×724, yalnızca dorse): kasa iç alanı
 * görsel üzerinde ölçüldü (mobil `SERVER_OPENED_CARGO` ile aynı). Yeni görsel eklenince ölçüsü buraya eklenir.
 */
const SERVER_OPENED_CARGO = {
  'tır_tenteli.png': { left: 125 / 2172, top: 75 / 724, right: 2070 / 2172, bottom: 465 / 724 },
  'tır_damper.png': { left: 260 / 2172, top: 140 / 724, right: 1870 / 2172, bottom: 425 / 724 },
  'termokin_tır.png': { left: 210 / 2172, top: 75 / 724, right: 2090 / 2172, bottom: 480 / 724 },
};
/** Dosya adı anahtarı: klasörsüz, küçük harf, "tir" → "tır" */
const fileKey = (name) =>
  (String(name ?? '').split(/[/\\]/).pop() ?? '').toLocaleLowerCase('tr-TR').replace(/t[iı]r/g, 'tır');

const detailImage = computed(() => props.vehicle?.car_detail?.image || '');
const vehicleName = computed(
  () => [props.vehicle?.car?.name, props.vehicle?.car_detail?.value].filter(Boolean).join(' / ') || 'Araç'
);
const plate = computed(() => {
  const raw = String(props.vehicle?.plate ?? '').toLocaleUpperCase('tr-TR').replace(/\s+/g, '');
  const m = raw.match(/^(\d{2})([A-ZÇĞİÖŞÜ]{1,3})(\d{2,4})$/u);
  return m ? `${m[1]} ${m[2]} ${m[3]}` : raw;
});
/** Kasası açık görsel ve kasa iç alanı: önce sunucudaki (opened_images), yoksa gömülü tenteli */
const opened = computed(() => {
  const key = fileKey(detailImage.value || props.vehicle?.car?.image);
  const serverCargo = SERVER_OPENED_CARGO[key];
  if (props.vehicle?.opened_image && serverCargo) return { src: props.vehicle.opened_image, cargo: serverCargo };
  if (key === 'tır_tenteli.png') return { src: openedTenteli, cargo: BUNDLED_TENTELI_CARGO };
  return null;
});
const vehicleImage = computed(() => vehicleImageUrl(detailImage.value || props.vehicle?.car?.image || ''));

/** "1.500 kg" / "2,5 ton" → kg */
const loadKg = computed(() => {
  const str = String(props.weight ?? '').trim().toLocaleLowerCase('tr-TR');
  const m = str.match(/[\d.,]+/);
  if (!m) return null;
  const n = parseFloat(m[0].replace(/\./g, '').replace(',', '.'));
  if (!Number.isFinite(n)) return null;
  return /ton/.test(str) ? n * 1000 : n;
});
const loadKgText = computed(() => Math.round(loadKg.value ?? 0).toLocaleString('tr-TR'));
const loadPct = computed(() => {
  const cap = Number(props.vehicle?.capacity_kg);
  if (!loadKg.value || loadKg.value <= 0 || !Number.isFinite(cap) || cap <= 0) return null;
  return Math.min(100, Math.max(1, Math.round((loadKg.value / cap) * 100)));
});
</script>
