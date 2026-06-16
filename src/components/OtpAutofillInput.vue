<template>
    <div
        class="relative w-full"
        :class="rootClass"
        @click="focusInput"
    >
        <div
            class="flex gap-2 flex-wrap justify-center pointer-events-none"
            role="group"
            :aria-label="ariaLabel"
        >
            <div
                v-for="i in length"
                :key="i - 1"
                :class="[
                    'w-11 h-12 sm:w-12 sm:h-14 rounded-md text-lg text-center font-semibold border bg-white text-gray-700 flex items-center justify-center tabular-nums',
                    invalid ? 'border-red-400' : 'border-gray-200',
                    focused && modelValue.length === i - 1 && modelValue.length < length
                        ? 'ring-2 ring-primary/20 border-primary'
                        : ''
                ]"
            >
                {{ modelValue[i - 1] ?? '' }}
            </div>
        </div>
        <input
            ref="inputRef"
            :value="modelValue"
            type="text"
            inputmode="numeric"
            autocomplete="one-time-code"
            :maxlength="length"
            :disabled="disabled"
            class="absolute inset-0 w-full h-full opacity-0 cursor-text z-10"
            :aria-label="ariaLabel"
            @input="onInput"
            @focus="focused = true"
            @blur="focused = false"
        />
    </div>
</template>

<script setup>
import { ref } from 'vue';

const props = defineProps({
    modelValue: { type: String, default: '' },
    length: { type: Number, default: 6 },
    disabled: { type: Boolean, default: false },
    invalid: { type: Boolean, default: false },
    ariaLabel: { type: String, default: 'Doğrulama kodu' },
    rootClass: { type: String, default: '' },
});

const emit = defineEmits(['update:modelValue']);

const inputRef = ref(null);
const focused = ref(false);

function focusInput() {
    if (!props.disabled) inputRef.value?.focus();
}

function onInput(event) {
    const digits = event.target.value.replace(/\D/g, '').slice(0, props.length);
    emit('update:modelValue', digits);
    event.target.value = digits;
}

defineExpose({ focus: focusInput });
</script>
