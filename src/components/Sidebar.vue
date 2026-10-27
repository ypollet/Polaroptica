<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { AnnotationTabs } from 'optica-core/ui/annotation-tabs'
import { DistanceList } from 'optica-core/ui/distance'
import { Label } from 'optica-core/ui/label'
import { LandmarkList } from 'optica-core/ui/landmark'
import { ThumbnailViewer } from 'optica-core/ui/thumbnail-viewer'
import { CircularSlider } from '@/components/circular-slider'
import { angleOf } from '@/data/models/rotation'
import { useImagesStore } from '@/lib/stores'

const imagesStore = useImagesStore()
const { acquisition, annotations, selectedImage } = storeToRefs(imagesStore)
</script>

<template>
  <div class="flex flex-col pb-[12px] w-auto h-full">
    <div class="flex flex-col items-center space-y-4 py-4">
      <div v-if="acquisition && selectedImage" class="flex justify-center w-[350px]">
        <div class="w-1/2">
          <CircularSlider :model-value="imagesStore.angle" :steps="acquisition.angleSteps"
            @update:model-value="(angle) => { if (angle != undefined) imagesStore.goToAngle(angle) }" />
        </div>
        <ThumbnailViewer class="shrink w-1/2 border-none" :src="selectedImage.thumbnail || selectedImage.image"
          :alt="selectedImage.label" :size="acquisition.sizeOf()" :zoom-rect="acquisition.camera.zoomRect" />
      </div>
      <div class="flex grow flex-row w-full justify-center">
        <Label class="p-2">{{ selectedImage?.label }}</Label>
      </div>
      <!-- the annotations of the shown acquisition -->
      <AnnotationTabs v-if="annotations" v-model="annotations.tab">
        <template #landmarks>
          <LandmarkList v-model="annotations.landmarks">
            <template #info="{ landmark }">
              <Label class="inline-block w-8 text-right tabular-nums whitespace-nowrap"
                @dblclick="imagesStore.goToAngle(angleOf(landmark))">
                {{ angleOf(landmark) }}°
              </Label>
            </template>
          </LandmarkList>
        </template>
        <template #distances>
          <DistanceList v-model="annotations.distances" v-model:selected="annotations.selectedDistanceIndex"
            v-model:scale="annotations.scale" :adjust-factor="annotations.adjustFactor">
            <template #info="{ distance }">
              <Label v-if="annotations.angleOf(distance) != null" class="inline-block w-10 text-right tabular-nums whitespace-nowrap"
                title="Image on which all the landmarks are placed" @dblclick.stop="imagesStore.goToAngle(annotations.angleOf(distance)!)">
                {{ annotations.angleOf(distance) }}°
              </Label>
            </template>
          </DistanceList>
        </template>
      </AnnotationTabs>
    </div>
  </div>
</template>
