<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { AnnotationsPanel } from 'optica-core/ui/annotations-panel'
import { Label } from 'optica-core/ui/label'
import { CircularSlider } from '@/components/circular-slider'
import { angleOf } from '@/data/models/rotation'
import { useImagesStore } from '@/lib/stores'
import { ImageOverview } from 'optica-core/ui/image-overview'

const imagesStore = useImagesStore()
const { acquisition, annotations, selectedImage } = storeToRefs(imagesStore)
</script>

<template>
  <div class="flex flex-col pb-[12px] w-auto h-full">
    <div class="flex flex-col items-center space-y-4 py-4">
      <ImageOverview v-if="acquisition && selectedImage" class="w-full" :image="selectedImage" :size="acquisition.sizeOf()"
        :camera="acquisition.camera" thumbnail-class="border-none">
        <template #aside>
          <CircularSlider :model-value="imagesStore.angle" :steps="acquisition.angleSteps"
            @update:model-value="(angle) => { if (angle != undefined) imagesStore.goToAngle(angle) }" />
        </template>
      </ImageOverview>
      <!-- the annotations of the shown acquisition -->
      <AnnotationsPanel v-if="annotations" :annotations="annotations">
        <template #landmark-info="{ landmark }">
          <Label class="inline-block w-8 text-right tabular-nums whitespace-nowrap"
            @dblclick="imagesStore.goToAngle(angleOf(landmark))">
            {{ angleOf(landmark) }}°
          </Label>
        </template>
        <template #measure-info="{ annotation }">
          <Label v-if="annotations.angleOf(annotation) != null" class="inline-block w-10 text-right tabular-nums whitespace-nowrap"
            title="Image on which all the landmarks are placed" @dblclick.stop="imagesStore.goToAngle(annotations.angleOf(annotation)!)">
            {{ annotations.angleOf(annotation) }}°
          </Label>
        </template>
      </AnnotationsPanel>
    </div>
  </div>
</template>
