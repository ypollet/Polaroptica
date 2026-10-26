import { defineStore } from 'pinia'
import type { Project } from '@optica/core'
import type { RotationAcquisition, RotationImage } from '@/data/models/rotation'

export const useSettingsStore = defineStore('settings', {
  state: () => ({ isLeft: false }),
  actions: {
    useToggleLeft(value: boolean) {
      this.isLeft = value
    },
  },
  persist: {
    storage: localStorage,
    key: 'settings',
  }
})

// The project holds everything else: images, camera and annotations of each acquisition.
// Its annotations are saved by usePersistedAnnotations (ViewerView).
export const useImagesStore = defineStore('images', {
  state: () => ({
    objectPath: "",
    project: null as Project<RotationImage, RotationAcquisition> | null,
  }),
  getters: {
    acquisition: (state) => state.project?.acquisition ?? null,
    // typed from the state: the store unwraps the classes (protected members are dropped)
    annotations: (state) => state.project?.acquisition?.annotations ?? null,
    selectedImage(): RotationImage | null {
      return this.acquisition?.selectedImage ?? null
    },
    angle(): number {
      return this.acquisition?.angle ?? -1
    },
  },
  actions: {
    setPath(path: string) {
      this.$reset()
      this.objectPath = path
    },
    setIndex(index: number) {
      this.acquisition?.setIndex(index)
    },
    increment() {
      this.acquisition?.moveIndex(1)
    },
    decrement() {
      this.acquisition?.moveIndex(-1)
    },
    goToAngle(angle: number) {
      this.acquisition?.goToAngle(angle)
    },
  },
})
