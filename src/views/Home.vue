<template>
  <NLayout
    has-sider
    class="h-screen"
  >
    <NLayoutSider width="140">
      <div class="text-center my-4">
        <img
          src="../../src/assets/electron.png"
          class="w-20 h-20"
        >
      </div>
      <NMenu
        :options="menuOptions"
        :value="activatedMenu"
        @update:value="key => activatedMenu = key"
      />
    </NLayoutSider>
    <NLayout class="h-full">
      <router-view />
    </NLayout>
  </NLayout>
</template>

<script setup lang="ts">
import {
  NIcon, NLayout, NLayoutSider, NMenu,
} from 'naive-ui'
import type { Component } from 'vue'
import { defineComponent, h, ref, watchEffect } from 'vue'

import type { MenuOption } from 'naive-ui'
import {
  Connect, Dashboard, Document, Rule, ServerProxy, Settings,
} from '@vicons/carbon'

import { RouterLink, useRoute } from 'vue-router'

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
        name: 'HomeConnection',
      },
    }, {
      default: () => '连接',
    }),
    key: 'connection',
    icon: renderIcon(Connect),
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

const router = useRoute()
watchEffect(() => {
  switch (router.name) {
    case 'HomeOverview':
      activatedMenu.value = 'overview'
      break
    case 'HomeProxy':
      activatedMenu.value = 'proxy'
      break
    case 'HomeRule':
      activatedMenu.value = 'rule'
      break
    case 'HomeConnection':
      activatedMenu.value = 'connection'
      break
    case 'HomeLog':
      activatedMenu.value = 'log'
      break
    case 'HomeSetting':
      activatedMenu.value = 'setting'
      break
    default:
      break
  }
})
</script>

<script lang="ts">
export default defineComponent({
  name: 'AppHome',
})
// export default {
//   name: 'AppHome',
// }
</script>

<style scoped>
.page-wrapper {
    width: 100%;
    height: 100vh;
}
</style>
