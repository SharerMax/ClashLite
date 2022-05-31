<template>
  <n-layout
    has-sider
    class="h-screen"
  >
    <n-layout-sider width="180">
      <n-menu
        :options="menuOptions"
        :value="activatedMenu"
        @update:value="key => activatedMenu = key"
      />
    </n-layout-sider>
    <n-layout class="p-4">
      <router-view />
    </n-layout>
  </n-layout>
</template>

<script setup lang="ts">
import {
  Component, defineComponent, h, ref,
} from 'vue'
import {
  NIcon, NLayout, NLayoutSider, NMenu,
} from 'naive-ui'
import type { MenuOption } from 'naive-ui'
import {
  Dashboard, ServerProxy, Document, Settings, Rule,
} from '@vicons/carbon'

import { RouterLink } from 'vue-router'

function renderIcon(icon: Component) {
  return () => h(NIcon, null, {
    default: () => h(icon),
  })
}

const activatedMenu = ref('overview')
const menuOptions: MenuOption[] = [
  {
    label: () => h(RouterLink, {
      to: {
        name: 'HomeOverview',
      },
    }, {
      default: () => '概览',
    }),
    key: 'overview',
    icon: renderIcon(Dashboard),
  },
  {
    label: () => h(RouterLink, {
      to: {
        name: 'HomeProxy',
      },
    }, {
      default: () => '代理',
    }),
    key: 'proxy',
    icon: renderIcon(ServerProxy),
  },
  {
    label: () => h(RouterLink, {
      to: {
        name: 'HomeRule',
      },
    }, {
      default: () => '规则',
    }),
    key: 'rule',
    icon: renderIcon(Rule),
  },
  {
    label: () => h(RouterLink, {
      to: {
        name: 'HomeLog',
      },
    }, {
      default: () => '日志',
    }),
    key: 'log',
    icon: renderIcon(Document),
  },
  {
    label: () => h(RouterLink, {
      to: {
        name: 'HomeSetting',
      },
    }, {
      default: () => '设置',
    }),
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
