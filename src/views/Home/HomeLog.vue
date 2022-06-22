<template>
  <div class="flex flex-col h-screen p-4 box-border">
    <div class="flex flex-none">
      <n-h2>日志</n-h2>
      <n-button
        class="ml-a"
        quaternary
        size="small"
        type="warning"
        @click="handleClearLogButtonClick"
      >
        <template #icon>
          <n-icon :component="Clean" />
        </template>
      </n-button>
    </div>
    <div class="flex-1 overflow-hidden">
      <n-card
        class="h-full"
        content-style="height:100%;"
      >
        <n-scrollbar class="h-full">
          <n-log
            :log="log"
            :rows="logRowNum"
          />
        </n-scrollbar>
      </n-card>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  NH2, NButton, NIcon, NLog, NCard, NScrollbar,
} from 'naive-ui'
import { Clean } from '@vicons/carbon'
import { ref, computed } from 'vue'

const logRowNum = ref(500)

function generateLog(row: number) {
  const l: string[] = []
  for (let i = 0; i < row; ++i) {
    l.push(Math.random().toString(16))
  }
  return `${l.join('\n')}\n`
}
const log = computed(() => generateLog(logRowNum.value))

function handleClearLogButtonClick() {
  logRowNum.value = 0
}
</script>

<style scoped>

</style>
