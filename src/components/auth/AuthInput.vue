<template>
  <label class="flex flex-col gap-2">
    <span class="text-[13px] font-semibold text-slate-700">{{ label }}</span>
    <span
      class="flex h-[52px] items-center rounded-[14px] border px-3.5 transition-colors"
      :class="[
        error ? 'border-red-400' : focused ? 'border-primary bg-white' : 'border-slate-200 bg-slate-50',
      ]"
    >
      <i :class="[icon, focused ? 'text-primary' : 'text-slate-400']" class="mr-2.5 shrink-0" style="font-size: 16px;"></i>
      <span v-if="prefix" class="mr-2 text-[15px] font-bold text-slate-500">{{ prefix }}</span>
      <input
        ref="inputRef"
        :value="modelValue"
        :type="passwordToggle ? (visible ? 'text' : 'password') : type"
        :placeholder="placeholder"
        :autocomplete="autocomplete"
        :inputmode="inputmode"
        :maxlength="maxlength"
        :disabled="disabled"
        class="h-full min-w-0 flex-1 bg-transparent text-[15px] font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none"
        @input="onInput"
        @focus="focused = true"
        @blur="focused = false"
      />
      <button
        v-if="passwordToggle"
        type="button"
        class="ml-2 rounded p-1 text-slate-400 hover:text-slate-600"
        :aria-label="visible ? 'Şifreyi gizle' : 'Şifreyi göster'"
        @click="visible = !visible"
      >
        <i :class="visible ? 'pi pi-eye-slash' : 'pi pi-eye'" style="font-size: 17px;"></i>
      </button>
      <slot name="suffix" />
    </span>
    <span v-if="error" class="text-xs font-medium text-red-600">{{ error }}</span>
  </label>
</template>

<script setup>
import { ref } from 'vue';

const props = defineProps({
  modelValue: { type: String, default: '' },
  label: { type: String, required: true },
  /** PrimeIcons sınıfı, ör. `pi pi-phone` */
  icon: { type: String, required: true },
  type: { type: String, default: 'text' },
  placeholder: { type: String, default: '' },
  autocomplete: { type: String, default: undefined },
  inputmode: { type: String, default: undefined },
  maxlength: { type: [Number, String], default: undefined },
  disabled: { type: Boolean, default: false },
  error: { type: String, default: '' },
  /** Telefon için "+90" */
  prefix: { type: String, default: '' },
  passwordToggle: { type: Boolean, default: false },
  /** Yazılan değeri biçimlendir (ör. telefon "5XX XXX XX XX") */
  format: { type: Function, default: null },
});
const emit = defineEmits(['update:modelValue']);

const focused = ref(false);
const visible = ref(false);
const inputRef = ref(null);

function onInput(e) {
  const raw = e.target.value;
  const next = props.format ? props.format(raw) : raw;
  if (next !== raw) e.target.value = next;
  emit('update:modelValue', next);
}

defineExpose({ focus: () => inputRef.value?.focus() });
</script>
