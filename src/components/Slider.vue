<script setup lang="ts">
import { ref, watch } from "vue";

const modelValue = defineModel<number>({ required: true });
const rangeInput = ref<HTMLInputElement>();
const backgroundSize = ref(`${modelValue.value} 100%`);

defineProps<{
  width?: string;
  paddingTop?: string;
  paddingBottom?: string;
  min: number;
  max: number;
  isHovering?: boolean;
}>();

const emit = defineEmits(["update:modelValue", "onSliderRelease", "onSliderMouseDown"]);

const handleSliderChange = () => {
  emit("update:modelValue", parseInt(rangeInput.value!.value!));
};

const handleSliderMouseDown = (event: Event) => {
  emit("onSliderMouseDown", event);
};

const handleSliderRelease = (event: Event) => {
  emit("onSliderRelease", event);
};

watch(modelValue, (newModelValue) => {
  const minValue = parseInt(rangeInput.value!.min);
  const maxValue = parseInt(rangeInput.value!.max);
  backgroundSize.value = `${((newModelValue! - minValue) / (maxValue - minValue)) * 100}% 100%`;
});
</script>

<template>
  <div :class="`flex justify-center items-center gap-x-2 ${paddingTop} ${paddingBottom}`">
    <slot name="before"></slot>
    <input
      ref="rangeInput"
      type="range"
      :value="modelValue"
      :min="min"
      :max="max"
      :style="{ backgroundSize }"
      :class="[width, { hover: isHovering }]"
      :hover="isHovering"
      @input="handleSliderChange"
      @mousedown="handleSliderMouseDown($event)"
      @mouseup="handleSliderRelease($event)"
    />
    <slot name="after"></slot>
  </div>
</template>

<style scoped>
input[type="range"] {
  -webkit-appearance: none;
  appearance: none;
  background: var(--color-zinc-800);
  height: calc(var(--spacing) * 1.2);
  border-radius: var(--radius-lg);
  background-image: linear-gradient(white, white);
  background-repeat: no-repeat;
  cursor: pointer;
}

input[type="range"]:hover,
input[type="range"].hover {
  background-image: linear-gradient(var(--color-emerald-600), var(--color-emerald-600));
  background-size: 100% 100%;
  background-repeat: no-repeat;
}

/* Chrome, Safari, Edge */
input[type="range"]::-webkit-slider-thumb {
  -webkit-appearance: none; /* clear browser thumb */
  appearance: none;
  width: calc(var(--spacing) * 1.2);
  height: calc(var(--spacing) * 1.2);
  background: white;
  border-radius: calc(infinity * 1px);
}

input[type="range"]:hover::-webkit-slider-thumb,
input[type="range"].hover::-webkit-slider-thumb {
  width: 0.7rem;
  height: 0.7rem;
  background: white;
  border-radius: 50%;
}

/* Firefox */
input[type="range"]::-moz-range-thumb {
  appearance: none;
  border: none;
  width: calc(var(--spacing) * 1.2);
  height: calc(var(--spacing) * 1.2);
  background: white;
  border-radius: calc(infinity * 1px);
}

input[type="range"]:hover::-moz-range-thumb,
input[type="range"].hover::-moz-range-thumb {
  width: 0.7rem;
  height: 0.7rem;
  background: white;
  border-radius: 50%;
}
</style>
