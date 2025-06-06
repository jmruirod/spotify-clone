<script setup lang="ts">
import { ref, watch } from "vue";

const modelValue = defineModel<number>({ required: true });
const mouseDown = ref(false);
const percentageProgress = ref(0);
const progressWidth = ref("");
const sliderElement = ref<HTMLDivElement>();

const props = defineProps<{
  width?: string;
  paddingTop?: string;
  paddingBottom?: string;
  min: number;
  max: number;
}>();

const emit = defineEmits(["update:modelValue", "onSliderRelease", "onSliderMouseDown"]);

const updateSliderValue = (clientX: number) => {
  if (!sliderElement.value) return;

  const rect = sliderElement.value.getBoundingClientRect();
  const x = clientX - rect.left;
  const width = rect.width;

  const percentage = Math.max(0, Math.min(100, (x / width) * 100));
  percentageProgress.value = Math.round(percentage);

  const newValue = props.min + (percentage / 100) * (props.max - props.min);
  modelValue.value = Math.round(newValue);
};

const handleSliderMouseDown = (event: MouseEvent) => {
  mouseDown.value = true;
  emit("onSliderMouseDown", event);

  updateSliderValue(event.clientX);
};

const handleSliderRelease = (event: MouseEvent) => {
  mouseDown.value = false;
  emit("onSliderRelease", event);
};

const handleGlobalMouseMove = (event: MouseEvent) => {
  if (mouseDown.value) {
    updateSliderValue(event.clientX);
  }
};

const handleGlobalMouseUp = (event: MouseEvent) => {
  if (mouseDown.value) {
    handleSliderRelease(event);
  }
};

watch(mouseDown, (isDown) => {
  if (isDown) {
    document.addEventListener("mousemove", handleGlobalMouseMove);
    document.addEventListener("mouseup", handleGlobalMouseUp);
  } else {
    document.removeEventListener("mousemove", handleGlobalMouseMove);
    document.removeEventListener("mouseup", handleGlobalMouseUp);
  }
});

watch(modelValue, (newModelValue) => {
  const { max, min } = props;
  const percentage = ((newModelValue! - min) / (max - min)) * 100;
  progressWidth.value = `${Math.max(0, Math.min(100, percentage))}%`;
  console.log("progressWidth", progressWidth.value);
});
</script>

<template>
  <div :class="`flex justify-center items-center gap-x-2 ${paddingTop} ${paddingBottom}`">
    <slot name="before"></slot>
    <div
      ref="sliderElement"
      class="h-1 bg-slate-800 rounded-xl overflow-hidden hover:overflow-visible group cursor-pointer select-none"
      :class="width"
      @mousedown="handleSliderMouseDown($event)"
    >
      <div
        class="relative h-1 bg-white group-hover:bg-emerald-600 rounded-xl flex justify-end items-center pointer-events-none"
        :style="{ width: progressWidth }"
      >
        <div
          class="absolute top-[50%] translate-y-[-50%] right-[-6px] size-3 rounded-full bg-white opacity-0 group-hover:opacity-100 transition-all"
        ></div>
      </div>
    </div>
    <slot name="after"></slot>
  </div>
</template>
