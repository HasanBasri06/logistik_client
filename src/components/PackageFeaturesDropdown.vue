<template>
  <!-- Paket kartının altında açılır / kapanır "Paket kullanım bilgileri" -->
  <div class="w-full" @click.stop @keydown.stop>
    <button
      type="button"
      class="w-full flex items-center justify-between gap-2 rounded-lg text-left font-semibold text-primary transition-colors hover:bg-primary/5"
      :class="compact ? 'px-1.5 py-1.5 text-[11px] sm:text-xs' : 'px-2 py-2 text-sm'"
      :aria-expanded="open"
      @click="open = !open"
    >
      <span class="flex items-center gap-1.5 min-w-0">
        <i class="pi pi-info-circle shrink-0" :style="{ fontSize: compact ? '11px' : '13px' }"></i>
        <span class="truncate">Paket kullanım bilgileri</span>
      </span>
      <i
        class="pi pi-chevron-down shrink-0 transition-transform duration-200"
        :class="{ 'rotate-180': open }"
        :style="{ fontSize: compact ? '9px' : '11px' }"
      ></i>
    </button>

    <Transition name="pkg-features">
      <ul v-if="open" class="flex flex-col" :class="compact ? 'gap-1.5 mt-1.5' : 'gap-2 mt-2'">
        <li
          v-for="f in PACKAGE_FEATURES"
          :key="f.title"
          class="flex items-start rounded-lg border"
          :class="[
            compact ? 'gap-2 p-1.5' : 'gap-2.5 p-2.5',
            isForMe(f) ? 'border-primary/30 bg-primary/5' : 'border-gray-100 bg-gray-50/70',
          ]"
        >
          <i :class="f.icon" class="text-primary shrink-0 mt-0.5" :style="{ fontSize: compact ? '11px' : '13px' }"></i>
          <div class="min-w-0 flex-1">
            <p class="font-semibold text-gray-900 leading-snug" :class="compact ? 'text-[11px]' : 'text-[13px]'">
              {{ f.title }}
            </p>
            <div class="mt-1 flex flex-wrap gap-1">
              <span
                v-for="r in f.roles"
                :key="r"
                class="rounded-full px-1.5 py-px font-bold uppercase tracking-wide"
                :class="[
                  compact ? 'text-[8px]' : 'text-[9px]',
                  r === 'vehicle_owner' ? 'bg-primary/10 text-primary' : 'bg-secondary/10 text-secondary',
                ]"
              >
                {{ ROLE_LABELS[r] }}
              </span>
            </div>
          </div>
          <i
            v-if="isForMe(f)"
            class="pi pi-check-circle text-primary shrink-0 mt-0.5"
            :style="{ fontSize: compact ? '11px' : '13px' }"
            title="Hesabına dahil"
          ></i>
        </li>
      </ul>
    </Transition>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue';
import { storeToRefs } from 'pinia';
import { useAuthStore } from '@/stores/auth';

defineProps({
  /** Modal içindeki küçük paket kartları için sıkı yerleşim */
  compact: { type: Boolean, default: false },
});

const ROLE_LABELS = {
  vehicle_owner: 'Araç sahibi',
  cargo_owner: 'Yük sahibi',
};

/** Paketin açtığı özellikler ve hangi hesap tipinin kullandığı (tüm paketlerde aynı) */
const PACKAGE_FEATURES = [
  { title: 'Mesaj gönderme', icon: 'pi pi-comments', roles: ['vehicle_owner', 'cargo_owner'] },
  { title: 'Arama ile iletişim', icon: 'pi pi-phone', roles: ['vehicle_owner'] },
  { title: 'Sınırsız ilan yükleme', icon: 'pi pi-box', roles: ['cargo_owner'] },
  { title: 'Yakındaki araçları görme', icon: 'pi pi-map-marker', roles: ['cargo_owner'] },
];

const open = ref(false);
const { user } = storeToRefs(useAuthStore());
const myType = computed(() => user.value?.type ?? null);

const isForMe = (f) => !!myType.value && f.roles.includes(myType.value);
</script>

<style scoped>
.pkg-features-enter-active,
.pkg-features-leave-active {
  transition: opacity 0.18s ease, transform 0.18s ease;
}
.pkg-features-enter-from,
.pkg-features-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}
</style>
