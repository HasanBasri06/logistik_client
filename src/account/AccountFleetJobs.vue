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
          <!-- Liste görünümü: her iş tek satır -->
          <ul class="rounded-2xl border border-gray-200 bg-white divide-y divide-gray-100 overflow-hidden">
            <li
              v-for="job in section.items"
              :key="job.shipment_id"
              class="flex flex-col md:flex-row md:items-center gap-3 md:gap-5 px-4 py-3.5 transition-colors"
              :class="job.status !== 'delivered' ? 'cursor-pointer hover:bg-gray-50' : ''"
              :role="job.status !== 'delivered' ? 'button' : undefined"
              @click="onCardClick(job)"
            >
              <!-- Güzergah -->
              <div class="flex items-center gap-3 md:w-[34%] min-w-0">
                <span
                  class="w-9 h-9 rounded-full flex items-center justify-center shrink-0"
                  :class="job.status === 'in_progress' ? 'bg-secondary/10 text-secondary' : job.status === 'delivered' ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-500'"
                >
                  <i :class="['pi text-sm', job.status === 'in_progress' ? 'pi-truck' : job.status === 'delivered' ? 'pi-check' : 'pi-hourglass']"></i>
                </span>
                <div class="min-w-0">
                  <p class="text-sm font-bold text-gray-900 truncate">
                    {{ cityOf(job.from) }} <span class="text-primary">→</span> {{ cityOf(job.to) }}
                  </p>
                  <p class="text-xs text-gray-500 truncate">
                    {{ districtOf(job.from) || '—' }} → {{ districtOf(job.to) || '—' }}
                  </p>
                </div>
              </div>

              <!-- Sürücü / plaka -->
              <div class="md:w-[20%] min-w-0 text-xs text-gray-600">
                <p class="truncate"><i class="pi pi-user text-[11px] mr-1 text-gray-400"></i>{{ job.driver ? job.driver.name : 'Siz' }}</p>
                <p v-if="job.car" class="truncate mt-0.5"><i class="pi pi-car text-[11px] mr-1 text-gray-400"></i>{{ job.car.plate }}</p>
              </div>

              <!-- Konum / ilerleme -->
              <div class="md:flex-1 min-w-0">
                <p class="text-xs font-semibold truncate" :class="job.status === 'in_progress' ? 'text-gray-800' : 'text-gray-400'">
                  {{ captionOf(job) || 'Yolda' }}
                </p>
                <div v-if="job.status === 'in_progress' && job.progress != null" class="mt-1.5 flex items-center gap-2">
                  <div class="h-1.5 flex-1 rounded-full bg-gray-100 overflow-hidden">
                    <div class="h-full rounded-full bg-secondary" :style="{ width: `${Math.min(100, Math.round(job.progress))}%` }"></div>
                  </div>
                  <span class="text-[11px] font-bold text-gray-600">%{{ Math.round(job.progress) }}</span>
                </div>
              </div>

              <!-- Durum -->
              <span
                class="self-start md:self-center inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold shrink-0"
                :class="statusMeta(job).class"
              >
                <i :class="['pi text-[11px]', statusMeta(job).icon]"></i>
                {{ statusMeta(job).label }}
              </span>

              <!-- Belgeler -->
              <div class="md:w-28 shrink-0 text-xs" @click.stop>
                <div v-if="job.documents.length" class="flex flex-col gap-0.5">
                  <a
                    v-for="doc in job.documents"
                    :key="doc.id"
                    :href="doc.url"
                    target="_blank"
                    rel="noopener"
                    class="inline-flex items-center gap-1 font-semibold text-primary hover:underline truncate"
                  >
                    <i class="pi pi-paperclip text-[11px]"></i>{{ doc.title || 'Belge' }}
                  </a>
                </div>
                <span v-else class="text-gray-400">Belge yok</span>
              </div>

              <i v-if="job.status !== 'delivered'" class="hidden md:block pi pi-chevron-right text-xs text-gray-300"></i>
            </li>
          </ul>
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
const districtOf = (place) => String(place ?? '').split(' / ')[1] ?? '';

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
