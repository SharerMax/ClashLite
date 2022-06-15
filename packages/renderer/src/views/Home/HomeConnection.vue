<template>
  <div class="p-4 flex flex-col box-border h-screen">
    <div class="flex-none flex">
      <n-h2>连接</n-h2>
      <n-button
        size="small"
        type="error"
        class="ml-a"
        quaternary
      >
        <template #icon>
          <n-icon :component="Close" />
        </template>
        断开所有
      </n-button>
    </div>
    <div class="flex-1 overflow-hidden">
      <n-scrollbar trigger="none">
        <n-list bordered>
          <n-list-item
            v-for="i in 100"
            :key="i"
          >
            {{ i }}
          </n-list-item>
        </n-list>
      </n-scrollbar>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  NH2, NButton, NIcon, NList, NListItem, NScrollbar,
} from 'naive-ui'
import { Close } from '@vicons/carbon'
</script>

<style scoped>
/* :deep(.n-scrollbar-rail--vertical) {
  right: -6px !important;
} */
</style>
