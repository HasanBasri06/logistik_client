<template>
  <button
    type="button"
    role="switch"
    :aria-checked="modelValue"
    :aria-label="label"
    class="relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 cursor-pointer"
    :class="modelValue ? 'bg-primary' : 'bg-gray-300'"
    @click="$emit('update:modelValue', !modelValue)"
  >
    <span
      class="inline-block h-5 w-5 rounded-full bg-white shadow transition-transform"
      :class="modelValue ? 'translate-x-5.5' : 'translate-x-0.5'"
    />
  </button>
</template>

<script setup>
/** Kaydırmalı aç / kapa anahtarı (v-model) */
defineProps({
  modelValue: { type: Boolean, default: false },
  label: { type: String, default: undefined },
});
defineEmits(['update:modelValue']);
</script>
