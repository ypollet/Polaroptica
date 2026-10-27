<script lang="ts" setup>
import { ref, computed, type HTMLAttributes } from 'vue';
import type { CircularSliderProps, CircularSliderEmits } from '.';
import { cn } from 'optica-core'

const props = defineProps<CircularSliderProps & { class?: HTMLAttributes['class'] }>()
const emits = defineEmits<CircularSliderEmits>()

const containerSize = 150;
const sliderSize = ref(25);
const stepSize = ref(3);
const radius = containerSize / 2;
const mdown = ref(false);
const degrees = ref(0);

const sliderInset = computed(() => {
  let degreesVal = (props.modelValue != undefined) ? props.modelValue : degrees.value
  const X = Math.round(radius * Math.sin((degreesVal * Math.PI) / 180));
  const Y = Math.round(radius * -Math.cos((degreesVal * Math.PI) / 180));
  const top = `${Y + radius - sliderSize.value / 2}px`;
  const left = `${X + radius - sliderSize.value / 2}px`;

  return `${top} 0 0 ${left}`;
});

const stepInset = (angle: number) => {
  const X = Math.round(radius * Math.sin((angle * Math.PI) / 180));
  const Y = Math.round(radius * -Math.cos((angle * Math.PI) / 180));
  const top = `${Y + radius - stepSize.value / 2}px`;
  const left = `${X + radius - stepSize.value / 2}px`;

  return `${top} 0 0 ${left}`;
}

const degreesView = computed(() => {
  
  return Math.round((props.modelValue != undefined) ? props.modelValue : degrees.value);
});

const handleMouseMove = (e: MouseEvent) => {
  if (mdown.value) {
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();

    

    var centerX = rect.width / 2;
    var centerY = rect.height / 2;
    
    const offsetX = e.clientX - rect.left;
    const offsetY = e.clientY - rect.top;

    const atan = Math.atan2(offsetX - centerX, offsetY - centerY);
    let newDegrees = Math.round(-atan / (Math.PI / 180) + 180);

    if (newDegrees === 360) {
      newDegrees = 0;
    }

    if (props.steps == undefined || props.steps.has(newDegrees)) {
      degrees.value = newDegrees;
      emits('update:modelValue', newDegrees)
    }
  }
};

const handleMouseDown = () => {
  mdown.value = true
};
const handleMouseUp = () => {
  mdown.value = false
};
</script>

<template>
  <div id="completeContainer" class="p-0 h-full flex justify-center items-center" @mousemove="handleMouseMove" @mouseleave="handleMouseUp" @mouseup="handleMouseUp" >
    <div id="rotationSliderContainer" :class="cn(
      'relative touch-none select-none rounded-full bg-gray-300 dark:bg-gray-300',
      'cursor-default flex justify-center items-center',
      props.class,
    )" >
      <div id="rotationSlider" @mousedown="handleMouseDown" :class="cn(
        ((mdown) ? 'bg-red-600 dark:bg-red-600' : 'bg-gray-400 dark:bg-gray-600'),
        'absolute cursor-pointer rounded-full',
      )"></div>
      <div id="rotationSliderDegrees" class="text-3xl text-black dark:text-gray-600">{{ degreesView }}&deg;</div>
      <div v-for="step in props.steps":style="'--angle: ' + stepInset(step)" class="rotationStep rounded-full bg-gray-600 dark:bg-gray-400"></div>
    </div>
  </div>
</template>

<style scoped>
#rotationSliderContainer {
  width: v-bind("containerSize + 'px'");
  height: v-bind("containerSize + 'px'");
}

#rotationSlider {
  inset: v-bind('sliderInset');
  height: v-bind("sliderSize + 'px'");
  width: v-bind("sliderSize + 'px'");
}

.rotationStep {
  position: absolute;
  inset: var(--angle);
  height: v-bind("stepSize + 'px'");
  width: v-bind("stepSize + 'px'");
}

#rotationSliderDegrees {
  user-select: none;
}
</style>