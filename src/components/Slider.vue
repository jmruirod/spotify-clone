<script setup lang="ts">
import { ref, watch } from "vue";

const backgroundSize = ref(`100% 100%`);
const modelValue = defineModel<number>();
const rangeInput = ref<HTMLInputElement>();

defineProps<{
  min: number;
  max: number;
}>();

watch(modelValue, (newModelValue) => {
  const minValue = parseInt(rangeInput.value!.min);
  const maxValue = parseInt(rangeInput.value!.max);
  const currentValue = newModelValue;
  backgroundSize.value = `${((currentValue! - minValue) / (maxValue - minValue)) * 100}% 100%`;
});
</script>

<template>
  <div class="flex justify-center items-center gap-x-2">
    <slot name="before" id="before"></slot>
    <input
      ref="rangeInput"
      type="range"
      v-model="modelValue"
      :min="min"
      :max="max"
      :style="{ backgroundSize }"
    />
    <slot name="after"></slot>
  </div>
</template>

<style scoped>
input[type="range"] {
  -webkit-appearance: none;
  appearance: none;
  background: var(--color-zinc-800);
  height: calc(var(--spacing) * 1.3);
  border-radius: var(--radius-lg);
  background-image: linear-gradient(white, white);
  /* background-size: 100% 100%; */
  background-repeat: no-repeat;
  cursor: pointer;
}

input[type="range"]:hover {
  background-image: linear-gradient(var(--color-emerald-600), var(--color-emerald-600));
  background-size: 100% 100%;
  background-repeat: no-repeat;
}

.hover {
  background-image: linear-gradient(var(--color-emerald-600), var(--color-emerald-600));
  background-size: 100% 100%;
  background-repeat: no-repeat;
}

/* Chrome, Safari, Edge */
input[type="range"]::-webkit-slider-thumb {
  -webkit-appearance: none; /* clear browser thumb */
  appearance: none;
  width: calc(var(--spacing) * 1.3);
  height: calc(var(--spacing) * 1.3);
  background: white;
  border-radius: calc(infinity * 1px);
}

input[type="range"]:hover::-webkit-slider-thumb {
  width: 0.8rem;
  height: 0.8rem;
  background: white;
  border-radius: 50%;
}

.hover::-webkit-slider-thumb {
  width: 0.8rem;
  height: 0.8rem;
  background: white;
  border-radius: 50%;
}

/* Firefox */
input[type="range"]::-moz-range-thumb {
  appearance: none;
  border: none;
  width: calc(var(--spacing) * 1.3);
  height: calc(var(--spacing) * 1.3);
  background: white;
  border-radius: calc(infinity * 1px);
}

input[type="range"]:hover::-moz-range-thumb {
  width: 0.8rem;
  height: 0.8rem;
  background: white;
  border-radius: 50%;
}

.hover::-moz-range-thumb {
  width: 0.8rem;
  height: 0.8rem;
  background: white;
  border-radius: 50%;
}
</style>
