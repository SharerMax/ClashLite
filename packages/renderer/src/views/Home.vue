<template>
  <n-layout
    has-sider
    class="h-screen"
  >
    <n-layout-sider width="180">
      <n-menu :options="menuOptions" />
    </n-layout-sider>
    <n-layout class="p-4">
      <div class="flex">
        <n-card
          embedded
          title="运行"
        >
          <n-space vertical>
            <div>
              运行状态：<n-switch size="medium">
                <template #checked>
                  运行中
                </template>
                <template #unchecked>
                  已停止
                </template>
              </n-switch>
            </div>
            <div class="flex items-center">
              本地IP：<n-text
                class="mr-0.5"
                type="primary"
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
              SOCKS代理：<n-text
                class="mr-0.5"
                type="primary"
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
            <div class="flex items-center">
              HTTP代理：<n-text
                class="mr-0.5"
                type="primary"
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
      </div>
    </n-layout>
  </n-layout>
</template>

<script setup lang="ts">
import { Component, defineComponent, h } from 'vue'
import {
  NIcon, NLayout, NLayoutSider, NMenu, NCard, NSwitch, NText, NSpace, NButton,
  useMessage,
} from 'naive-ui'
import type { MenuOption } from 'naive-ui'
import {
  Dashboard, ServerProxy, Document, Settings, Copy,
} from '@vicons/carbon'

function renderIcon(icon: Component) {
  return () => h(NIcon, null, {
    default: () => h(icon),
  })
}
const menuOptions: MenuOption[] = [
  {
    label: '概览',
    key: 'overview',
    icon: renderIcon(Dashboard),
  },
  {
    label: '代理',
    key: 'proxy',
    icon: renderIcon(ServerProxy),
  },
  {
    label: '日志',
    key: 'log',
    icon: renderIcon(Document),
  },
  {
    label: '设置',
    key: 'setting',
    icon: renderIcon(Settings),
  },
]
const message = useMessage()
function handleClipboardCopy(text: string) {
  window.copyTextToClipboard(text)
  message.success('Copy Success')
}
</script>
<script lang="ts">
export default defineComponent({
  name: 'AppHome',
})
</script>

<style scoped>
.page-wrapper {
    width: 100%;
    height: 100vh;
}
</style>
