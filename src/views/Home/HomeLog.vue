<template>
  <div class="flex flex-col h-screen p-4 box-border">
    <div class="flex flex-none">
      <NH2>日志</NH2>
      <NButton
        class="ml-a"
        quaternary
        size="small"
        type="warning"
        @click="handleClearLogButtonClick"
      >
        <template #icon>
          <NIcon :component="Clean" />
        </template>
      </NButton>
    </div>
    <div class="flex-1 overflow-hidden">
      <NCard
        class="h-full"
        content-style="height:100%;"
      >
        <NScrollbar class="h-full">
          <NLog
            :log="log"
            :rows="logRowNum"
          />
        </NScrollbar>
      </NCard>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  NButton, NCard, NH2, NIcon, NLog, NScrollbar,
} from 'naive-ui'
import { Clean } from '@vicons/carbon'
import { computed, ref } from 'vue'

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
