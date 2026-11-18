<script setup lang="ts">
import { PhMouseLeftClick } from '@phosphor-icons/vue'
import {
  DrawingHelp, HelpGuide, HelpSection, ManagingHelp, MeasuresHelp, MenusHelp, NavigationHelp,
} from 'optica-core/ui/help-guide'
</script>

<template>
  <HelpGuide app-name="Polaroptica">
    <template #about>
      <p>Polaroptica shows a specimen under polarized light, photographed with the polarizer turned step by step
        around 360°.</p>
      <p>Browsing the angles shows how the appearance of the specimen changes with the polarization, and annotations
        can be placed on any of them.</p>
    </template>

    <NavigationHelp>
      <li>
        <strong>Circular slider</strong> (left of the thumbnail): drag its knob to change the angle, the dots are the
        angles that were captured
      </li>
      <li>
        <kbd class="rounded border px-1 text-xs">←</kbd> <kbd class="rounded border px-1 text-xs">↓</kbd> /
        <kbd class="rounded border px-1 text-xs">→</kbd> <kbd class="rounded border px-1 text-xs">↑</kbd>: previous /
        next angle, after the last one it starts again from the first one
      </li>
      <li>
        <PhMouseLeftClick class="inline h-5 w-5 align-text-bottom" weight="fill" /><span
          class="text-xs font-bold">x2</span> on a landmark in the image, or on an angle in the sidebar: goes to the
        angle it was placed on
      </li>
    </NavigationHelp>

    <HelpSection title="How it works">
      <li>All the images show the same view of the specimen, only the polarization angle changes</li>
      <li>
        A landmark keeps its position on every angle, the sidebar shows the angle it was placed on. Moving it on
        another angle places it on that one
      </li>
      <li>
        A distance, polygon or box is measured on one angle: its landmarks can only be placed or moved on the angle of
        its first one, shown next to its buttons
      </li>
    </HelpSection>

    <DrawingHelp />

    <ManagingHelp />

    <MeasuresHelp>
      <template #intro>
        <li>All values are in 2D: positions on the image, scaled by its pixel size if given</li>
      </template>
    </MeasuresHelp>

    <MenusHelp />
  </HelpGuide>
</template>
