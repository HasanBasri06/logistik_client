<template>
  <div class="grid grid-cols-2 gap-3" role="radiogroup" aria-label="Hesap tipi">
    <button
      v-for="opt in OPTIONS"
      :key="opt.value"
      type="button"
      role="radio"
      :aria-checked="modelValue === opt.value"
      class="flex flex-col items-start gap-1 rounded-[14px] border-2 p-3.5 text-left transition-colors"
      :class="modelValue === opt.value ? 'border-primary bg-primary/5' : 'border-slate-200 bg-white hover:border-primary/40'"
      @click="$emit('update:modelValue', opt.value)"
    >
      <span class="flex w-full items-center justify-between">
        <i :class="[opt.icon, modelValue === opt.value ? 'text-primary' : 'text-slate-400']" style="font-size: 18px;"></i>
        <i v-if="modelValue === opt.value" class="pi pi-check-circle text-primary" style="font-size: 15px;"></i>
      </span>
      <span class="text-sm font-bold" :class="modelValue === opt.value ? 'text-primary' : 'text-slate-800'">{{ opt.label }}</span>
      <span class="text-xs leading-snug text-slate-500">{{ opt.hint }}</span>
    </button>
  </div>
</template>

<script setup>
defineProps({
  /** 'vehicle_owner' | 'cargo_owner' */
  modelValue: { type: String, required: true },
});
defineEmits(['update:modelValue']);

const OPTIONS = [
  { value: 'vehicle_owner', label: 'Araç Sahibi', hint: 'Yük bul, taşı, kazan', icon: 'pi pi-truck' },
  { value: 'cargo_owner', label: 'Yük Sahibi', hint: 'Yükünü taşıyacak araç bul', icon: 'pi pi-box' },
];
</script>
