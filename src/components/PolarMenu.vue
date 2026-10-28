<script setup lang="ts">
<<<<<<< HEAD
import { downloadCSV, downloadJSON, exportFilename } from 'optica-core'
import { AppMenu } from 'optica-core/ui/app-menu'
import { credits } from '@/config/credits'
=======
import { downloadCSV, downloadJSON, exportFilename } from '@optica/core'
import { AppMenu } from '@optica/core/ui/app-menu'
>>>>>>> ba35e77 (Fix : added credits + image info)
import { useImagesStore, useSettingsStore } from '@/lib/stores'
import { Credits } from '@/components/credits'

const settingsStore = useSettingsStore()
const imagesStore = useImagesStore()

// the annotations of every acquisition, by acquisition id
function exportAnnotations(format: "csv" | "json") {
  const project = imagesStore.project
  if (!project) {
    return
  }
  if (format == "csv") {
    downloadCSV(project.annotationsToCSVRows(), exportFilename("polar", imagesStore.objectPath, "csv"))
  } else {
    downloadJSON(project.annotationsToJSON(), exportFilename("polar", imagesStore.objectPath, "json"))
  }
}

// also reads the files exported before the acquisitions (one set of annotations)
function importAnnotations(content: string) {
  imagesStore.project?.importAnnotations(JSON.parse(content))
}
</script>

<template>
  <AppMenu :reverse="settingsStore.isLeft" @update:reverse="settingsStore.useToggleLeft" app-name="Polaroptica"
    @export="exportAnnotations" @import="importAnnotations">
    <template #credits>
      <Credits />
    </template>
    </AppMenu>
</template>
