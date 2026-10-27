<script setup lang="ts">
import { usePersistedAnnotations } from 'optica-core'
import { Separator } from 'optica-core/ui/separator'
import MainLogo from '@/components/logo/MainLogo.vue'
import PolarMenu from '@/components/PolarMenu.vue'
import PolarViewer from '@/components/PolarViewer.vue'
import Sidebar from '@/components/Sidebar.vue'
import { useImagesStore, useSettingsStore } from '@/lib/stores'

const settingsStore = useSettingsStore()
const imageStore = useImagesStore()

const urlParams = new URLSearchParams(window.location.search)
imageStore.setPath(urlParams.get('series') as string)

// the annotations survive a reload (sessionStorage, by series)
usePersistedAnnotations(() => imageStore.project)
</script>

<template>
  <main class="h-screen">
    <div class="flex menu">
      <PolarMenu class="sticky top-0 flex flex-row grow z-50" />
      <div class="flex pr-2 items-center space-x-2">
        <MainLogo :height=35 :width=35 />
        <h1 class="font-dejavu font-bold text-brand">Polaroptica</h1>
      </div>
    </div>
    <Separator />
    <div class="rest_height flex" :class="settingsStore.isLeft ? 'flex-row' : 'flex-row-reverse'">
      <div class="sidebar overflow-auto w-96 flex-none rounded-md border p-4">
        <Sidebar />
      </div>
      <div class="rest-width w-0 flex-auto items-center justify-center">
        <PolarViewer />
      </div>
    </div>
  </main>
</template>

<style scoped>
.menu {
  height: 40px;
}

.sidebar {
  width: 25%;
}

.rest_height {
  height: calc(100% - 40px);
}

.rest_width {
  width: 75%;
}
</style>
