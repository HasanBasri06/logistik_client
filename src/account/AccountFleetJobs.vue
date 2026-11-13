<template>
  <div class="flex flex-col h-full min-h-0 flex-1">
    <div class="flex items-center gap-3 mb-4">
      <RouterLink
        to="/vehicle-owner/orders"
        class="w-9 h-9 rounded-full border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-gray-50"
        aria-label="Tüm İşlerim'e dön"
      >
        <i class="pi pi-arrow-left text-sm"></i>
      </RouterLink>
      <h2 class="text-xl font-semibold text-gray-900">İşlerin Durumu</h2>
    </div>

    <div class="flex-1 overflow-y-auto pr-2">
      <div v-if="loading" class="flex justify-center py-16">
        <span class="w-8 h-8 border-2 border-gray-200 border-t-primary rounded-full animate-spin"></span>
      </div>
      <div v-else-if="!jobs.length" class="flex flex-col items-center justify-center py-16 gap-3 text-gray-500">
        <i class="pi pi-map text-4xl text-gray-300"></i>
        <p class="text-sm">Onaylanmış bir iş yok.</p>
      </div>

      <!-- Yolda (başlamış) en üstte, sonra onaylı ama başlamamış, en altta teslim edilenler -->
      <section v-for="section in sections" v-else :key="section.status" class="mb-6">
        <template v-if="section.items.length">
          <h3
            class="flex items-center gap-2 mb-3 text-base font-extrabold"
            :class="section.status === 'in_progress' ? 'text-primary' : 'text-slate-700'"
          >
            <i :class="['pi', section.icon]"></i>
            {{ section.title }}
            <span class="min-w-6 h-6 px-2 rounded-full bg-slate-100 text-slate-600 text-xs font-bold inline-flex items-center justify-center">
              {{ section.items.length }}
            </span>
          </h3>
          <div class="grid gap-4 md:grid-cols-2">
            <article
              v-for="job in section.items"
              :key="job.shipment_id"
              class="rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden flex flex-col"
              :class="job.status !== 'delivered' ? 'cursor-pointer hover:border-primary transition-colors' : ''"
              :role="job.status !== 'delivered' ? 'button' : undefined"
              @click="onCardClick(job)"
            >
              <div class="px-4 pt-4 pb-3">
                <p class="text-base font-bold text-gray-900 truncate">
                  {{ cityOf(job.from) }} <span class="text-primary">→</span> {{ cityOf(job.to) }}
                </p>
                <p class="text-xs text-gray-500 truncate">
                  {{ job.driver ? `Sürücü: ${job.driver.name}` : 'Sürücü: Siz' }}
                  <template v-if="job.car"> · {{ job.car.plate }}</template>
                </p>
              </div>

              <!-- Harita resim gibi: kaydırılmaz, tıklama karta geçer -->
              <LiveVehicleMap
                :from="job.from"
                :to="job.to"
                :vehicle="job.location ? { lat: job.location.lat, lng: job.location.lng } : null"
                :caption="captionOf(job)"
                :interactive="false"
                :vehicle-at-origin-when-unknown="false"
                vehicle-label="Aracım"
                :height="190"
                class="!rounded-none !border-x-0"
              />

              <div class="px-4 py-3 flex items-center justify-between gap-3">
                <span
                  class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold"
                  :class="statusMeta(job).class"
                >
                  <i :class="['pi text-[11px]', statusMeta(job).icon]"></i>
                  {{ statusMeta(job).label }}
                </span>
                <div v-if="job.documents.length" class="flex flex-wrap justify-end gap-1.5" @click.stop>
                  <a
                    v-for="doc in job.documents"
                    :key="doc.id"
                    :href="doc.url"
                    target="_blank"
                    rel="noopener"
                    class="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline"
                  >
                    <i class="pi pi-paperclip text-[11px]"></i>{{ doc.title || 'Belge' }}
                  </a>
                </div>
                <span v-else class="text-xs text-gray-400">Belge yok</span>
              </div>
            </article>
          </div>
        </template>
      </section>
    </div>
  </div>
</template>

<script setup>
/**
 * İşlerin Durumu (web): araç sahibinin onaylanan işleri — aracın son konumu haritada, teslim durumu, belgeler.
 * Mobil `vehicle-owner/fleet` ekranı ile aynı veri (`GET /vehicle/fleet-jobs`) ve bölümler.
 * Başlamamış işe tıklanınca "Tüm İşlerim"e gidilir (işi başlatma / başkasına verme orada).
 */
import { computed, onBeforeUnmount, onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import api from '@/api';
import LiveVehicleMap from '@/components/LiveVehicleMap.vue';

const router = useRouter();
const jobs = ref([]);
const loading = ref(true);
let timer = null;

const SECTIONS = [
  { status: 'in_progress', title: 'Yolda', icon: 'pi-send' },
  { status: 'pending', title: 'Onaylanan İşler', icon: 'pi-check-circle' },
  { status: 'delivered', title: 'Teslim Edilenler', icon: 'pi-verified' },
];
const sections = computed(() => SECTIONS.map((s) => ({ ...s, items: jobs.value.filter((j) => j.status === s.status) })));

const cityOf = (place) => String(place ?? '').split(' / ')[0] || '—';

function timeAgo(iso) {
  if (!iso) return '';
  const min = Math.round((Date.now() - new Date(iso).getTime()) / 60000);
  if (!Number.isFinite(min) || min < 0) return '';
  if (min < 1) return 'az önce';
  if (min < 60) return `${min} dk önce`;
  const h = Math.round(min / 60);
  return h < 24 ? `${h} sa önce` : `${Math.round(h / 24)} gün önce`;
}

function captionOf(job) {
  if (job.status === 'delivered') return 'Teslim edildi';
  if (job.status === 'pending') return 'Henüz başlatılmadı';
  if (job.current_city) {
    const seen = timeAgo(job.location?.at);
    return `${job.current_city} civarında${seen ? ` · ${seen}` : ''}`;
  }
  return job.location ? '' : 'Konum bekleniyor';
}

function statusMeta(job) {
  if (job.status === 'delivered') return { label: 'İş Teslim Edildi', icon: 'pi-check-circle', class: 'bg-emerald-50 text-emerald-700' };
  if (job.status === 'pending') return { label: 'Başlatılmayı Bekliyor', icon: 'pi-hourglass', class: 'bg-slate-100 text-slate-600' };
  return { label: 'Teslim Sürecinde', icon: 'pi-clock', class: 'bg-amber-50 text-amber-700' };
}

function onCardClick(job) {
  if (job.status === 'delivered') return;
  router.push('/vehicle-owner/orders');
}

async function load() {
  try {
    const res = await api.get('/vehicle/fleet-jobs');
    const list = res.data?.content?.jobs;
    jobs.value = Array.isArray(list) ? list : [];
  } catch (_) {
    /* ağ hatası: son liste kalır */
  } finally {
    loading.value = false;
  }
}

onMounted(() => {
  load();
  // Araç konumları ilerledikçe liste güncel kalsın
  timer = setInterval(load, 60_000);
});
onBeforeUnmount(() => clearInterval(timer));
</script>
