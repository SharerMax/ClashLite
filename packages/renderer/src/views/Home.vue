<template>
  <n-layout
    has-sider
    class="h-screen"
  >
    <n-layout-sider width="180">
      <n-menu :options="menuOptions" />
    </n-layout-sider>
    <n-layout class="p-4">
      <p>1. 当前配置</p>
      <p>2. 网站可达性</p>
      <p>3. 实时流量 统计图及数据</p>
      <p>4. 是否运行</p>
      <p>5. 正向代理信息</p>
      <p>6. 允许局域网访问</p>
      <p>7. 系统代理</p>
    </n-layout>
  </n-layout>
</template>

<script setup lang="ts">
import { Component, defineComponent, h } from 'vue'
import {
  NIcon, NLayout, NLayoutSider, NMenu,
} from 'naive-ui'
import type { MenuOption } from 'naive-ui'
import {
  Dashboard, ServerProxy, Document, Settings,
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
