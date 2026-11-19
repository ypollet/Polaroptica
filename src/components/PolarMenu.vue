<script setup lang="ts">
import { downloadCSV, downloadJSON, exportFilename, annotationsFile } from 'optica-core'
import { AppMenu } from 'optica-core/ui/app-menu'
import { HelpGuide } from '@/components/help'
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
    downloadJSON(annotationsFile(project, "polaroptica"), exportFilename("polar", imagesStore.objectPath, "json"))
  }
}

// the exported files, current or older (upgraded by readAnnotationsFile);
// the landmarks without a position get it from the backend
function importAnnotations(content: string) {
  if (!imagesStore.project) {
    return
  }
  try {
    imagesStore.project.importAnnotationsFile(JSON.parse(content), { viewer: "polaroptica" })
  } catch (error) {
    console.error("Annotations not imported:", error)
    return
  }
  imagesStore.recomputePositions()
}
</script>

<template>
  <AppMenu :reverse="settingsStore.isLeft" @update:reverse="settingsStore.useToggleLeft" app-name="Polaroptica"
    @export="exportAnnotations" @import="importAnnotations">
    <template #help-guide>
      <HelpGuide />
    </template>
    <template #credits>
      <Credits />
    </template>
  </AppMenu>
</template>
