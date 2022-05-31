<template>
  <n-grid
    cols="1 780:2"
    x-gap="10"
    y-gap="10"
  >
    <n-grid-item>
      <n-card
        embedded
        title="运行"
      >
        <n-space vertical>
          <div>
            <label class="w-24 inline-block">运行状态：</label>
            <n-switch size="medium">
              <template #checked>
                运行中
              </template>
              <template #unchecked>
                已停止
              </template>
            </n-switch>
          </div>
          <div class="flex items-center">
            <label class="w-24 inline-block">本地IP：</label>
            <n-text
              class="mr-0.5 "
              type="primary"
              code
            >
              127.0.0.1
            </n-text>
            <n-button
              quaternary
              size="small"
              @click="handleClipboardCopy('127.0.0.1')"
            >
              <template #icon>
                <n-icon :component="Copy" />
              </template>
            </n-button>
          </div>
          <div class="flex items-center">
            <label class="w-24 inline-block">SOCKS代理：</label>
            <n-text
              class="mr-0.5 "
              type="primary"
              code
            >
              socks5://127.0.0.1:7890
            </n-text>
            <n-button
              quaternary
              size="small"
              @click="handleClipboardCopy('socks5://127.0.0.1:7890')"
            >
              <template #icon>
                <n-icon :component="Copy" />
              </template>
            </n-button>
          </div>
          <div class="flex items-center ">
            <label class="w-24 inline-block">HTTP代理：</label>
            <n-text
              class="mr-0.5 "
              type="primary"
              code
            >
              http://127.0.0.1:7890
            </n-text>
            <n-button
              quaternary
              size="small"
              @click="handleClipboardCopy('http://127.0.0.1:7890')"
            >
              <template #icon>
                <n-icon :component="Copy" />
              </template>
            </n-button>
          </div>
        </n-space>
      </n-card>
    </n-grid-item>
    <n-grid-item>
      <n-card
        embedded
        title="访问检测"
        class="h-full"
      >
        <n-empty description="Coming Soon" />
      </n-card>
    </n-grid-item>
  </n-grid>
</template>

<script setup lang="ts">
import {
  NIcon, NLayout, NLayoutSider, NMenu, NCard, NSwitch, NText, NSpace, NButton, NGrid, NGridItem,
  useMessage, NEmpty,
} from 'naive-ui'

import {
  Dashboard, ServerProxy, Document, Settings, Copy, Rule,
} from '@vicons/carbon'

const message = useMessage()
function handleClipboardCopy(text: string) {
  window.copyTextToClipboard(text)
  message.success('Copy Success')
}
</script>

<style scoped>

</style>
