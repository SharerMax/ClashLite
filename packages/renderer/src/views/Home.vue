<template>
  <n-layout
    has-sider
    class="h-screen"
  >
    <n-layout-sider width="180">
      <n-menu :options="menuOptions" />
    </n-layout-sider>
    <n-layout class="p-4">
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
    </n-layout>
  </n-layout>
</template>

<script setup lang="ts">
import { Component, defineComponent, h } from 'vue'
import {
  NIcon, NLayout, NLayoutSider, NMenu, NCard, NSwitch, NText, NSpace, NButton, NGrid, NGridItem,
  useMessage, NEmpty,
} from 'naive-ui'
import type { MenuOption } from 'naive-ui'
import {
  Dashboard, ServerProxy, Document, Settings, Copy, Rule,
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
    label: '规则',
    key: 'rule',
    icon: renderIcon(Rule),
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
