<script setup lang="ts">
import type Color from 'color'
import { storeToRefs } from 'pinia'
import { Landmark, type Coordinates, type Pose } from 'optica-core'
import { ImageViewer } from 'optica-core/ui/image-viewer'
import { ProjectLoader } from 'optica-core/ui/project-loader'
import { getRepository } from '@/data/setup'
import { useImagesStore } from '@/lib/stores'

const imagesStore = useImagesStore()
const { acquisition, annotations, selectedImage } = storeToRefs(imagesStore)

const repository = getRepository()

async function loadProject() {
  const project = await repository.getImages(imagesStore.objectPath)
  imagesStore.project = project
  return project
}

async function createLandmark(pose: Pose, color?: Color): Promise<Landmark> {
  const id = annotations.value!.generateID()
  const position = await repository.computeLandmarkPosition(imagesStore.objectPath, pose)
  return new Landmark(id, id, pose, position, color)
}

async function place(pos: Coordinates) {
  const current = annotations.value
  if (!selectedImage.value || !current) {
    return
  }
  const pose = { marker: pos, image: selectedImage.value }
  if (current.tab == "landmarks") {
    current.landmarks.push(await createLandmark(pose))
    return
  }
  // a distance is measured on a single image
  const distance = current.selectedDistance ?? current.newDistance()
  if (current.acceptsAngle(distance, imagesStore.angle)) {
    distance.landmarks.push(await createLandmark(pose, distance.color))
  }
}

async function move(landmark: Landmark, pos: Coordinates) {
  if (!selectedImage.value) {
    return
  }
  landmark.setPose(selectedImage.value, pos)
  landmark.position = await repository.computeLandmarkPosition(imagesStore.objectPath, landmark.pose)
}
</script>

<template>
  <ProjectLoader :load="loadProject">
    <ImageViewer v-if="acquisition && annotations && selectedImage" class="object-fit" :image="selectedImage"
      :size="acquisition.sizeOf()" :camera="acquisition.camera" :landmarks="annotations.landmarks"
      :distances="annotations.distances" :can-drag="(landmark) => annotations!.canMoveTo(landmark, imagesStore.angle)"
      @place="place" @move="move" @remove="(landmark) => annotations!.removeLandmark(landmark.id)"
      @select="(landmark) => annotations!.showInSidebar(landmark)" />
  </ProjectLoader>
</template>
